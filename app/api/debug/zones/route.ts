/**
 * Debug endpoint to fetch and display zones from Taxi4U API
 * Access at: /api/debug/zones
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/taxi4u-auth';

export async function GET(request: NextRequest) {
  try {
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VOSS';

    // Get auth token
    const token = await getAccessToken();

    // Fetch zones
    const response = await fetch(
      `https://api.taxi4u.cab/api/zone?centralCode=${centralCode}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({
        error: 'Failed to fetch zones',
        status: response.status,
        details: error,
      }, { status: response.status });
    }

    const zones = await response.json();

    // Analyze zones
    const analysis = {
      totalZones: zones.length,
      sampleZones: zones.slice(0, 10),
      allZoneNumbers: zones.map((z: any) =>
        z.zoneNo || z.zoneNumber || z.zone || z.id || 'unknown'
      ),
      structure: zones.length > 0 ? Object.keys(zones[0]) : [],
    };

    return NextResponse.json({
      success: true,
      centralCode,
      ...analysis,
    });
  } catch (error) {
    console.error('Debug zones error:', error);
    return NextResponse.json({
      error: 'Failed to fetch zones',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
