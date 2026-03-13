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
      await sendEmail({
        to: testEmail,
        subject: 'SMTP Test - Voss Taxi',
        text: `This is a test email to verify SMTP configuration.

Configuration:
- Host: ${process.env.SMTP_HOST}
- Port: ${process.env.SMTP_PORT || '587'}
- Secure: ${process.env.SMTP_SECURE === 'true' ? 'Yes (SSL/TLS)' : 'No'}
- From: ${process.env.SMTP_FROM || testEmail}

If you receive this email, your SMTP configuration is working correctly.`,
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
