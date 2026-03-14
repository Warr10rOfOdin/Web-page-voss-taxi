import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
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
    if (options.html) {
      console.log('\n--- HTML Content ---');
      console.log(options.html);
    }
    if (options.attachments) {
      console.log(`\nAttachments: ${options.attachments.map(a => a.filename).join(', ')}`);
    }
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
      // Add connection timeout and socket timeout
      connectionTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
    });

    // Verify SMTP connection before sending
    try {
      await transporter.verify();
      console.log('✓ SMTP connection verified');
    } catch (verifyError) {
      console.error('✗ SMTP verification failed:', verifyError instanceof Error ? verifyError.message : 'Unknown error');
      throw new Error('SMTP connection failed. Please check your SMTP configuration.');
    }

    // Send email
    const mailOptions: any = {
      from: process.env.SMTP_FROM || `Voss Taxi <${process.env.SMTP_USER}>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      text: options.text,
      replyTo: options.replyTo,
    };

    // Add HTML if provided
    if (options.html) {
      mailOptions.html = options.html;
    }

    // Add attachments if provided
    if (options.attachments && options.attachments.length > 0) {
      mailOptions.attachments = options.attachments;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log(`✓ Email sent successfully to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    console.log(`  Message ID: ${info.messageId}`);
    if (info.response) {
      console.log(`  Response: ${info.response}`);
    }

    return;
  } catch (error) {
    console.error('✗ Failed to send email:', error instanceof Error ? error.message : 'Unknown error');
    console.error('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || '587',
      user: process.env.SMTP_USER,
      secure: process.env.SMTP_SECURE === 'true',
    });

    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to SMTP server. Please check SMTP_HOST and SMTP_PORT.');
      } else if (error.message.includes('Invalid login')) {
        throw new Error('SMTP authentication failed. Please check SMTP_USER and SMTP_PASS.');
      } else if (error.message.includes('ETIMEDOUT')) {
        throw new Error('SMTP connection timed out. Please check your network and SMTP settings.');
      }
    }

    // Re-throw the error so the caller can handle it
    throw error;
  }
}
