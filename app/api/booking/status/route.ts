import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookRef = searchParams.get('bookRef');

    if (!bookRef) {
      return NextResponse.json(
        { success: false, error: 'Booking reference is required' },
        { status: 400 }
      );
    }

    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';

    // Call Taxi4U API to get booking details
    const response = await taxi4uFetch(
      `https://api.taxi4u.cab/api/bookingdetails?centralCode=${centralCode}&bookRef=${encodeURIComponent(bookRef)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        );
      }

      const error = await response.text();
      console.error('Booking status check failed:', { status: response.status, error });
      return NextResponse.json(
        { success: false, error: 'Failed to check booking status' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the first passenger's data for display
    const firstPassenger = data.passengers?.[0] || {};

    // Transform the response to a flatter structure for the frontend
    const transformedBooking = {
      bookRef: data.bookRef,
      customerName: firstPassenger.clientName,
      pickupTime: data.pickupTime || firstPassenger.pickupTime,
      fromStreet: firstPassenger.fromStreet,
      fromCity: firstPassenger.fromCity,
      fromPostalCode: firstPassenger.fromPostalCode,
      toStreet: firstPassenger.toStreet,
      toCity: firstPassenger.toCity,
      toPostalCode: firstPassenger.toPostalCode,
      status: data.tripStatus,
      // Include full data for reference
      raw: data,
    };

    return NextResponse.json({
      success: true,
      booking: transformedBooking,
    });
  } catch (error) {
    console.error('Booking status error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
