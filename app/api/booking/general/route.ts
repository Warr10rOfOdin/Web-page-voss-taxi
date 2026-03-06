import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

// General booking endpoint (multi-passenger, detailed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get central code from environment or use default
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';

    // Build enhanced booking payload - send addresses as-is
    const bookingData = {
      ...body,
      // Add required dispatch fields
      carGroupId: body.carGroupId || 1, // Default to standard taxi (group 1)
      numberOfCars: body.numberOfCars || 1, // Default to 1 car
    };

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
      return NextResponse.json(
        { error: 'Booking failed', details: data.errorMessage },
        { status: 400 }
      );
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
