# Voss Taxi Website

Modern, bilingual (Norwegian/English) website for Voss Taxi, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🌍 **Bilingual**: Full support for Norwegian (NO) and English (EN)
- 🎨 **Modern Design**: Clean, professional design with black/yellow branding
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- ⚡ **Fast Performance**: Built with Next.js App Router for optimal performance
- ♿ **Accessible**: WCAG compliant with proper semantic HTML
- 🔍 **SEO Optimized**: Meta tags, OpenGraph, and JSON-LD schema markup

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
voss-taxi-web/
├── app/
│   ├── [locale]/           # Localized routes
│   │   ├── business/       # Business services page
│   │   ├── calculator/     # Fare calculator page
│   │   ├── contact/        # Contact page
│   │   ├── privacy/        # Privacy policy
│   │   ├── services/       # Services overview
│   │   ├── terms/          # Terms & conditions
│   │   ├── tourist/        # Sightseeing/tours page
│   │   ├── wheelchair/     # Wheelchair accessible taxi
│   │   ├── layout.tsx      # Layout with Header/Footer
│   │   └── page.tsx        # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # Homepage sections
│   └── ui/                 # Reusable UI components
├── messages/               # Translation files
│   ├── no.json            # Norwegian translations
│   └── en.json            # English translations
├── lib/                    # Utility functions
├── public/                 # Static assets
├── i18n.ts                 # i18n configuration
├── middleware.ts           # Next.js middleware for i18n
├── tailwind.config.ts      # Tailwind configuration
└── next.config.js          # Next.js configuration
```

## Pages

- **Home** (`/`) - Hero, services highlights, fare estimator, trust section, tourist spotlight
- **Services** (`/services`) - Complete overview of all taxi services
- **Tourist/Sightseeing** (`/tourist`) - Tours and sightseeing packages
- **Fare Calculator** (`/calculator`) - Price estimation tool
- **Wheelchair Accessible** (`/wheelchair`) - Accessible transport information
- **Business** (`/business`) - Corporate services and invoicing
- **Contact** (`/contact`) - Contact information and hours
- **Privacy** (`/privacy`) - Privacy policy and GDPR information
- **Terms** (`/terms`) - Terms and conditions

## Customization

### Colors

Brand colors are defined in `tailwind.config.ts`:

- **Taxi Yellow**: `#FFD700`
- **Taxi Black**: `#000000`
- **Taxi Grey**: `#4A4A4A`
- **Taxi Light Grey**: `#F5F5F5`

### Translations

Edit translation files in the `messages/` directory:

- `messages/no.json` - Norwegian translations
- `messages/en.json` - English translations

### Adding New Languages

1. Add locale to `i18n.ts`
2. Create new translation file in `messages/`
3. Update language toggle in `Header.tsx`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Set domain: `vosstaxi.no`
4. Deploy

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js.

## Contact

**Voss Taxi**
- Address: Uttrågata 19, 5700 Voss
- Phone: +47 56 51 13 40
- Email: post@vosstaxi.no

## License

© 2024 Voss Taxi. All rights reserved.
