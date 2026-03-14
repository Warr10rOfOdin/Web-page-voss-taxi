import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import ReactPDF from '@react-pdf/renderer';
import { ReceiptPDF, ReceiptData } from '@/components/receipts/ReceiptPDF';
import React from 'react';

export const dynamic = 'force-dynamic';

// Generate PDF receipt
export async function GET(request: NextRequest) {
  let bookRef: string | null = null;

  try {
    const searchParams = request.nextUrl.searchParams;
    bookRef = searchParams.get('bookRef');
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

    console.log('Receipt API data:', JSON.stringify(receiptApiData, null, 2));
    console.log('Booking data:', JSON.stringify(bookingData, null, 2));

    // Transform API data to ReceiptData format
    const passenger = bookingData.passengers?.[0] || {};

    // Build addresses more carefully, handling potential issues
    const buildAddress = (street?: string, postalCode?: string, city?: string) => {
      const parts = [street, postalCode, city].filter(part => part && part.trim());
      return parts.join(', ') || (locale === 'no' ? 'Ikke spesifisert' : 'Not specified');
    };

    const receiptData: ReceiptData = {
      bookRef: bookingData.bookRef || bookRef,
      date: bookingData.bookedTimeStamp || new Date().toISOString(),
      customerName: passenger.clientName || (locale === 'no' ? 'Ukjent' : 'Unknown'),
      customerPhone: passenger.tel,
      pickupAddress: buildAddress(passenger.fromStreet, passenger.fromPostalCode, passenger.fromCity),
      dropoffAddress: buildAddress(passenger.toStreet, passenger.toPostalCode, passenger.toCity),
      pickupTime: bookingData.pickupTime || new Date().toISOString(),
      dropoffTime: receiptApiData.stopTime || receiptApiData.endTime || receiptApiData.dropoffTime,
      distance: receiptApiData.km || receiptApiData.distance,
      duration: receiptApiData.minutes || receiptApiData.duration,
      vehicleNumber: bookingData.vehicleNo?.toString(),
      licenseNumber: bookingData.licenseNo || receiptApiData.licenseNo,
      driverName: receiptApiData.driverName || receiptApiData.driver,
      driverId: receiptApiData.driverId || receiptApiData.driverID || receiptApiData.driverid,
      tariff: receiptApiData.tariff || receiptApiData.tariffName || receiptApiData.tariffCode || receiptApiData.tariffDescription,
      price: receiptApiData.price || receiptApiData.totalPrice || receiptApiData.amount || receiptApiData.total || 0,
      vat: receiptApiData.vat || receiptApiData.vatAmount || receiptApiData.mva,
      currency: 'NOK',
      paymentMethod: receiptApiData.paymentMethod || receiptApiData.paymentType || (locale === 'no' ? 'Kontant/Kort' : 'Cash/Card'),
      receiptNumber: receiptApiData.receiptNumber || receiptApiData.receiptNo || receiptApiData.receiptId,
      invoiceNumber: receiptApiData.invoiceNumber || receiptApiData.invoiceNo || receiptApiData.invoiceId,
      fromZone: receiptApiData.fromZone || passenger.fromZone,
      toZone: receiptApiData.toZone || passenger.toZone,
      tripSpecification: receiptApiData.tripSpecification || receiptApiData.specification || receiptApiData.details,
      cardTerminal: receiptApiData.cardTerminal || receiptApiData.terminal || receiptApiData.terminalId,
      authorization: receiptApiData.authorization || receiptApiData.authCode || receiptApiData.authorizationCode,
      referenceNumber: receiptApiData.referenceNumber || receiptApiData.reference || receiptApiData.ref,
    };

    console.log('Transformed receipt data:', JSON.stringify(receiptData, null, 2));

    // Generate PDF - ReceiptPDF returns a Document element
    console.log('Starting PDF generation...');
    const receiptElement = React.createElement(ReceiptPDF, { data: receiptData, locale });

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await ReactPDF.renderToBuffer(receiptElement as any);
      console.log(`✓ PDF generated successfully (${pdfBuffer.length} bytes)`);
    } catch (pdfError) {
      console.error('PDF rendering error:', pdfError);
      throw new Error(`PDF rendering failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`);
    }

    // Return PDF - convert buffer to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="voss-taxi-receipt-${bookRef}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Return detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = {
      error: 'Failed to generate PDF receipt',
      details: errorMessage,
      bookRef,
      timestamp: new Date().toISOString(),
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      (errorDetails as any).stack = error.stack;
    }

    return NextResponse.json(errorDetails, { status: 500 });
  }
}
