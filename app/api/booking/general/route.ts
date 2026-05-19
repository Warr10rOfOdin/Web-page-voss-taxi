import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import { getZoneFromCoordinates } from '@/lib/zone-lookup';
import { logBooking } from '@/lib/booking-stats';
import { validateGeneralBookingRequest, sanitizeString, sanitizePhoneNumber, sanitizePostalCode } from '@/lib/validation';

// General booking endpoint (multi-passenger, detailed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the booking request
    const validationResult = validateGeneralBookingRequest(body);
    if (!validationResult.isValid) {
      console.error('Booking validation failed:', validationResult.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.errors.join(', '),
          validationErrors: validationResult.errors,
        },
        { status: 400 }
      );
    }

    // Get central code from environment or use default
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';
    if (centralCode.length !== 2) {
      console.warn('TAXI4U_CENTRAL_CODE should be a 2-letter code, got:', centralCode);
    }

    // Build Passenger objects with only the fields defined in the WebAPIBook
    // Passenger schema. Spreading unknown fields can trip strict deserialisers
    // upstream. Required: seqNo, fromLat, fromLon, fromStreet, pickupTime.
    const processedPassengers = body.passengers.map((p: any, idx: number) => {
      const passenger: Record<string, unknown> = {
        seqNo: typeof p.seqNo === 'number' ? p.seqNo : idx + 1,
        clientName: p.clientName ? sanitizeString(p.clientName, 100) : undefined,
        tel: p.tel ? sanitizePhoneNumber(p.tel) : undefined,
        pickupTime: p.pickupTime,
        fromStreet: sanitizeString(p.fromStreet, 200),
        fromCity: p.fromCity ? sanitizeString(p.fromCity, 100) : undefined,
        fromPostalCode: p.fromPostalCode ? sanitizePostalCode(p.fromPostalCode) : undefined,
        fromLat: typeof p.fromLat === 'number' ? p.fromLat : undefined,
        fromLon: typeof p.fromLon === 'number' ? p.fromLon : undefined,
        toStreet: p.toStreet ? sanitizeString(p.toStreet, 200) : undefined,
        toCity: p.toCity ? sanitizeString(p.toCity, 100) : undefined,
        toPostalCode: p.toPostalCode ? sanitizePostalCode(p.toPostalCode) : undefined,
        toLat: typeof p.toLat === 'number' ? p.toLat : undefined,
        toLon: typeof p.toLon === 'number' ? p.toLon : undefined,
        clientNote: p.clientNote ? sanitizeString(p.clientNote, 500) : undefined,
        clientNoteToCar: typeof p.clientNoteToCar === 'boolean' ? p.clientNoteToCar : undefined,
      };

      if (typeof p.fromLat === 'number' && typeof p.fromLon === 'number') {
        passenger.fromZoneNo = getZoneFromCoordinates(p.fromLon, p.fromLat);
      }
      if (typeof p.toLat === 'number' && typeof p.toLon === 'number') {
        passenger.toZoneNo = getZoneFromCoordinates(p.toLon, p.toLat);
      }

      // Drop undefined keys so we don't send `null` for nullable fields the
      // user didn't fill in.
      Object.keys(passenger).forEach((k) => passenger[k] === undefined && delete passenger[k]);
      return passenger;
    });

    // Required: first passenger needs fromLat/fromLon (per Passenger schema).
    const first = processedPassengers[0] as Record<string, unknown>;
    if (typeof first.fromLat !== 'number' || typeof first.fromLon !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing pickup coordinates',
          details:
            'Pickup location is missing GPS coordinates. Pick the address from the suggestion list so coordinates are attached.',
        },
        { status: 400 }
      );
    }

    // Build Trip payload per WebAPIBook v1 spec. Only known Trip fields are
    // forwarded; carGroupId/numberOfCars are legacy and not in the schema.
    const wantsSms = body.sendSMSConfirmation !== false;
    const bookingData: Record<string, unknown> = {
      centralCode,
      pickupTime: body.pickupTime,
      orderedBy: body.orderedBy ? sanitizeString(body.orderedBy, 100) : undefined,
      messageToCar: body.messageToCar ? sanitizeString(body.messageToCar, 500) : undefined,
      messageToBooking: body.messageToBooking ? sanitizeString(body.messageToBooking, 500) : undefined,
      attributes: body.attributes,
      passengers: processedPassengers,
      // SMS booking confirmation. The new upstream stored procedure
      // expects an @sms_confirmation parameter, but the public Trip schema
      // doesn't yet document the JSON name the controller binds to.
      // Send the flag under every plausible name so whichever the
      // controller reads will match.
      sendSMSConfirmation: wantsSms,
      smsConfirmation: wantsSms,
      smsConfirmationToCustomer: wantsSms,
      sms_confirmation: wantsSms,
    };

    // Translate legacy numberOfCars (1..N) to Trip.additionalVehicles (0..N-1)
    if (typeof body.numberOfCars === 'number' && body.numberOfCars > 1) {
      bookingData.additionalVehicles = body.numberOfCars - 1;
    }
    if (typeof body.additionalVehicles === 'number' && body.additionalVehicles >= 0) {
      bookingData.additionalVehicles = body.additionalVehicles;
    }

    // attributes is a comma-separated string in the Trip schema.
    if (Array.isArray(bookingData.attributes) && bookingData.attributes.length > 0) {
      bookingData.attributes = bookingData.attributes.join(',');
    } else if (!bookingData.attributes) {
      delete bookingData.attributes;
    }

    Object.keys(bookingData).forEach(
      (k) => bookingData[k] === undefined && delete bookingData[k]
    );

    console.log('Sending general booking request:', JSON.stringify(bookingData, null, 2));

    // Call Taxi4U API with authentication (handles token refresh)
    const response = await taxi4uFetch(
      'https://api.taxi4u.cab/api/book/general',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      // 400/422 returns ApiErrorResponse { errors: string[] }; 500 returns
      // a plain ASP.NET ProblemDetails-ish object or a bare string.
      let rawDetails = errorText;
      try {
        const parsed = JSON.parse(errorText);
        if (Array.isArray(parsed?.errors)) {
          rawDetails = parsed.errors.join('; ');
        } else if (typeof parsed?.errorMessage === 'string' && parsed.errorMessage) {
          rawDetails = parsed.errorMessage;
        } else if (parsed?.error) {
          rawDetails = parsed.error;
        } else if (parsed?.detail) {
          rawDetails = parsed.detail;
        } else if (parsed?.title) {
          rawDetails = parsed.title;
        }
      } catch {
        // keep raw text
      }

      // Don't show SQL stack traces to end users. Detect known upstream
      // failures and replace with a short, actionable message.
      let userMessage = rawDetails;
      const looksLikeSqlCrash =
        response.status >= 500 ||
        /System\.Data\.SqlClient|SqlException|Procedure or function/i.test(rawDetails);
      if (looksLikeSqlCrash) {
        userMessage =
          'Booking-tenesta er midlertidig ute av drift. Prøv igjen om litt eller ring sentralen.';
      }

      console.error('General booking failed:', {
        upstreamStatus: response.status,
        upstreamBody: errorText,
        sentData: bookingData,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Booking failed',
          details: userMessage,
          rawDetails,
          upstreamStatus: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check for error in response (legacy field; success body is Trip with bookRef)
    if (data.errorMessage) {
      // Log failed booking
      try {
        const firstPassenger = body.passengers?.[0] || {};
        logBooking({
          bookRef: undefined,
          internalNo: undefined,
          customerName: body.orderedBy || firstPassenger.customerName || 'Unknown',
          fromCity: firstPassenger.fromCity || 'Unknown',
          toCity: firstPassenger.toCity || '',
          pickupTime: firstPassenger.pickupTime || body.pickupTime || '',
          bookingType: 'general',
          success: false,
        });
      } catch (logError) {
        console.error('Failed to log failed booking:', logError);
      }

      return NextResponse.json(
        { error: 'Booking failed', details: data.errorMessage },
        { status: 400 }
      );
    }

    // Log successful booking
    try {
      const firstPassenger = body.passengers?.[0] || {};
      logBooking({
        bookRef: data.bookRef,
        internalNo: data.internalNo,
        customerName: body.orderedBy || firstPassenger.customerName || 'Unknown',
        fromCity: firstPassenger.fromCity || 'Unknown',
        toCity: firstPassenger.toCity || '',
        pickupTime: firstPassenger.pickupTime || body.pickupTime || '',
        bookingType: 'general',
        success: true,
      });
    } catch (logError) {
      console.error('Failed to log successful booking:', logError);
      // Don't fail the booking just because logging failed
    }

    return NextResponse.json({
      success: true,
      internalNo: data.internalNo,
      bookRef: data.bookRef,
      data,
    });
  } catch (error) {
    console.error('General booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
