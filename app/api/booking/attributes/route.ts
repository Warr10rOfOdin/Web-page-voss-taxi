import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VOSS';

    const response = await fetch(
      `https://api.taxi4u.cab/api/attribute?centralCode=${centralCode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.TAXI4U_API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch attributes', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      attributes: data,
    });
  } catch (error) {
    console.error('Attributes fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
