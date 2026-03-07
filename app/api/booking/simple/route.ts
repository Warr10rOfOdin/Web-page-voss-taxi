import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

// Simple booking endpoint (single passenger)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customerName || typeof body.customerName !== 'string' || body.customerName.trim() === '') {
      console.error('Validation error: Missing or invalid customerName');
      return NextResponse.json(
        { error: 'Invalid request', details: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!body.tel || typeof body.tel !== 'string' || body.tel.trim() === '') {
      console.error('Validation error: Missing or invalid phone number');
      return NextResponse.json(
        { error: 'Invalid request', details: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!body.fromStreet || typeof body.fromStreet !== 'string' || body.fromStreet.trim() === '') {
      console.error('Validation error: Missing or invalid pickup address');
      return NextResponse.json(
        { error: 'Invalid request', details: 'Pickup address is required' },
        { status: 400 }
      );
    }

    // Get central code from environment or use default
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';

    // Build booking payload with flat structure (Taxi4U API format)
    const bookingData: any = {
      centralCode,
      // From location - complete address
      fromStreet: body.fromStreet,
      fromCity: body.fromCity || 'Voss',
      fromPostalCode: body.fromPostalCode || '',
      // To location - optional, with defaults
      toStreet: body.toStreet || '',
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
      const errorText = await response.text();
      let errorDetails = errorText;

      // Try to parse error as JSON for better error messages
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorJson.error || errorText;

        console.error('Simple booking API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorJson,
          timestamp: new Date().toISOString(),
        });
      } catch {
        console.error('Simple booking API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          timestamp: new Date().toISOString(),
        });
      }

      return NextResponse.json(
        {
          error: 'Booking failed',
          details: errorDetails,
          statusCode: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check for error in response data
    if (data.errorMessage) {
      console.error('Simple booking response error:', {
        errorMessage: data.errorMessage,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: 'Booking failed', details: data.errorMessage },
        { status: 400 }
      );
    }

    // Log successful booking
    console.log('Simple booking successful:', {
      bookRef: data.bookRef,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      bookRef: data.bookRef,
      data,
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Simple booking unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        type: 'server_error'
      },
      { status: 500 }
    );
  }
}
