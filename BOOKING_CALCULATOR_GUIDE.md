# Booking & Calculator Integration Guide

This guide explains how to set up and use the integrated Taxi4U booking system and calculator on your Voss Taxi website.

## Table of Contents

1. [Overview](#overview)
2. [Booking System Setup](#booking-system-setup)
3. [Calculator Integration](#calculator-integration)
4. [Testing the Integration](#testing-the-integration)
5. [Customization](#customization)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Your Voss Taxi website now includes:

### ✅ Direct Booking Integration
- Online booking form at `/no/book` and `/en/book`
- Real-time booking via Taxi4U API
- Instant booking confirmation with reference number
- Mobile-optimized user experience

### ✅ Calculator Embed
- Your voss-taxi-kalkulator embedded at `/calculator`
- Matching Voss Taxi UI/UX
- Full functionality with Google Maps integration
- Bilingual support (NO/EN)

### ✅ Seamless User Flow
- Hero section → Book Taxi button → Booking form
- Hero section → Fare Estimate → Calculator
- Header → "Bestill Taxi" button (always visible)
- Emergency phone number prominently displayed

---

## Booking System Setup

### Step 1: Get Taxi4U API Credentials

1. Contact Taxi4U to obtain your API credentials:
   - API Key (Bearer token)
   - Central Code (likely "VOSS")

2. Ask about API endpoint access and rate limits

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   # Taxi4U API Credentials
   TAXI4U_API_KEY=your_api_key_here_from_taxi4u
   TAXI4U_CENTRAL_CODE=VOSS
   ```

3. **IMPORTANT:** Never commit `.env` to git (it's already in `.gitignore`)

### Step 3: Deploy Environment Variables

**For Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add both variables:
   - `TAXI4U_API_KEY` (keep this secret)
   - `TAXI4U_CENTRAL_CODE`
4. Redeploy your application

**For other platforms:**
- Consult your platform's documentation for setting environment variables

### Step 4: Test the Booking Flow

1. Visit `/no/book` or `/en/book`
2. Fill out the form with test data
3. Submit and verify you get a booking reference
4. Check with Taxi4U if the booking appears in their system

---

## Calculator Integration

### Default Configuration

The calculator is embedded from:
```
https://voss-taxi-kalkulator.vercel.app
```

This URL is configurable via environment variable.

### Custom Calculator URL (Optional)

If you've deployed your calculator to a custom domain:

1. Update `.env`:
   ```env
   NEXT_PUBLIC_CALCULATOR_URL=https://your-custom-domain.com
   ```

2. Redeploy the website

3. The calculator will now load from your custom URL

### Calculator Features

The embedded calculator includes:
- Google Maps route calculation
- Address autocomplete
- Via points support
- Real-time price estimation
- Time-based tariff calculation (Day/Evening/Weekend/Holiday)
- Vehicle group selection (1-4, 5-6, 7-8, 9-16 seats)
- PDF export for price estimates
- Bilingual interface (NO/EN)

### Calculator Setup

Your calculator needs to be deployed separately. Follow these steps:

1. **Deploy your calculator:**
   ```bash
   cd /path/to/voss-taxi-kalkulator
   npm install
   npm run build
   vercel deploy
   ```

2. **Configure Google Maps API:**
   - Get API key from Google Cloud Console
   - Add to calculator's environment variables
   - Enable Maps JavaScript API and Places API

3. **Update calculator URL in website:**
   - Set `NEXT_PUBLIC_CALCULATOR_URL` in website's `.env`
   - Redeploy website

---

## Testing the Integration

### Booking System Test Checklist

- [ ] Visit booking page in Norwegian (`/no/book`)
- [ ] Visit booking page in English (`/en/book`)
- [ ] Fill out form with valid data
- [ ] Submit and verify booking reference appears
- [ ] Test with empty pickup time (should default to ASAP)
- [ ] Test with future pickup time
- [ ] Test error handling (invalid phone, etc.)
- [ ] Verify email/SMS confirmation (if Taxi4U sends them)
- [ ] Test on mobile devices
- [ ] Test "Call Now" button redirects to phone

### Calculator Test Checklist

- [ ] Calculator loads correctly in iframe
- [ ] Address autocomplete works
- [ ] Route calculation displays on map
- [ ] Price calculation shows correct values
- [ ] Tariff table updates based on parameters
- [ ] PDF generation works
- [ ] Language toggle works (NO/EN)
- [ ] Calculator is responsive on mobile
- [ ] Help cards display correctly
- [ ] Booking link from calculator works

### Integration Points Test

- [ ] Hero "Book Taxi" button → Booking page
- [ ] Hero "Fare Estimate" button → Calculator page
- [ ] Header "Bestill Taxi" button → Booking page (always visible)
- [ ] Calculator page "Book Online" button → Booking page
- [ ] All phone numbers are clickable (tap-to-call on mobile)
- [ ] Language toggle preserves current page
- [ ] Back button works correctly from all pages

---

## Customization

### Booking Form Customization

**Location:** `components/booking/BookingForm.tsx`

#### Change Default City/Postal Code

```typescript
const [formData, setFormData] = useState<BookingFormData>({
  // ...
  fromCity: 'Voss',  // Change this
  fromPostalCode: '5700',  // Change this
  // ...
});
```

#### Add Custom Fields

Add to the `BookingFormData` interface and form state, then include in the form JSX.

#### Modify Validation

Update the `handleSubmit` function to add custom validation logic.

### Calculator Customization

**Location:** `components/calculator/CalculatorEmbed.tsx`

#### Change Calculator Height

```typescript
<div style={{ minHeight: '800px' }}>  // Adjust this value
```

#### Add Calculator Parameters

Pass URL parameters to the calculator:

```typescript
const calculatorUrl = `${process.env.NEXT_PUBLIC_CALCULATOR_URL}?lang=${locale}&theme=dark`;
```

#### Customize Help Text

Edit the info and help cards in `CalculatorEmbed.tsx`.

### Styling

Both components use your existing Voss Taxi design system:
- **Colors:** `taxi-yellow`, `taxi-black`, `taxi-grey`
- **Components:** `Button`, `Card`, `Container`
- **Typography:** Tailwind classes matching your brand

No additional styling should be needed unless you want to customize further.

---

## Troubleshooting

### Booking Issues

**Problem:** "Booking failed" error

**Solutions:**
1. Check API credentials in `.env`
2. Verify `TAXI4U_API_KEY` is correct
3. Check Taxi4U API status
4. Look at browser console for detailed error
5. Check server logs (Vercel/hosting platform)

**Problem:** Booking succeeds but no confirmation

**Solution:**
- This is expected if Taxi4U doesn't send immediate confirmation
- The booking reference IS the confirmation
- Customer should receive SMS/email from Taxi4U separately

**Problem:** "CORS error" in browser console

**Solution:**
- This should NOT happen because bookings go through Next.js API routes
- If it does, check that API routes are deployed correctly
- Verify you're calling `/api/booking/simple` not the Taxi4U API directly

### Calculator Issues

**Problem:** Calculator doesn't load (blank iframe)

**Solutions:**
1. Check `NEXT_PUBLIC_CALCULATOR_URL` is set correctly
2. Verify calculator is deployed and accessible
3. Check browser console for iframe errors
4. Try opening calculator URL directly in browser
5. Check for Content Security Policy (CSP) issues

**Problem:** Calculator loads but maps don't work

**Solution:**
- This is a calculator configuration issue
- Check Google Maps API key in calculator's environment
- Verify Maps JavaScript API and Places API are enabled
- Check API key restrictions allow your domain

**Problem:** Calculator shows wrong language

**Solution:**
- The iframe URL includes `?lang=en` parameter for English
- Check that calculator supports this parameter
- Manually test: `https://your-calculator.vercel.app?lang=en`

### Environment Variable Issues

**Problem:** Environment variables not working after deployment

**Solutions:**
1. Verify variables are set in hosting platform (Vercel/etc.)
2. Redeploy after adding environment variables
3. For `NEXT_PUBLIC_*` variables, they must be set at BUILD time
4. Check variable names match exactly (case-sensitive)
5. No quotes needed around values in Vercel UI

**Problem:** API key exposed in client-side code

**Solution:**
- Server-side only variables (no `NEXT_PUBLIC_` prefix) are safe
- `TAXI4U_API_KEY` should NOT have `NEXT_PUBLIC_` prefix
- Only `NEXT_PUBLIC_CALCULATOR_URL` needs the prefix (it's public)

---

## API Routes Reference

### POST /api/booking/simple
Single passenger booking (recommended for most bookings)

**Request Body:**
```json
{
  "fromStreet": "Uttrågata 19",
  "fromCity": "Voss",
  "fromPostalCode": "5700",
  "toStreet": "Bergen Lufthavn",
  "toCity": "Bergen",
  "toPostalCode": "5258",
  "customerName": "Ole Nordmann",
  "tel": "+47 123 45 678",
  "messageToCar": "2 passengers with luggage",
  "pickupTime": "2026-02-05T14:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "bookRef": "ABC123456",
  "data": { /* Full booking data */ }
}
```

### POST /api/booking/general
Multi-passenger detailed booking

Supports multiple passengers with individual pickup/destination addresses.
See Taxi4U API documentation for full schema.

### GET /api/booking/details?bookRef=ABC123
Get booking details

**Response:** Full booking information including status, assigned vehicle, driver, etc.

### GET /api/booking/receipt?bookRef=ABC123
Get trip receipt

**Response:** Economic details (distance, time, price, etc.) after trip completion

---

## Security Best Practices

### API Key Protection

✅ **DO:**
- Store API key in environment variables
- Never commit `.env` to git
- Use server-side API routes (not client-side calls)
- Regenerate API key if exposed

❌ **DON'T:**
- Hardcode API key in source code
- Share API key in public channels
- Use API key in client-side JavaScript
- Commit `.env` to repository

### Rate Limiting

Consider adding rate limiting to API routes if you experience abuse:

```typescript
// Example using a simple in-memory store
const rateLimit = new Map();

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  // Check rate limit (example: 10 requests per minute)
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < 60000);

  if (recentRequests.length >= 10) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  // Continue with booking...
}
```

---

## Monitoring & Analytics

### Track Booking Conversions

Add analytics tracking to the booking success:

```typescript
// In BookingForm.tsx after successful booking
if (window.gtag) {
  window.gtag('event', 'booking_completed', {
    booking_ref: bookRef,
    value: 1,
  });
}
```

### Monitor API Errors

Check your hosting platform logs for API errors:

**Vercel:**
- Dashboard → Your Project → Functions
- Click on the API route to see invocation logs

**Other Platforms:**
- Consult platform documentation for logging

### Customer Support

When customers call about bookings:
1. Ask for booking reference number
2. Use `/api/booking/details?bookRef=XXX` to look up booking
3. Check Taxi4U dispatch system for real-time status

---

## Future Enhancements

### Potential Improvements

1. **Booking Confirmation Emails**
   - Set up email service (SendGrid, etc.)
   - Send confirmation to customer after booking
   - Include booking reference and trip details

2. **Real-time Tracking**
   - Integrate with Taxi4U tracking API (if available)
   - Show taxi location after booking
   - ETA updates

3. **Booking History**
   - Add user accounts
   - Store booking history
   - Quick re-booking of frequent trips

4. **Payment Integration**
   - Add Stripe/Vipps for prepayment
   - Set `prepaid: true` in booking request
   - Handle payment confirmation

5. **Advanced Calculator Integration**
   - Port calculator directly into Next.js (no iframe)
   - Tighter integration with booking form
   - Pre-fill booking form from calculator estimates

---

## Support

### Getting Help

**Technical Issues:**
- Check this guide first
- Review error messages in browser console
- Check server logs on your hosting platform
- Contact your developer

**Taxi4U API Issues:**
- Contact Taxi4U support
- Reference your API key and central code
- Provide booking reference if available

**Calculator Issues:**
- Check voss-taxi-kalkulator repository
- Test calculator independently
- Verify Google Maps API configuration

### Contact

For questions about this implementation:
- Review code in `app/api/booking/` directory
- Check `components/booking/BookingForm.tsx`
- See `components/calculator/CalculatorEmbed.tsx`

---

**Last Updated:** February 2026
**Version:** 1.0
**Built with ❤️ for Voss Taxi**
