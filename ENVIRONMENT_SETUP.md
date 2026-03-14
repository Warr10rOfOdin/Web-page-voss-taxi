# Environment Setup Guide

## Quick Start

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

### 2. Configure Required Variables

Edit `.env.local` and add your Taxi4U API credentials:

```bash
# REQUIRED: Taxi4U API credentials
TAXI4U_USER_ID=your_user_id_here
TAXI4U_PASSWORD=your_password_here
TAXI4U_CENTRAL_CODE=VS
TAXI4U_DEFAULT_ACCOUNT_NO=0
```

**⚠️ IMPORTANT:** The booking system will NOT work without these credentials!

### 3. Configure Optional Email Settings (Recommended)

To enable email receipts and confirmations, add SMTP settings:

```bash
# Email Configuration
SMTP_HOST=send.one.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@vosstaxi.no
SMTP_PASS=your_email_password_here
FEEDBACK_EMAIL=post@vosstaxi.no
```

### 4. Restart Development Server

```bash
npm run dev
```

## Production Deployment

### Vercel

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add all variables from `.env.local`:
   - `TAXI4U_USER_ID`
   - `TAXI4U_PASSWORD`
   - `TAXI4U_CENTRAL_CODE`
   - `TAXI4U_DEFAULT_ACCOUNT_NO`
   - `SMTP_HOST` (optional)
   - `SMTP_PORT` (optional)
   - `SMTP_SECURE` (optional)
   - `SMTP_USER` (optional)
   - `SMTP_PASS` (optional)
4. Redeploy your application

### Other Platforms

Add environment variables according to your hosting platform's documentation. All platforms support environment variables through their dashboards or CLI tools.

## Obtaining Taxi4U Credentials

Contact Taxi4U support to get your API credentials:
- Email: support@taxi4u.cab
- Provide your central code (VS for Voss Taxi)
- Request API access for web booking integration

## Security Best Practices

1. **Never commit `.env.local` to Git** (already in `.gitignore`)
2. **Use different credentials for development and production**
3. **Rotate passwords regularly**
4. **Restrict API access to your server's IP if possible**
5. **Enable two-factor authentication on your email account**

## Testing Configuration

### Test Taxi4U Connection

Try making a booking through the website. If successful, your Taxi4U credentials are working.

### Test SMTP Configuration

Visit: `http://localhost:3000/api/email/test-smtp`

This will test your SMTP connection and send a test email.

## Common Issues

### "Receipt service is not configured"

**Error:** When trying to email a receipt, you see "Kvitteringsteneste er ikkje konfigurert"

**Solution:** Add `TAXI4U_USER_ID` and `TAXI4U_PASSWORD` to your `.env.local` file

### "Could not send email"

**Error:** Receipt PDF generates but email fails

**Solution:** Check SMTP settings in `.env.local`. Try the test endpoint at `/api/email/test-smtp`

### Environment variables not loading

**Solution:**
1. Ensure file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
2. Restart your development server after creating/editing the file
3. Check that variables don't have quotes around values (unless the value itself contains spaces)

## File Priority

Next.js loads environment files in this order (later files override earlier):
1. `.env` - For all environments
2. `.env.local` - For all environments (gitignored)
3. `.env.development` - Development only
4. `.env.development.local` - Development only (gitignored)
5. `.env.production` - Production only
6. `.env.production.local` - Production only (gitignored)

**Recommended:** Use `.env.local` for local development.

## Support

For help with environment setup:
- Check [EMAIL_AND_PDF_SETUP.md](./EMAIL_AND_PDF_SETUP.md) for email/receipt configuration
- Review the [QUICKSTART.md](./QUICKSTART.md) guide
- Contact Taxi4U support for API credential issues
