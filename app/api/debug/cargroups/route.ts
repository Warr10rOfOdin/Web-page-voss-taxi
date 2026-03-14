import { NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

/**
 * Debug endpoint to try to fetch car group information from Taxi4U API
 * Try different possible endpoints to see what's available
 */
export async function GET() {
  const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';
  const baseUrl = 'https://api.taxi4u.cab/api';

  const possibleEndpoints = [
    `/cargroup?centralCode=${centralCode}`,
    `/car-group?centralCode=${centralCode}`,
    `/vehicletype?centralCode=${centralCode}`,
    `/vehicle-type?centralCode=${centralCode}`,
    `/cargroups?centralCode=${centralCode}`,
    `/car-groups?centralCode=${centralCode}`,
    `/vehicletypes?centralCode=${centralCode}`,
    `/vehicle-types?centralCode=${centralCode}`,
  ];

  const results = [];

  for (const endpoint of possibleEndpoints) {
    try {
      const response = await taxi4uFetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      const status = response.status;
      let data = null;

      if (response.ok) {
        try {
          data = await response.json();
        } catch {
          data = await response.text();
        }
      } else {
        data = await response.text();
      }

      results.push({
        endpoint,
        status,
        success: response.ok,
        data: response.ok ? data : `Error: ${data}`,
      });

      // If we found a working endpoint, log it
      if (response.ok) {
        console.log(`✅ Found working endpoint: ${endpoint}`);
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      results.push({
        endpoint,
        status: 'ERROR',
        success: false,
        data: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({
    message: 'Testing possible car group endpoints',
    results,
    summary: {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    },
  });
}
