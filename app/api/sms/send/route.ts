import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, bookRef, pickupTime, from } = await request.json();

    // Check if Twilio is configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('Twilio not configured, skipping SMS');
      return NextResponse.json({
        success: false,
        message: 'SMS service not configured',
      });
    }

    // Format phone number (ensure it starts with +)
    const formattedTo = to.startsWith('+') ? to : `+47${to.replace(/\s/g, '')}`;

    // Create SMS message matching Taxi4U format
    const message = `BEKREFTET ${bookRef}
#1. - OPPMØTE: ${pickupTime}
FRA: ${from || 'Som oppgitt'}`;

    // Send via Twilio
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedTo,
          From: fromNumber,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('SMS send failed:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send SMS' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      messageSid: data.sid,
    });
  } catch (error) {
    console.error('SMS error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
