import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}

/**
 * Send an email using SMTP configuration
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('=== EMAIL (SMTP NOT CONFIGURED) ===');
    console.log(`To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(options.text);
    console.log('===================================');
    console.log('NOTE: Set SMTP_HOST, SMTP_USER, and SMTP_PASS env vars to enable email delivery');
    return;
  }

  try {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Voss Taxi <${process.env.SMTP_USER}>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      text: options.text,
      replyTo: options.replyTo,
    });

    console.log(`✓ Email sent successfully to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
  } catch (error) {
    console.error('✗ Failed to send email:', error instanceof Error ? error.message : 'Unknown error');
    console.error('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || '587',
      user: process.env.SMTP_USER,
      secure: process.env.SMTP_SECURE === 'true',
    });
    // Re-throw the error so the caller can handle it
    throw error;
  }
}
