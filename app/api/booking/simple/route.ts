import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import { getZoneNumber } from '@/lib/zones';
import { logBooking } from '@/lib/booking-stats';
import { validateSimpleBookingRequest, sanitizeString, sanitizePhoneNumber, sanitizePostalCode } from '@/lib/validation';

// Simple booking endpoint (single passenger)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the booking request
    const validationResult = validateSimpleBookingRequest(body);
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

    // Build booking payload with flat structure (Taxi4U API format)
    // Let Taxi4U API determine zones from full addresses
    const bookingData: any = {
      centralCode,
      // From location (sanitized)
      fromStreet: sanitizeString(body.fromStreet, 200),
      fromCity: sanitizeString(body.fromCity, 100),
      fromPostalCode: body.fromPostalCode ? sanitizePostalCode(body.fromPostalCode) : '',
      // To location (with defaults for optional destination, sanitized)
      toStreet: body.toStreet ? sanitizeString(body.toStreet, 200) : 'Ikke oppgitt', // "Not specified" in Norwegian
      toCity: body.toCity ? sanitizeString(body.toCity, 100) : '',
      toPostalCode: body.toPostalCode ? sanitizePostalCode(body.toPostalCode) : '',
      // Customer information (sanitized)
      customerName: sanitizeString(body.customerName, 100),
      tel: sanitizePhoneNumber(body.tel),
      pickupTime: body.pickupTime,
      orderedBy: body.orderedBy ? sanitizeString(body.orderedBy, 100) : 'Website',
      // Required fields (even if empty, sanitized)
      messageToCar: body.messageToDriver || body.messageToCar ? sanitizeString(body.messageToDriver || body.messageToCar, 500) : '',
      messageToBooking: body.messageToBooking ? sanitizeString(body.messageToBooking, 500) : '',
      taxiAccountNo: body.accountNumber || process.env.TAXI4U_DEFAULT_ACCOUNT_NO || '0',
      // attributes expects a comma-separated string, not an array
      attributes: Array.isArray(body.attributes)
        ? body.attributes.join(',')
        : (body.attributes || ''),
    };

    // Call Taxi4U API with authentication
    console.log('Sending booking request:', JSON.stringify(bookingData, null, 2));

    const response = await taxi4uFetch('https://api.taxi4u.cab/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Booking failed:', { status: response.status, error, sentData: bookingData });
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
        logBooking({
          bookRef: undefined,
          customerName: body.customerName,
          fromCity: body.fromCity,
          toCity: body.toCity,
          pickupTime: body.pickupTime,
          bookingType: 'simple',
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
      logBooking({
        bookRef: data.bookRef,
        customerName: body.customerName,
        fromCity: body.fromCity,
        toCity: body.toCity,
        pickupTime: body.pickupTime,
        bookingType: 'simple',
        success: true,
      });
    } catch (logError) {
      console.error('Failed to log successful booking:', logError);
      // Don't fail the booking just because logging failed
    }

    return NextResponse.json({
      success: true,
      bookRef: data.bookRef,
      data,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
