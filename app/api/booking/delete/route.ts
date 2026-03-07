import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookRef = searchParams.get('bookRef');

    if (!bookRef) {
      return NextResponse.json(
        { success: false, error: 'Booking reference is required' },
        { status: 400 }
      );
    }

    // First, get booking details to check if it can be deleted
    const detailsResponse = await taxi4uFetch(
      `/api/bookingdetails?centralCode=vs&bookRef=${encodeURIComponent(bookRef)}`,
      {
        method: 'GET',
      }
    );

    if (!detailsResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = await detailsResponse.json();

    // Check if booking can be deleted
    // tripStatus "AU" = Auto/Unassigned, can be deleted
    // If a taxi is assigned or trip is in progress, don't allow deletion
    const canDelete = bookingData.tripStatus === 'AU' || 
                     bookingData.tripStatus === 'OP' || // Open/Pending
                     bookingData.vehicleNo === 0 ||      // No vehicle assigned
                     !bookingData.licenseNo;             // No license assigned

    if (!canDelete) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete booking - taxi has already accepted the trip',
          canDelete: false
        },
        { status: 403 }
      );
    }

    // Delete booking from Taxi4U API
    const response = await taxi4uFetch(
      `/api/book?centralCode=vs&bookRef=${encodeURIComponent(bookRef)}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Taxi4U delete failed:', response.status, errorText);

      return NextResponse.json(
        { success: false, error: 'Failed to delete booking' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete booking'
      },
      { status: 500 }
    );
  }
}
