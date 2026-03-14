import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import ReactPDF from '@react-pdf/renderer';
import { ReceiptPDF, ReceiptData } from '@/components/receipts/ReceiptPDF';
import nodemailer from 'nodemailer';
import React from 'react';

export const dynamic = 'force-dynamic';

// Email PDF receipt
export async function POST(request: NextRequest) {
  // Declare variables outside try block for error handling
  let bookRef: string = '';
  let locale: 'no' | 'en' = 'no';

  try {
    const body = await request.json();
    bookRef = body.bookRef;
    const email = body.email;
    locale = (body.locale === 'en' ? 'en' : 'no');

    if (!bookRef || !email) {
      return NextResponse.json(
        { error: 'bookRef and email are required' },
        { status: 400 }
      );
    }

    // Check if Taxi4U credentials are configured
    if (!process.env.TAXI4U_USER_ID || !process.env.TAXI4U_PASSWORD) {
      console.error('⚠️  Taxi4U credentials not configured');
      return NextResponse.json(
        {
          success: false,
          error: locale === 'no'
            ? 'Kvitteringsteneste er ikkje konfigurert. Kontakt administrator.'
            : 'Receipt service is not configured. Please contact administrator.',
          details: 'Missing TAXI4U_USER_ID or TAXI4U_PASSWORD environment variables',
        },
        { status: 503 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: locale === 'no' ? 'Ugyldig e-postadresse' : 'Invalid email address' },
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

    // Get the last character of the status sequence (current status)
    const currentStatus = bookingData.tripStatus?.slice(-1) || '';

    // Only allow receipt for completed trips (l = Levert, N = Ready for invoicing)
    const completedStatuses = ['l', 'N'];
    if (!completedStatuses.includes(currentStatus)) {
      return NextResponse.json(
        {
          error: locale === 'no'
            ? 'Kvittering er berre tilgjengeleg for fullførte turar'
            : 'Receipt is only available for completed trips',
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
      return NextResponse.json(
        { error: 'Failed to fetch receipt data' },
        { status: receiptResponse.status }
      );
    }

    const receiptApiData = await receiptResponse.json();

    // Transform API data to ReceiptData format
    const passenger = bookingData.passengers?.[0] || {};

    const receiptData: ReceiptData = {
      bookRef: bookingData.bookRef,
      date: bookingData.bookedTimeStamp || receiptApiData.bookedDateTime || new Date().toISOString(),
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
      vehicleNumber: bookingData.vehicleNo?.toString(),
      licenseNumber: bookingData.licenseNo,
      driverName: receiptApiData.driverName,
      driverId: receiptApiData.driverId || receiptApiData.driverID,
      tariff: receiptApiData.tariff || receiptApiData.tariffName || receiptApiData.tariffCode,
      price: receiptApiData.price || receiptApiData.totalPrice || 0,
      vat: receiptApiData.vat || receiptApiData.vatAmount,
      currency: 'NOK',
      paymentMethod: receiptApiData.paymentMethod || (locale === 'no' ? 'Kontant/Kort' : 'Cash/Card'),
      receiptNumber: receiptApiData.receiptNumber || receiptApiData.receiptNo,
      invoiceNumber: receiptApiData.invoiceNumber || receiptApiData.invoiceNo,
      fromZone: receiptApiData.fromZone || passenger.fromZone,
      toZone: receiptApiData.toZone || passenger.toZone,
      tripSpecification: receiptApiData.tripSpecification || receiptApiData.specification,
      cardTerminal: receiptApiData.cardTerminal || receiptApiData.terminal,
      authorization: receiptApiData.authorization || receiptApiData.authCode,
      referenceNumber: receiptApiData.referenceNumber || receiptApiData.reference || receiptApiData.ref,
    };

    // Generate PDF - ReceiptPDF returns a Document element
    console.log('Generating PDF for email attachment...');
    const receiptElement = React.createElement(ReceiptPDF, { data: receiptData, locale });

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await ReactPDF.renderToBuffer(receiptElement as any);
      console.log(`✓ PDF generated successfully (${pdfBuffer.length} bytes)`);
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      throw new Error(`Failed to generate PDF: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`);
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('=== EMAIL WITH PDF ATTACHMENT (SMTP NOT CONFIGURED) ===');
      console.log(`To: ${email}`);
      console.log(`Subject: ${locale === 'no' ? `Kvittering frå Voss Taxi - ${bookRef}` : `Receipt from Voss Taxi - ${bookRef}`}`);
      console.log(`PDF size: ${pdfBuffer.length} bytes`);
      console.log('========================================================');
      console.log('NOTE: Set SMTP_HOST, SMTP_USER, and SMTP_PASS env vars to enable email delivery');

      return NextResponse.json({
        success: true,
        message: locale === 'no'
          ? '(DEV MODE) Kvittering ville vore sendt til ' + email
          : '(DEV MODE) Receipt would be sent to ' + email,
        dev: true,
      });
    }

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });

    // Email content
    const subject = locale === 'no'
      ? `Kvittering frå Voss Taxi - ${bookRef}`
      : `Receipt from Voss Taxi - ${bookRef}`;

    const htmlContent = locale === 'no' ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Kvittering for din tur med Voss Taxi</h2>
        <p>Hei ${receiptData.customerName},</p>
        <p>Takk for at du reiste med Voss Taxi! Vedlagt finn du kvitteringa for din tur.</p>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Bookingkode:</strong> ${bookRef}</p>
          <p style="margin: 5px 0;"><strong>Dato:</strong> ${new Date(receiptData.date).toLocaleDateString('no-NO')}</p>
          <p style="margin: 5px 0;"><strong>Beløp:</strong> ${receiptData.price.toFixed(2)} NOK</p>
        </div>

        <p>Har du spørsmål? Ta kontakt med oss:</p>
        <p>
          📞 <a href="tel:+4756511340">56 51 13 40</a><br>
          📧 <a href="mailto:post@vosstaxi.no">post@vosstaxi.no</a>
        </p>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Denne e-posten vart sendt automatisk frå Voss Taxi. Ver grei og ikkje svar på denne e-posten.
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Receipt for your trip with Voss Taxi</h2>
        <p>Hi ${receiptData.customerName},</p>
        <p>Thank you for traveling with Voss Taxi! Please find your receipt attached.</p>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Booking Reference:</strong> ${bookRef}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(receiptData.date).toLocaleDateString('en-US')}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> ${receiptData.price.toFixed(2)} NOK</p>
        </div>

        <p>Have questions? Contact us:</p>
        <p>
          📞 <a href="tel:+4756511340">+47 56 51 13 40</a><br>
          📧 <a href="mailto:post@vosstaxi.no">post@vosstaxi.no</a>
        </p>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This email was sent automatically from Voss Taxi. Please do not reply to this email.
        </p>
      </div>
    `;

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('✓ SMTP connection verified');
    } catch (verifyError) {
      console.error('✗ SMTP verification failed:', verifyError);
      throw new Error('SMTP connection failed. Please check email configuration.');
    }

    // Send email
    console.log(`Sending receipt email to ${email}...`);
    const info = await transporter.sendMail({
      from: `"Voss Taxi" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: `voss-taxi-receipt-${bookRef}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log(`✓ Receipt email sent successfully to ${email}`);
    console.log(`  Message ID: ${info.messageId}`);

    return NextResponse.json({
      success: true,
      message: locale === 'no'
        ? `Kvittering sendt til ${email}`
        : `Receipt sent to ${email}`,
    });

  } catch (error) {
    console.error('Email receipt error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error context:', { bookRef, locale });

    // Provide helpful error messages
    let errorMessage = 'Failed to send receipt email';
    let statusCode = 500;

    if (error instanceof Error) {
      // Authentication errors
      if (error.message.includes('TAXI4U_USER_ID') || error.message.includes('TAXI4U_PASSWORD') || error.message.includes('Login failed')) {
        errorMessage = locale === 'no'
          ? 'Kvitteringsteneste er ikkje konfigurert. Kontakt administrator.'
          : 'Receipt service is not configured. Please contact administrator.';
        statusCode = 503;
      }
      // SMTP errors
      else if (error.message.includes('SMTP')) {
        errorMessage = locale === 'no'
          ? 'Kunne ikkje sende e-post. Sjekk e-postkonfigurasjon.'
          : 'Could not send email. Please check email configuration.';
        statusCode = 503;
      }
      // PDF generation errors
      else if (error.message.includes('PDF')) {
        errorMessage = locale === 'no'
          ? 'Kunne ikkje generere kvittering. Prøv igjen seinare.'
          : 'Could not generate receipt. Please try again later.';
      }
      // Booking not found
      else if (error.message.includes('404') || error.message.includes('not found')) {
        errorMessage = locale === 'no'
          ? 'Fant ikkje booking eller kvittering.'
          : 'Booking or receipt not found.';
        statusCode = 404;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        bookRef: bookRef || undefined,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    );
  }
}
