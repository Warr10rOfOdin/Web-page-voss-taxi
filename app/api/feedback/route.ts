import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, categoryLabel, name, email, phone, date, driverName, tripDetails, message } = body;

    if (!name || !email || !message || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build email content
    const emailSubject = `[Voss Taxi] ${categoryLabel}: ${name}`;
    const emailBody = [
      `Kategori / Category: ${categoryLabel}`,
      `Namn / Name: ${name}`,
      `E-post / Email: ${email}`,
      phone ? `Telefon / Phone: ${phone}` : null,
      date ? `Dato / Date: ${date}` : null,
      driverName ? `Sjåfør / Driver: ${driverName}` : null,
      tripDetails ? `Tur detaljar / Trip details: ${tripDetails}` : null,
      '',
      `Melding / Message:`,
      message,
    ].filter(Boolean).join('\n');

    // Send email via configured provider
    // For now, use the FEEDBACK_EMAIL env var to determine where to send
    const feedbackEmail = process.env.FEEDBACK_EMAIL || 'post@vosstaxi.no';

    // If a mail service is configured (e.g., Resend, SendGrid), use it
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Voss Taxi Feedback <${process.env.RESEND_FROM_EMAIL || 'feedback@vosstaxi.no'}>`,
          to: [feedbackEmail],
          reply_to: email,
          subject: emailSubject,
          text: emailBody,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send email via Resend:', await response.text());
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
    } else {
      // Log the feedback for now (will be sent via email once configured)
      console.log('=== FEEDBACK RECEIVED ===');
      console.log(`To: ${feedbackEmail}`);
      console.log(`Subject: ${emailSubject}`);
      console.log(emailBody);
      console.log('========================');
      console.log('NOTE: Set RESEND_API_KEY env var to enable email delivery');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
