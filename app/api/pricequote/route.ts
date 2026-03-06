import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import { getZoneNumber } from '@/lib/zones';

const TAXI4U_API_BASE = process.env.TAXI4U_API_BASE || 'https://api.taxi4u.cab';
const TAXI4U_CENTRAL_CODE = process.env.TAXI4U_CENTRAL_CODE || 'vs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromStreet, fromCity, fromPostalCode, fromLat, fromLon, toStreet, toCity, toPostalCode, toLat, toLon, attributes, pickupTime } = body;

    // Validate required fields
    if (!fromStreet || !toStreet) {
      return NextResponse.json(
        { success: false, error: 'Pickup and destination addresses are required' },
        { status: 400 }
      );
    }

    // Calculate zone numbers for better geocoding
    const fromZone = getZoneNumber(fromPostalCode, fromCity);
    const toZone = getZoneNumber(toPostalCode, toCity);

    // Call Taxi4U price quote API using the same authentication as booking
    const apiUrl = `${TAXI4U_API_BASE}/api/pricequote?centralCode=${TAXI4U_CENTRAL_CODE}`;

    const priceQuoteData = {
      fromStreet,
      fromCity: fromCity || '',
      fromPostalCode: fromPostalCode || '',
      fromZone,
      fromZoneNo: fromZone,
      fromLat: fromLat || 0,
      fromLon: fromLon || 0,
      toStreet,
      toCity: toCity || '',
      toPostalCode: toPostalCode || '',
      toZone,
      toZoneNo: toZone,
      toLat: toLat || 0,
      toLon: toLon || 0,
      attributes: attributes || [],
      pickupTime: pickupTime || new Date().toISOString(),
    };

    const response = await taxi4uFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
