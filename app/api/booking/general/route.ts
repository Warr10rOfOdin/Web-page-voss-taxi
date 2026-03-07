import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

// General booking endpoint (multi-passenger, detailed)
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();

    // Validate required fields
    if (!body.passengers || !Array.isArray(body.passengers) || body.passengers.length === 0) {
      console.error('Validation error: Missing or invalid passengers array');
      return NextResponse.json(
        { error: 'Invalid request', details: 'At least one passenger is required' },
        { status: 400 }
      );
    }

    // Validate each passenger
    for (let i = 0; i < body.passengers.length; i++) {
      const passenger = body.passengers[i];
      if (!passenger.clientName || typeof passenger.clientName !== 'string' || passenger.clientName.trim() === '') {
        console.error(`Validation error: Missing or invalid clientName for passenger ${i + 1}`);
        return NextResponse.json(
          { error: 'Invalid request', details: `Passenger ${i + 1}: Name is required` },
          { status: 400 }
        );
      }
      if (!passenger.tel || typeof passenger.tel !== 'string' || passenger.tel.trim() === '') {
        console.error(`Validation error: Missing or invalid tel for passenger ${i + 1}`);
        return NextResponse.json(
          { error: 'Invalid request', details: `Passenger ${i + 1}: Phone number is required` },
          { status: 400 }
        );
      }
      if (!passenger.fromStreet || typeof passenger.fromStreet !== 'string' || passenger.fromStreet.trim() === '') {
        console.error(`Validation error: Missing or invalid fromStreet for passenger ${i + 1}`);
        return NextResponse.json(
          { error: 'Invalid request', details: `Passenger ${i + 1}: Pickup address is required` },
          { status: 400 }
        );
      }
    }

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
      const errorText = await response.text();
      let errorDetails = errorText;

      // Try to parse error as JSON for better error messages
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorJson.error || errorText;

        // Log detailed error information
        console.error('General booking API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorJson,
          timestamp: new Date().toISOString(),
        });
      } catch {
        console.error('General booking API error:', {
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
      console.error('General booking response error:', {
        errorMessage: data.errorMessage,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: 'Booking failed', details: data.errorMessage },
        { status: 400 }
      );
    }

    // Log successful booking
    console.log('General booking successful:', {
      internalNo: data.internalNo,
      bookRef: data.bookRef,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      internalNo: data.internalNo,
      bookRef: data.bookRef,
      data,
    });
  } catch (error) {
    // Enhanced error logging
    console.error('General booking unexpected error:', {
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
