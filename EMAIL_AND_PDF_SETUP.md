# Email and PDF Receipt Setup Guide

This guide explains how to configure and use the email confirmation and PDF receipt features in the Voss Taxi booking system.

## Features

### 1. Booking Confirmation Emails
- **Trigger**: Automatically sent when a customer provides an email during booking
- **Content**: Professional HTML email with booking details
- **Includes**: Booking reference, pickup/destination, time, passenger count, and direct link to manage booking

### 2. PDF Receipts
- **Generation**: Creates Norwegian tax-compliant PDF receipts
- **Download**: Customers can download PDF receipts for completed trips
- **Print**: Direct print functionality with browser print dialog
- **Email**: Send PDF receipts via email

## Email Configuration

### SMTP Settings

Add these environment variables to your `.env` file:

```bash
# Email Configuration (SMTP)
SMTP_HOST=send.one.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@vosstaxi.no
SMTP_PASS=your_email_password_here
SMTP_FROM=Voss Taxi <noreply@vosstaxi.no>
```

### Supported SMTP Providers

#### One.com (Recommended for Norwegian businesses)
```bash
SMTP_HOST=send.one.com
SMTP_PORT=465
SMTP_SECURE=true
```

#### Gmail
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
# Note: You'll need to create an "App Password" in Google Account settings
```

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

## Testing Email Configuration

### Option 1: API Endpoint
Visit `/api/email/test-smtp` in your browser to test SMTP configuration:

```bash
curl https://your-domain.com/api/email/test-smtp
```

Expected response if configured correctly:
```json
{
  "configured": true,
  "success": true,
  "message": "Test email sent successfully to noreply@vosstaxi.no",
  "config": {
    "host": "send.one.com",
    "port": "465",
    "secure": true,
    "user": "noreply@vosstaxi.no"
  }
}
```

### Option 2: Development Mode
If SMTP is not configured, emails will be logged to the console instead of being sent. This is useful for development:

```
=== EMAIL (SMTP NOT CONFIGURED) ===
To: customer@example.com
Subject: Booking stadfesta - Voss Taxi (VOSS123)
[Email content]
===================================
NOTE: Set SMTP_HOST, SMTP_USER, and SMTP_PASS env vars to enable email delivery
```

## PDF Configuration

PDF generation works out of the box with no additional configuration needed. It uses `@react-pdf/renderer` to create professional receipts.

### PDF Receipt Features

- **Norwegian Format**: Complies with Norwegian taxi receipt requirements
- **VAT Calculation**: Automatically calculates 12% VAT for passenger transport
- **Comprehensive Details**: Includes all trip information, driver details, tariff, and payment method
- **Professional Design**: Clean, branded layout with Voss Taxi styling

### Testing PDF Generation

Test PDF generation by:

1. **Create a test booking** that completes successfully
2. **Check booking status** using the booking reference
3. **Download PDF** once trip status allows receipts
4. **Print or Email** the receipt

## API Endpoints

### Email Endpoints

#### Send Booking Confirmation
```http
POST /api/email/booking-confirmation
Content-Type: application/json

{
  "emailTo": "customer@example.com",
  "bookRef": "VOSS123",
  "customerName": "John Doe",
  "pickupTime": "2026-03-15 14:30",
  "from": "Uttrågata 19, 5700 Voss",
  "destination": "Bergen Airport",
  "passengerCount": 2,
  "locale": "no"
}
```

#### Test SMTP Configuration
```http
GET /api/email/test-smtp
```

### PDF Endpoints

#### Generate PDF Receipt
```http
GET /api/booking/receipt/pdf?bookRef=VOSS123&locale=no
```

Returns: PDF file (application/pdf)

#### Email PDF Receipt
```http
POST /api/booking/receipt/email
Content-Type: application/json

{
  "bookRef": "VOSS123",
  "email": "customer@example.com",
  "locale": "no"
}
```

## Booking Flow Integration

### 1. Booking Confirmation Email

When a customer makes a booking:

```typescript
// After successful booking
if (email) {
  await fetch('/api/email/booking-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emailTo: email,
      bookRef: data.bookRef,
      customerName: clientName,
      pickupTime: pickupTimeFormatted,
      from: `${fromStreet}, ${fromCity}`,
      destination: toStreet ? `${toStreet}, ${toCity}` : undefined,
      passengerCount,
      locale,
    }),
  });
}
```

### 2. Receipt Generation

For completed trips:

```typescript
// Download PDF
const response = await fetch(
  `/api/booking/receipt/pdf?bookRef=${bookRef}&locale=${locale}`
);
const blob = await response.blob();
// Handle blob (download, print, etc.)

