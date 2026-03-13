import { NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

const TAXI4U_API_BASE = process.env.TAXI4U_API_BASE || 'https://api.taxi4u.cab';
const TAXI4U_CENTRAL_CODE = process.env.TAXI4U_CENTRAL_CODE || 'vs';

export async function GET() {
  try {
    const response = await taxi4uFetch(
      `${TAXI4U_API_BASE}/api/attribute?centralCode=${TAXI4U_CENTRAL_CODE}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch attributes:', { status: response.status, error: errorText });
      return NextResponse.json(
        { success: false, error: 'Failed to fetch attributes', details: errorText },
        { status: response.status }
      );
    }

    const attributes = await response.json();

    return NextResponse.json({
      success: true,
      attributes,
    });
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
