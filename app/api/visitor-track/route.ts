import { NextRequest, NextResponse } from 'next/server';
import { logVisit } from '@/lib/visitor-stats';

// POST endpoint to log a visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, locale } = body;

    if (!path || !locale) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: path and locale' },
        { status: 400 }
      );
    }

    // Get visitor info from headers
    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               undefined;

    // Log the visit
    const log = logVisit({
      path,
      locale,
      userAgent,
      referrer,
      ip,
    });

    return NextResponse.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Error logging visitor:', error);
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
