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
      // Remove all non-digit characters
      const digitsOnly = phone.replace(/\D/g, '');
      // Remove leading country code if present (47 for Norway)
      if (digitsOnly.startsWith('47') && digitsOnly.length > 8) {
        return digitsOnly.substring(2);
      }
      return digitsOnly;
    };

    const inputPhone = normalizePhone(phoneNumber);
    const bookingPhone = bookingData.passengers?.[0]?.tel
      ? normalizePhone(bookingData.passengers[0].tel)
      : '';

    console.log('Phone verification:', {
      input: phoneNumber,
      inputNormalized: inputPhone,
      booking: bookingData.passengers?.[0]?.tel,
      bookingNormalized: bookingPhone,
    });

    if (!bookingPhone) {
      return NextResponse.json(
        {
          success: false,
          error: 'No phone number associated with this booking.'
        },
        { status: 403 }
      );
    }

    // Compare last 8 digits (standard Norwegian mobile number length)
    const inputLast8 = inputPhone.slice(-8);
    const bookingLast8 = bookingPhone.slice(-8);

    if (inputLast8 !== bookingLast8) {
      console.log('Phone mismatch:', { inputLast8, bookingLast8 });
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
