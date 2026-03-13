import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      emailTo,
      bookRef,
      customerName,
      pickupTime,
      from,
      destination,
      passengerCount,
      locale
    } = body;

    if (!emailTo || !bookRef || !customerName || !pickupTime || !from) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine language for email
    const isNorwegian = locale === 'no';

    // Build email subject
    const emailSubject = isNorwegian
      ? `Booking stadfesta - Voss Taxi (${bookRef})`
      : `Booking Confirmed - Voss Taxi (${bookRef})`;

    // Build email body
    const emailBody = isNorwegian ? `
Hei ${customerName},

Takk for bestillinga! Din taxi er no bekrefta.

Bookingdetaljer:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bookingreferanse: ${bookRef}
Namn: ${customerName}
Hentetid: ${pickupTime}
Henting: ${from}
${destination ? `Destinasjon: ${destination}` : 'Destinasjon: Blir oppgitt til sjåfør'}
${passengerCount ? `Passasjerer: ${passengerCount}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Viktig informasjon:
• Ta vare på bookingreferansen din: ${bookRef}
• Sjåføren vil kontakte deg kort tid før henting

Ved spørsmål eller endringar, ring oss på +47 56 51 13 40

Med venleg helsing,
Voss Taxi
Uttrågata 19, 5700 Voss
www.vosstaxi.no
    `.trim() : `
Hello ${customerName},

Thank you for your booking! Your taxi has been confirmed.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking Reference: ${bookRef}
Name: ${customerName}
Pickup Time: ${pickupTime}
Pickup: ${from}
${destination ? `Destination: ${destination}` : 'Destination: To be specified to driver'}
${passengerCount ? `Passengers: ${passengerCount}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Important Information:
• Save your booking reference: ${bookRef}
• The driver will contact you shortly before pickup

For questions or changes, call us at +47 56 51 13 40

Best regards,
Voss Taxi
Uttrågata 19, 5700 Voss
www.vosstaxi.no
    `.trim();

    // If Resend API is configured, send email
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Voss Taxi <noreply@vosstaxi.no>',
          to: [emailTo],
          subject: emailSubject,
          text: emailBody,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send email via Resend:', errorText);
        return NextResponse.json(
          { error: 'Failed to send email', details: errorText },
          { status: 500 }
        );
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
      return NextResponse.json({ success: true, data: result });
    } else {
      // Log the email for development
      console.log('=== EMAIL CONFIRMATION (DEVELOPMENT) ===');
      console.log(`To: ${emailTo}`);
      console.log(`Subject: ${emailSubject}`);
      console.log(emailBody);
      console.log('========================================');
      console.log('NOTE: Set RESEND_API_KEY env var to enable email delivery');

      return NextResponse.json({
        success: true,
        message: 'Email logged (RESEND_API_KEY not configured)'
      });
    }
  } catch (error) {
    console.error('Email confirmation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