// Email PDF
await fetch('/api/booking/receipt/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bookRef,
    email: customerEmail,
    locale,
  }),
});
```

## Troubleshooting

### Email Issues

#### "SMTP connection failed"
- Verify SMTP_HOST and SMTP_PORT are correct
- Check if your hosting provider blocks outbound SMTP connections
- Try using port 587 instead of 465 (or vice versa)

#### "Invalid login" / "Authentication failed"
- Double-check SMTP_USER and SMTP_PASS
- For Gmail, ensure you're using an App Password, not your account password
- For One.com, verify the email account exists and password is correct

#### "Connection timeout"
- Check firewall settings allow outbound connections to SMTP server
- Verify your hosting environment doesn't block SMTP ports
- Try a different SMTP provider to isolate the issue

#### Emails going to spam
- Configure SPF and DKIM records for your domain
- Use a professional "from" address (e.g., noreply@vosstaxi.no)
- Avoid spam trigger words in subject lines
- Consider using a dedicated email service (SendGrid, Mailgun, etc.)

### PDF Issues

#### "Failed to generate PDF receipt"
- Check that booking status allows receipts (completed trips only)
- Verify receipt data is available from Taxi4U API
- Check server logs for detailed error messages

#### "Receipt not available yet"
- PDF receipts are only available for completed trips
- Wait for trip status to update (status codes: N or l)
- Contact Taxi4U support if receipts aren't appearing

#### Print dialog not opening
- Check browser popup blocker settings
- Allow popups for your domain
- Alternatively, download PDF and print manually

## Email Templates

Email templates use responsive HTML with inline CSS for maximum compatibility:

- **Booking Confirmation**: Professional layout with highlighted booking reference
- **Receipt Email**: Includes trip summary and PDF attachment
- **Bilingual Support**: Norwegian and English templates
- **Mobile-Friendly**: Responsive design works on all devices

### Customizing Email Templates

Edit email templates in:
- `/app/api/email/booking-confirmation/route.ts` - Booking confirmations
- `/app/api/booking/receipt/email/route.ts` - Receipt emails

Key design elements:
- Brand colors: Gold (#FFD700) and Black (#1a1a1a)
- Professional typography with clear hierarchy
- Important information highlighted
- Call-to-action buttons for managing bookings

## Production Checklist

Before going live:

- [ ] Configure SMTP credentials in production environment
- [ ] Test email delivery with `/api/email/test-smtp`
- [ ] Send test booking confirmation email
- [ ] Generate test PDF receipt
- [ ] Test print functionality across browsers
- [ ] Test email receipt delivery
- [ ] Configure SPF/DKIM records for better deliverability
- [ ] Set up email monitoring/logging
- [ ] Test with real customer email addresses
- [ ] Verify Norwegian and English templates display correctly

## Security Considerations

1. **Environment Variables**: Never commit SMTP credentials to git
2. **Email Validation**: All email addresses are validated before sending
3. **Rate Limiting**: Consider implementing rate limits on email endpoints
4. **Sensitive Data**: Receipts contain customer information - handle securely
5. **HTTPS**: Always use HTTPS in production for email/PDF endpoints

## Support

For issues or questions:
- Check server logs for detailed error messages
- Visit `/api/email/test-smtp` to diagnose SMTP issues
- Review this documentation
- Contact support with error messages and logs

## Advanced Configuration

### Custom Email Templates

Create custom templates by modifying the HTML in the route handlers. Use inline CSS for best compatibility across email clients.

### PDF Customization

Customize PDF receipt appearance in `/components/receipts/ReceiptPDF.tsx`:
- Modify styles in the `StyleSheet.create()` section
- Adjust layout and content in the component render
- Add additional fields or remove unnecessary ones

### Webhook Integration

Consider adding webhooks to notify other systems when emails are sent or receipts are generated.

---

Last updated: March 2026
