import { NextRequest, NextResponse } from 'next/server';

// General booking endpoint (multi-passenger, detailed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get central code from environment or use default
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VOSS';

    // Call Taxi4U API
    const response = await fetch(
      `https://api.taxi4u.cab/api/book/general?centralCode=${centralCode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TAXI4U_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Booking failed', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();

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
