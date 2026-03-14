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

    // Process passengers: sanitize data and add zone numbers from GPS coordinates
    const processedPassengers = body.passengers.map((passenger: any) => {
      const passengerData = {
        ...passenger,
        // Sanitize passenger data
        clientName: sanitizeString(passenger.clientName, 100),
        tel: sanitizePhoneNumber(passenger.tel),
        fromStreet: sanitizeString(passenger.fromStreet, 200),
        fromCity: sanitizeString(passenger.fromCity, 100),
        fromPostalCode: passenger.fromPostalCode ? sanitizePostalCode(passenger.fromPostalCode) : undefined,
        toStreet: passenger.toStreet ? sanitizeString(passenger.toStreet, 200) : undefined,
        toCity: passenger.toCity ? sanitizeString(passenger.toCity, 100) : undefined,
        toPostalCode: passenger.toPostalCode ? sanitizePostalCode(passenger.toPostalCode) : undefined,
      };

      // Determine fromZoneNo from GPS coordinates if available
      if (passenger.fromLat && passenger.fromLon) {
        passengerData.fromZoneNo = getZoneFromCoordinates(passenger.fromLon, passenger.fromLat);
      }

      // Determine toZoneNo from GPS coordinates if available
      if (passenger.toLat && passenger.toLon) {
        passengerData.toZoneNo = getZoneFromCoordinates(passenger.toLon, passenger.toLat);
      }

      return passengerData;
    });

    // Build enhanced booking payload with sanitized data
    const bookingData = {
      ...body,
      passengers: processedPassengers,
      // Add required dispatch fields
      carGroupId: body.carGroupId || 1, // Default to standard taxi (group 1)
      numberOfCars: body.numberOfCars || 1, // Default to 1 car
      // Sanitize optional fields
      orderedBy: body.orderedBy ? sanitizeString(body.orderedBy, 100) : undefined,
      messageToCar: body.messageToCar ? sanitizeString(body.messageToCar, 500) : undefined,
    };

    // Convert attributes array to comma-separated string if present
    if (Array.isArray(bookingData.attributes) && bookingData.attributes.length > 0) {
      bookingData.attributes = bookingData.attributes.join(',');
    }

    console.log('Sending general booking request:', JSON.stringify(bookingData, null, 2));

    // Call Taxi4U API with authentication (handles token refresh)
    const response = await taxi4uFetch(
      `https://api.taxi4u.cab/api/book/general?centralCode=${centralCode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('General booking failed:', { status: response.status, error, sentData: body });
      return NextResponse.json(
        { error: 'Booking failed', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check for error in response
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
