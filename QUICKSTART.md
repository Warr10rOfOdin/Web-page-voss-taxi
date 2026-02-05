# Quick Start Guide

Get the Voss Taxi website running in 3 minutes!

## Prerequisites

- Node.js 18.17 or later
- npm (comes with Node.js)

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# Visit http://localhost:3000
```

That's it! The website should now be running locally.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Test the Site

1. Homepage: http://localhost:3000/no (Norwegian) or http://localhost:3000/en (English)
2. Click the language toggle to switch between NO/EN
3. Test the mobile menu (resize browser window)
4. Click "Bestill Taxi" buttons to test CTAs

## Key Pages to Check

- Homepage: `/no` or `/en`
- Services: `/no/services` or `/en/services`
- Tourist: `/no/tourist` or `/en/tourist`
- Contact: `/no/contact` or `/en/contact`

## Making Changes

### Update Text Content
Edit the translation files:
- Norwegian: `messages/no.json`
- English: `messages/en.json`

### Add Images
Place images in `public/images/` directory

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'taxi-yellow': '#FFD700',  // Change this
  'taxi-black': '#000000',
  'taxi-grey': '#4A4A4A',
}
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

## Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"

Done! Your site will be live in ~2 minutes.

## Need Help?

- Check `README.md` for full documentation
- See `DEPLOYMENT.md` for deployment guide
- Read `CONTENT_GUIDE.md` for content updates
- Review `IMPLEMENTATION_SUMMARY.md` for technical details

## Common Issues

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
```

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Translations not updating
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm run dev
```

---

**Questions?** Contact your developer or see the documentation files.
