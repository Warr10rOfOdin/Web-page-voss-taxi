import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import ReactPDF from '@react-pdf/renderer';
import { ReceiptPDF, ReceiptData } from '@/components/receipts/ReceiptPDF';
import React from 'react';

export const dynamic = 'force-dynamic';

// Generate PDF receipt
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookRef = searchParams.get('bookRef');
    const locale = (searchParams.get('locale') || 'no') as 'no' | 'en';

    if (!bookRef) {
      return NextResponse.json(
        { error: 'bookRef parameter is required' },
        { status: 400 }
      );
    }

    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';

    // First, check booking status
    const statusResponse = await taxi4uFetch(
      `https://api.taxi4u.cab/api/bookingdetails?centralCode=${centralCode}&bookRef=${encodeURIComponent(bookRef)}`
    );

    if (!statusResponse.ok) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = await statusResponse.json();

    // Check if receipt is available for this booking status
    // Use the last character of the status sequence (current status)
    const currentStatus = bookingData.tripStatus?.slice(-1);
    const allowedStatuses = ['N', 'l']; // N = Ready for invoicing, l = Delivered

    if (!currentStatus || !allowedStatuses.includes(currentStatus)) {
      return NextResponse.json(
        {
          error: locale === 'no'
            ? 'Kvittering er berre tilgjengeleg for fullførte turar (status N eller l)'
            : 'Receipt is only available for completed trips (status N or l)',
          currentStatus: bookingData.tripStatus,
          lastStatus: currentStatus
        },
        { status: 400 }
      );
    }

    // Fetch receipt data from Taxi4U
    const receiptResponse = await taxi4uFetch(
      `https://api.taxi4u.cab/api/receipt?centralCode=${centralCode}&bookRef=${encodeURIComponent(bookRef)}`
    );

    if (receiptResponse.status === 204) {
      return NextResponse.json(
        { error: locale === 'no' ? 'Ingen kvittering tilgjengeleg enno' : 'No receipt available yet' },
        { status: 404 }
      );
    }

    if (!receiptResponse.ok) {
      const error = await receiptResponse.text();
      return NextResponse.json(
        { error: 'Failed to fetch receipt data', details: error },
        { status: receiptResponse.status }
      );
    }

    const receiptApiData = await receiptResponse.json();

    // Transform API data to ReceiptData format
    const passenger = bookingData.passengers?.[0] || {};

    const receiptData: ReceiptData = {
      bookRef: bookingData.bookRef,
      date: new Date().toISOString(),
      customerName: passenger.clientName || 'Unknown',
      customerPhone: passenger.tel,
      pickupAddress: `${passenger.fromStreet || ''}, ${passenger.fromPostalCode || ''} ${passenger.fromCity || ''}`.trim(),
      dropoffAddress: passenger.toStreet
        ? `${passenger.toStreet}, ${passenger.toPostalCode || ''} ${passenger.toCity || ''}`.trim()
        : '',
      pickupTime: bookingData.pickupTime,
      dropoffTime: receiptApiData.stopTime,
      distance: receiptApiData.km,
      duration: receiptApiData.minutes,
      licenseNumber: bookingData.licenseNo,
      driverName: receiptApiData.driverName,
      tariff: receiptApiData.tariff || receiptApiData.tariffName || receiptApiData.tariffCode,
      price: receiptApiData.price || receiptApiData.totalPrice || 0,
      vat: receiptApiData.vat,
      currency: 'NOK',
      paymentMethod: receiptApiData.paymentMethod || (locale === 'no' ? 'Kontant/Kort' : 'Cash/Card'),
    };

    // Generate PDF - call component as function to get Document element
    // Type assertion needed for server-side PDF rendering
    const pdfBuffer = await ReactPDF.renderToBuffer(
      ReceiptPDF({ data: receiptData, locale }) as any
    );

    // Return PDF - convert buffer to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="voss-taxi-receipt-${bookRef}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF receipt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
