import { NextRequest, NextResponse } from 'next/server';

const TAXI4U_API_BASE = process.env.TAXI4U_API_BASE || 'https://api.taxi4u.cab';
const TAXI4U_BEARER_TOKEN = process.env.TAXI4U_BEARER_TOKEN;
const TAXI4U_CENTRAL_CODE = process.env.TAXI4U_CENTRAL_CODE || 'vs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromStreet, fromPostalCode, fromLat, fromLon, toStreet, toPostalCode, toLat, toLon, attributes, pickupTime } = body;

    // Validate required fields
    if (!fromStreet || !toStreet) {
      return NextResponse.json(
        { success: false, error: 'Pickup and destination addresses are required' },
        { status: 400 }
      );
    }

    if (!TAXI4U_BEARER_TOKEN) {
      console.error('TAXI4U_BEARER_TOKEN is not configured');
      return NextResponse.json(
        { success: false, error: 'API authentication not configured' },
        { status: 500 }
      );
    }

    // Call Taxi4U price quote API
    const apiUrl = `${TAXI4U_API_BASE}/api/pricequote?centralCode=${TAXI4U_CENTRAL_CODE}`;

    const priceQuoteData = {
      fromStreet,
      fromPostalCode: fromPostalCode || '',
      fromLat: fromLat || 0,
      fromLon: fromLon || 0,
      toStreet,
      toPostalCode: toPostalCode || '',
      toLat: toLat || 0,
      toLon: toLon || 0,
      attributes: attributes || [],
      pickupTime: pickupTime || new Date().toISOString(),
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAXI4U_BEARER_TOKEN}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(priceQuoteData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Price quote API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Check if API returned an error message
    if (result.errorMessage) {
      return NextResponse.json(
        { success: false, error: result.errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      tariff: result.tariff,
      price: result.price,
    });

  } catch (error) {
    console.error('Price quote error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get price quote' },
      { status: 500 }
    );
  }
}
