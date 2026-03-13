import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/smtp-mailer';

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

    // Send email via SMTP
    const feedbackEmail = process.env.FEEDBACK_EMAIL || 'post@vosstaxi.no';

    try {
      await sendEmail({
        to: feedbackEmail,
        subject: emailSubject,
        text: emailBody,
        replyTo: email,
      });
    } catch (emailError) {
      console.error('Failed to send feedback email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError instanceof Error ? emailError.message : 'Unknown error' },
        { status: 500 }
      );
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
