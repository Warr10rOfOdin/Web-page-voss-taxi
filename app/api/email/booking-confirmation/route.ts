import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/smtp-mailer';

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

    // Send email via SMTP
    try {
      await sendEmail({
        to: emailTo,
        subject: emailSubject,
        text: emailBody,
      });

      return NextResponse.json({ success: true, emailSent: true });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the entire request if email fails - the booking was successful
      // Just log the error and return success with a warning
      return NextResponse.json({
        success: true,
        emailSent: false,
        warning: 'Email delivery failed. Please check SMTP configuration.',
        details: emailError instanceof Error ? emailError.message : 'Unknown error'
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
