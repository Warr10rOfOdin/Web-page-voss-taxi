import { NextRequest, NextResponse } from 'next/server';
import { logBooking } from '@/lib/booking-stats';

// Test endpoint to verify stats logging is working
// This helps diagnose issues with the booking counter
export async function POST(request: NextRequest) {
  try {
    // Create a test booking entry
    const testBooking = logBooking({
      bookRef: `TEST-${Date.now()}`,
      customerName: 'Test Customer',
      fromCity: 'Voss',
      toCity: 'Bergen',
      pickupTime: new Date().toISOString(),
      bookingType: 'simple',
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Test booking logged successfully',
      data: testBooking,
    });
  } catch (error) {
    console.error('Test stats logging failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to log test booking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clear all test bookings
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clearAll = searchParams.get('all') === 'true';

    if (!clearAll) {
      return NextResponse.json(
        {
          success: false,
          error: 'Add ?all=true to confirm clearing all stats',
        },
        { status: 400 }
      );
    }

    // Note: This would need to be implemented in booking-stats.ts
    // For now, just return a message
    return NextResponse.json({
      success: false,
      error: 'Clear stats function not yet implemented',
      message: 'You can manually edit data/booking-stats.json to clear stats',
    });
  } catch (error) {
    console.error('Clear stats failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
