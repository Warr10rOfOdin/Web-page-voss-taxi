import { NextRequest, NextResponse } from 'next/server';
import { getVisitorStats, getVisitorLogs } from '@/lib/visitor-stats';

// GET endpoint to retrieve visitor statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';

    if (type === 'summary') {
      // Get summary statistics
      const stats = getVisitorStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    } else if (type === 'logs') {
      // Get detailed logs
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');
      const startDate = searchParams.get('startDate') || undefined;
      const endDate = searchParams.get('endDate') || undefined;
      const path = searchParams.get('path') || undefined;
      const locale = searchParams.get('locale') || undefined;

      const result = getVisitorLogs({
        limit,
        offset,
        startDate,
        endDate,
        path,
        locale,
      });

      return NextResponse.json({
        success: true,
        data: result,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type parameter' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
