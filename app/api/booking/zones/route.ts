import { NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

export async function GET() {
  try {
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VOSS';

    // Fetch zones from Taxi4U API
    const response = await taxi4uFetch(
      `https://api.taxi4u.cab/api/zone?centralCode=${centralCode}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to fetch zones:', { status: response.status, error });
      return NextResponse.json(
        { error: 'Failed to fetch zones', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Zones fetched successfully:', data.length);

    return NextResponse.json({
      success: true,
      zones: data,
    });
  } catch (error) {
    console.error('Zones fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
