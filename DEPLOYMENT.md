# Deployment Guide

This guide covers deploying the Voss Taxi website to production.

## Pre-Deployment Checklist

### 1. Content Review
- [ ] All Norwegian translations are complete and accurate
- [ ] All English translations are complete and accurate
- [ ] Contact information is correct (phone, email, address)
- [ ] All links are working
- [ ] Images are optimized and in place

### 2. Technical Review
- [ ] Run `npm run build` successfully
- [ ] Test all pages in Norwegian and English
- [ ] Test on mobile, tablet, and desktop
- [ ] Check accessibility (run Lighthouse audit)
- [ ] Verify SEO metadata on all pages
- [ ] Test all CTAs (buttons, links, phone numbers)

### 3. Configuration
- [ ] Set up booking URL (if using external booking system)
- [ ] Set up calculator URL (if using external calculator)
- [ ] Configure analytics (Google Analytics, etc.)
- [ ] Set up domain DNS records

## Deploying to Vercel (Recommended)

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Initial Voss Taxi website build"
git push origin claude/voss-taxi-website-rebuild-U68Bx
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: (leave default)

### Step 3: Environment Variables
Add any required environment variables in Vercel dashboard:
```
NEXT_PUBLIC_BOOKING_URL=https://your-booking-system.com
NEXT_PUBLIC_CALCULATOR_URL=https://your-calculator.com
```

### Step 4: Domain Setup
1. Go to Project Settings > Domains
2. Add custom domain: `www.vosstaxi.no` and `vosstaxi.no`
3. Update DNS records as instructed by Vercel:
   - Type: `A` Record, Name: `@`, Value: `76.76.21.21`
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your site at the Vercel URL
4. Once DNS propagates, visit `vosstaxi.no`

## Post-Deployment Tasks

### 1. Verify Production Site
- [ ] Test homepage loads correctly
- [ ] Test all navigation links
- [ ] Test language switching
- [ ] Test mobile menu
- [ ] Test all CTAs (Book Taxi, Call buttons)
- [ ] Verify phone number is clickable on mobile

### 2. Set Up Monitoring
- [ ] Configure Vercel Analytics
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure error tracking (optional: Sentry)

### 3. SEO & Marketing
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Business Profile (if not already done)
- [ ] Update Google Business Profile with website link
- [ ] Update Facebook page with website link
- [ ] Update Instagram bio with website link

### 4. Performance Optimization
- [ ] Run Lighthouse audit
- [ ] Optimize Core Web Vitals
- [ ] Set up CDN (Vercel handles this automatically)
- [ ] Enable compression (Vercel handles this automatically)

## Updating the Site

### Making Content Changes
1. Edit the appropriate translation file in `messages/`
2. Commit and push changes
3. Vercel will auto-deploy

### Adding New Pages
1. Create page in `app/[locale]/your-page/page.tsx`
2. Add translations to `messages/no.json` and `messages/en.json`
3. Add navigation link in `Header.tsx` (if needed)
4. Commit and push changes

### Updating Images
1. Optimize images (use TinyPNG or similar)
2. Place in `public/images/`
3. Update components to use new images
4. Commit and push changes

## Troubleshooting

### Build Fails
- Check error logs in Vercel dashboard
- Run `npm run build` locally to reproduce
- Common issues:
  - Missing dependencies: Run `npm install`
  - TypeScript errors: Fix type issues
  - Import errors: Check file paths

### 404 Errors
- Verify middleware configuration in `middleware.ts`
- Check route structure in `app/[locale]/`
- Ensure all pages export a default component

### Translation Issues
- Verify JSON syntax in translation files
- Check translation keys match in both NO and EN files
- Restart dev server after translation changes

## Support

For technical issues with the website, contact:
- Developer: [Your Contact Information]

For Vercel support:
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support
