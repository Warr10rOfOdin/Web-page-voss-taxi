import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import { getZoneNumber } from '@/lib/zones';

// Simple booking endpoint (single passenger)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get central code from environment or use default
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';

    // Calculate zones
    const fromZone = getZoneNumber(body.fromPostalCode, body.fromCity);
    const toZone = getZoneNumber(body.toPostalCode, body.toCity);

    // Build booking payload with flat structure (Taxi4U API format)
    const bookingData: any = {
      centralCode,
      // From location
      fromStreet: body.fromStreet,
      fromCity: body.fromCity,
      fromPostalCode: body.fromPostalCode,
      fromZone,
      fromZoneNo: fromZone,
      // To location (with defaults for optional destination)
      toStreet: body.toStreet || 'Ikke oppgitt', // "Not specified" in Norwegian
      toCity: body.toCity || '',
      toPostalCode: body.toPostalCode || '',
      toZone,
      toZoneNo: toZone,
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
      return NextResponse.json(
        { error: 'Booking failed', details: data.errorMessage },
        { status: 400 }
      );
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
