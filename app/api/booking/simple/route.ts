import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import { getZoneNumber } from '@/lib/zones';
import { logBooking } from '@/lib/booking-stats';

// Simple booking endpoint (single passenger)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get central code from environment or use default
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';

    // Build booking payload with flat structure (Taxi4U API format)
    // Let Taxi4U API determine zones from full addresses
    const bookingData: any = {
      centralCode,
      // From location
      fromStreet: body.fromStreet,
      fromCity: body.fromCity,
      fromPostalCode: body.fromPostalCode,
      // To location (with defaults for optional destination)
      toStreet: body.toStreet || 'Ikke oppgitt', // "Not specified" in Norwegian
      toCity: body.toCity || '',
      toPostalCode: body.toPostalCode || '',
      // Customer information
      customerName: body.customerName,
      tel: body.tel,
      pickupTime: body.pickupTime,
      orderedBy: body.orderedBy || 'Website',
      // Required fields (even if empty)
      messageToCar: body.messageToDriver || body.messageToCar || '',
      messageToBooking: body.messageToBooking || '',
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
      logBooking({
        bookRef: undefined,
        customerName: body.customerName,
        fromCity: body.fromCity,
        toCity: body.toCity,
        pickupTime: body.pickupTime,
        bookingType: 'simple',
        success: false,
      });

      return NextResponse.json(
        { error: 'Booking failed', details: data.errorMessage },
        { status: 400 }
      );
    }

    // Log successful booking
    logBooking({
      bookRef: data.bookRef,
      customerName: body.customerName,
      fromCity: body.fromCity,
      toCity: body.toCity,
      pickupTime: body.pickupTime,
      bookingType: 'simple',
      success: true,
    });

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
