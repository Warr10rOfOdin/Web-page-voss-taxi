import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

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

    // Fetch booking details from Taxi4U API
    const response = await taxi4uFetch(
      `/api/bookingdetails?centralCode=vs&bookRef=${encodeURIComponent(bookRef)}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Taxi4U booking details failed:', response.status, errorText);

      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch booking details' },
        { status: response.status }
      );
    }

    const bookingData = await response.json();

    return NextResponse.json({
      success: true,
      booking: bookingData,
    });

  } catch (error) {
    console.error('Booking details error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch booking details'
      },
      { status: 500 }
    );
  }
}
