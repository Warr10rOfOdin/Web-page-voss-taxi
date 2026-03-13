import { NextRequest, NextResponse } from 'next/server';
import { getBookingStats, getBookingLogs } from '@/lib/booking-stats';

// GET endpoint to retrieve booking statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';

    if (type === 'summary') {
      // Get summary statistics
      const stats = getBookingStats();
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
      const successParam = searchParams.get('success');
      const success = successParam !== null ? successParam === 'true' : undefined;

      const result = getBookingLogs({
        limit,
        offset,
        startDate,
        endDate,
        success,
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
    console.error('Error fetching booking stats:', error);
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
