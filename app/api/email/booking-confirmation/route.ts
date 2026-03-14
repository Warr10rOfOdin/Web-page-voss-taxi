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

    // Build email text body (fallback for email clients that don't support HTML)
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

    // Build HTML email body (modern, professional design)
    const emailHtml = isNorwegian ? `
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bookingstadfesting - Voss Taxi</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFD700; font-size: 28px; font-weight: bold;">🚖 Voss Taxi</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Bookingstadfesting</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Hei <strong>${customerName}</strong>,</p>
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #333;">Takk for bestillinga! Din taxi er no bekrefta.</p>

              <!-- Booking Reference Highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFF9E6; border-left: 4px solid #FFD700; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">Bookingreferanse</p>
                    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1a1a1a; font-family: monospace;">${bookRef}</p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">⚠️ Ta vare på denne referansen</p>
                  </td>
                </tr>
              </table>

              <!-- Booking Details -->
              <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Bookingdetaljer</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">👤 Namn:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">🕐 Hentetid:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${pickupTime}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">📍 Henting:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${from}</td>
                </tr>
                ${destination ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">🎯 Destinasjon:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${destination}</td>
                </tr>
                ` : `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">🎯 Destinasjon:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #999; font-style: italic; text-align: right; font-size: 14px;">Blir oppgitt til sjåfør</td>
                </tr>
                `}
                ${passengerCount ? `
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px;">👥 Passasjerer:</td>
                  <td style="padding: 10px 0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${passengerCount}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Important Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1a1a1a;">ℹ️ Viktig informasjon</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Sjåføren vil kontakte deg kort tid før henting</li>
                      <li style="margin-bottom: 8px;">Ver klar ved avtalt tid og stad</li>
                      <li>Har du spørsmål? Ring oss på <a href="tel:+4756511340" style="color: #1a1a1a; text-decoration: none; font-weight: bold;">+47 56 51 13 40</a></li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="https://www.vosstaxi.no/no/manage-booking?ref=${encodeURIComponent(bookRef)}" style="display: inline-block; padding: 15px 40px; background-color: #FFD700; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Handter bestilling</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #1a1a1a;">Voss Taxi</p>
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">Uttrågata 19, 5700 Voss</p>
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">
                📞 <a href="tel:+4756511340" style="color: #1a1a1a; text-decoration: none;">+47 56 51 13 40</a> •
                📧 <a href="mailto:post@vosstaxi.no" style="color: #1a1a1a; text-decoration: none;">post@vosstaxi.no</a> •
                🌐 <a href="https://www.vosstaxi.no" style="color: #1a1a1a; text-decoration: none;">www.vosstaxi.no</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #999;">Denne e-posten vart sendt automatisk. Ver grei og ikkje svar på denne e-posten.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    ` : `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Voss Taxi</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFD700; font-size: 28px; font-weight: bold;">🚖 Voss Taxi</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Booking Confirmation</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Hello <strong>${customerName}</strong>,</p>
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #333;">Thank you for your booking! Your taxi has been confirmed.</p>

              <!-- Booking Reference Highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFF9E6; border-left: 4px solid #FFD700; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">Booking Reference</p>
                    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1a1a1a; font-family: monospace;">${bookRef}</p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">⚠️ Please save this reference</p>
                  </td>
                </tr>
              </table>

              <!-- Booking Details -->
              <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Booking Details</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">👤 Name:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">🕐 Pickup Time:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${pickupTime}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">📍 Pickup:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${from}</td>
                </tr>
                ${destination ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">🎯 Destination:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${destination}</td>
                </tr>
                ` : `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">🎯 Destination:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #999; font-style: italic; text-align: right; font-size: 14px;">To be specified to driver</td>
                </tr>
                `}
                ${passengerCount ? `
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px;">👥 Passengers:</td>
                  <td style="padding: 10px 0; color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${passengerCount}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Important Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1a1a1a;">ℹ️ Important Information</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">The driver will contact you shortly before pickup</li>
                      <li style="margin-bottom: 8px;">Please be ready at the agreed time and location</li>
                      <li>Questions? Call us at <a href="tel:+4756511340" style="color: #1a1a1a; text-decoration: none; font-weight: bold;">+47 56 51 13 40</a></li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="https://www.vosstaxi.no/en/manage-booking?ref=${encodeURIComponent(bookRef)}" style="display: inline-block; padding: 15px 40px; background-color: #FFD700; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Manage Booking</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #1a1a1a;">Voss Taxi</p>
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">Uttrågata 19, 5700 Voss, Norway</p>
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">
                📞 <a href="tel:+4756511340" style="color: #1a1a1a; text-decoration: none;">+47 56 51 13 40</a> •
                📧 <a href="mailto:post@vosstaxi.no" style="color: #1a1a1a; text-decoration: none;">post@vosstaxi.no</a> •
                🌐 <a href="https://www.vosstaxi.no" style="color: #1a1a1a; text-decoration: none;">www.vosstaxi.no</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #999;">This email was sent automatically. Please do not reply to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email via SMTP
    try {
      await sendEmail({
        to: emailTo,
        subject: emailSubject,
        text: emailBody,
        html: emailHtml,
      });

      console.log(`✓ Booking confirmation email sent to ${emailTo} for booking ${bookRef}`);
      return NextResponse.json({ success: true, emailSent: true });
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
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
