import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/smtp-mailer';

export async function GET() {
  try {
    // Check if SMTP is configured
    const smtpConfigured = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );

    if (!smtpConfigured) {
      return NextResponse.json({
        configured: false,
        message: 'SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.',
      });
    }

    // Try to send a test email
    const testEmail = process.env.SMTP_USER || 'test@example.com';

    try {
      const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SMTP Test - Voss Taxi</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFD700; font-size: 28px;">🚖 Voss Taxi</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">SMTP Configuration Test</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #28a745;">✅ SMTP is Working!</h2>
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">If you receive this email, your SMTP configuration is correct and emails are being delivered successfully.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1a1a1a;">Configuration Details:</h3>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666; font-size: 14px;">Host:</td>
                        <td style="color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${process.env.SMTP_HOST}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Port:</td>
                        <td style="color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${process.env.SMTP_PORT || '587'}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Security:</td>
                        <td style="color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${process.env.SMTP_SECURE === 'true' ? 'SSL/TLS (Secure)' : 'No SSL'}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">From:</td>
                        <td style="color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${process.env.SMTP_FROM || testEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Test Time:</td>
                        <td style="color: #1a1a1a; font-weight: 500; text-align: right; font-size: 14px;">${new Date().toLocaleString('no-NO')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 4px; margin-top: 20px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; font-size: 14px; color: #155724;"><strong>Success!</strong> Your email system is ready to send booking confirmations and receipts to customers.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 12px; color: #666;">This is an automated test email from Voss Taxi booking system</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">Tested at ${new Date().toISOString()}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      await sendEmail({
        to: testEmail,
        subject: '✅ SMTP Test - Voss Taxi',
        text: `This is a test email to verify SMTP configuration.

Configuration:
- Host: ${process.env.SMTP_HOST}
- Port: ${process.env.SMTP_PORT || '587'}
- Secure: ${process.env.SMTP_SECURE === 'true' ? 'Yes (SSL/TLS)' : 'No'}
- From: ${process.env.SMTP_FROM || testEmail}
- Test Time: ${new Date().toLocaleString('no-NO')}

✅ SUCCESS! If you receive this email, your SMTP configuration is working correctly.`,
        html: testHtml,
      });

      return NextResponse.json({
        configured: true,
        success: true,
        message: `Test email sent successfully to ${testEmail}`,
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || '587',
          secure: process.env.SMTP_SECURE === 'true',
          user: process.env.SMTP_USER,
          from: process.env.SMTP_FROM,
        },
      });
    } catch (error) {
      return NextResponse.json({
        configured: true,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'SMTP is configured but failed to send test email',
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || '587',
          secure: process.env.SMTP_SECURE === 'true',
          user: process.env.SMTP_USER,
          from: process.env.SMTP_FROM,
        },
        troubleshooting: [
          'Verify SMTP credentials are correct',
          'Check if SMTP server is accessible from your hosting environment',
          'Verify firewall/network settings allow outbound SMTP connections',
          'For One.com: Ensure you\'re using port 465 with secure=true',
          'Try testing with a different SMTP provider to isolate the issue',
        ],
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
