import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookRef = searchParams.get('bookRef');
    const phoneNumber = searchParams.get('phoneNumber');

    // GDPR Compliance: Require both booking reference and phone number
    if (!bookRef) {
      return NextResponse.json(
        { success: false, error: 'Booking reference is required' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required for verification' },
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

    // GDPR Security: Verify phone number matches booking
    // Normalize phone numbers for comparison (remove spaces, dashes, country codes)
    const normalizePhone = (phone: string) => {
      return phone.replace(/[\s\-\+]/g, '').replace(/^47/, ''); // Remove Norwegian country code
    };

    const inputPhone = normalizePhone(phoneNumber);
    const bookingPhone = bookingData.passengers?.[0]?.tel
      ? normalizePhone(bookingData.passengers[0].tel)
      : '';

    if (!bookingPhone || !inputPhone.endsWith(bookingPhone.slice(-8))) {
      // Check last 8 digits to allow for different formats
      return NextResponse.json(
        {
          success: false,
          error: 'Phone number does not match booking. Please verify your information.'
        },
        { status: 403 }
      );
    }

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
