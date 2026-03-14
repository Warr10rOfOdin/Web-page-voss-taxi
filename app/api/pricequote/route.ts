import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

const TAXI4U_API_BASE = process.env.TAXI4U_API_BASE || 'https://api.taxi4u.cab';
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

    // Call Taxi4U price quote API using the same authentication as booking
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
      let errorDetails = errorText;

      // Try to parse error as JSON for better error messages
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorJson.error || errorText;

        console.error('Price quote API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorJson,
          timestamp: new Date().toISOString(),
        });
      } catch {
        console.error('Price quote API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          timestamp: new Date().toISOString(),
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to get price quote',
          details: errorDetails,
          statusCode: response.status
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Check if API returned an error message
    if (result.errorMessage) {
      console.error('Price quote response error:', {
        errorMessage: result.errorMessage,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { success: false, error: result.errorMessage },
        { status: 400 }
      );
    }

    // Log successful price quote
    console.log('Price quote successful:', {
      price: result.price,
      tariff: result.tariff,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      tariff: result.tariff,
      price: result.price,
    });

  } catch (error) {
    // Enhanced error logging
    console.error('Price quote unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        type: 'server_error'
      },
      { status: 500 }
    );
  }
}
