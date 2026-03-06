# Voss Taxi Website

Modern, bilingual (Norwegian/English) website for Voss Taxi with integrated online booking system, built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

### Core Functionality
- 🚕 **Online Booking System**: Real-time taxi booking through Taxi4U API
- 📍 **Smart Address Search**: Norwegian address autocomplete via Kartverket API
- 💰 **Price Calculator**: Get instant price estimates for your trip
- 🌍 **Bilingual**: Full support for Norwegian (NO) and English (EN)
- 📱 **Mobile-First**: Fully responsive design optimized for all devices

### Booking Features
- **Auto-completing Addresses**: Type-ahead suggestions for Norwegian addresses
- **GPS Location**: Use your current location as pickup point
- **Optional Destination**: Book without specifying destination
- **Smart Vehicle Selection**: Automatic vehicle type based on passenger count
- **Multi-Passenger Support**: Book for 1-8 passengers
- **Price Estimates**: Get fare estimates before booking (requires destination)

### Technical Features
- ⚡ **Fast Performance**: Built with Next.js App Router for optimal performance
- ♿ **Accessible**: WCAG compliant with proper semantic HTML
- 🔍 **SEO Optimized**: Meta tags, OpenGraph, and JSON-LD schema markup
- 🔒 **Secure**: Input validation and sanitization
- 📊 **Error Tracking**: Comprehensive logging and error handling

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **UI Components**: Custom components with Tailwind

### Backend/API
- **Booking API**: Taxi4U API integration
- **Address Search**: Kartverket (ws.geonorge.no) API
- **Authentication**: Token-based auth with automatic refresh
- **Geocoding**: OpenStreetMap Nominatim

### Deployment
- **Hosting**: Vercel (recommended)
- **Runtime**: Node.js 18+

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Warr10rOfOdin/Web-page-voss-taxi.git
cd Web-page-voss-taxi
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Taxi4U API Configuration
TAXI4U_API_BASE=https://api.taxi4u.cab
TAXI4U_CENTRAL_CODE=VS
TAXI4U_USER_ID=voss
TAXI4U_PASSWORD=your_password_here
TAXI4U_DEFAULT_ACCOUNT_NO=0

# Optional: Override default settings
# NODE_ENV=development
```

**⚠️ Security Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 🔌 API Endpoints

### Booking APIs

#### POST `/api/booking/general`
Multi-passenger booking with detailed options.

**Request Body:**
```json
{
  "orderedBy": "Website",
  "pickupTime": "2026-03-07T10:00:00.000Z",
  "carGroupId": 1,
  "numberOfCars": 1,
  "passengers": [
    {
      "seqNo": 1,
      "clientName": "John Doe",
      "tel": "12345678",
      "fromStreet": "Uttrågata 19",
      "fromCity": "Voss",
      "fromPostalCode": "5700",
      "toStreet": "Vossevangen Stasjon",
      "toCity": "Voss",
      "toPostalCode": "5700",
      "pickupTime": "2026-03-07T10:00:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "internalNo": "12345",
  "bookRef": "VOSS-12345",
  "data": { /* Full booking details */ }
}
```

#### POST `/api/booking/simple`
Single passenger booking (simplified).

**Request Body:**
```json
{
  "customerName": "John Doe",
  "tel": "12345678",
  "fromStreet": "Uttrågata 19",
  "fromCity": "Voss",
  "fromPostalCode": "5700",
  "toStreet": "",
  "toCity": "",
  "toPostalCode": "",
  "pickupTime": "2026-03-07T10:00:00.000Z",
  "orderedBy": "Website"
}
```

#### POST `/api/pricequote`
Get price estimate for a trip.

**Request Body:**
```json
{
  "fromStreet": "Uttrågata 19",
  "fromCity": "Voss",
  "fromPostalCode": "5700",
  "toStreet": "Vossevangen Stasjon",
  "toCity": "Voss",
  "toPostalCode": "5700",
  "attributes": [],
  "pickupTime": "2026-03-07T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "price": 150,
  "tariff": "Standard"
}
```

### Error Handling

All endpoints return structured error responses:

```json
{
  "error": "Booking failed",
  "details": "Detailed error message",
  "statusCode": 400,
  "type": "validation_error"
}
```

**Error Types:**
- `validation_error` - Invalid input data
- `api_error` - External API failure
- `server_error` - Internal server error

## 📁 Project Structure

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
│   ├── api/                # API routes
│   │   ├── booking/
│   │   │   ├── general/    # Multi-passenger booking
│   │   │   └── simple/     # Single passenger booking
│   │   └── pricequote/     # Price estimation
│   └── globals.css         # Global styles
├── components/
│   ├── booking/            # Booking form components
│   ├── calculator/         # Price calculator components
│   ├── layout/             # Header, Footer
│   ├── sections/           # Homepage sections
│   └── ui/                 # Reusable UI components
│       ├── AddressAutocomplete.tsx  # Address search
│       ├── Button.tsx
│       └── Card.tsx
├── lib/
│   ├── taxi4u-auth.ts      # Taxi4U API authentication
│   ├── zones.ts            # Zone definitions (legacy)
│   └── utils.ts            # Utility functions
├── messages/               # Translation files
│   ├── no.json            # Norwegian translations
│   └── en.json            # English translations
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── .env.local             # Environment variables (gitignored)
├── CHANGELOG.md           # Version history
├── README.md              # This file
├── ROADMAP.md             # Future plans
├── TODO.md                # Task tracking
├── i18n.ts                # i18n configuration
├── middleware.ts           # Next.js middleware for i18n
├── tailwind.config.ts      # Tailwind configuration
└── next.config.js          # Next.js configuration
```

## 📄 Pages

### Public Pages
- **Home** (`/`) - Hero, online booking, services highlights, fare estimator
- **Services** (`/services`) - Complete overview of all taxi services
- **Tourist/Sightseeing** (`/tourist`) - Tours and sightseeing packages
- **Fare Calculator** (`/calculator`) - Interactive price estimation tool
- **Wheelchair Accessible** (`/wheelchair`) - Accessible transport information
- **Business** (`/business`) - Corporate services and invoicing
- **Contact** (`/contact`) - Contact information, hours, and booking form

### Legal Pages
- **Privacy** (`/privacy`) - Privacy policy and GDPR compliance
- **Terms** (`/terms`) - Terms and conditions

### Features
- **Online Booking**: Integrated booking form with address autocomplete
- **Real-time Price Quotes**: Get instant fare estimates
- **Multi-language**: All pages available in Norwegian and English

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

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables in Vercel dashboard:
   - `TAXI4U_API_BASE`
   - `TAXI4U_CENTRAL_CODE`
   - `TAXI4U_USER_ID`
   - `TAXI4U_PASSWORD`
   - `TAXI4U_DEFAULT_ACCOUNT_NO`
4. Set custom domain: `vosstaxi.no`
5. Deploy

### Other Platforms

This is a standard Next.js application and can be deployed to:
- **Netlify**: Supports Next.js out of the box
- **AWS Amplify**: Configure build settings for Next.js
- **Digital Ocean App Platform**: Use Node.js runtime
- **Self-hosted**: Use Docker or PM2

**Build Command**: `npm run build`
**Start Command**: `npm start`
**Node Version**: 18.x or higher

## 🐛 Troubleshooting

### Common Issues

#### Booking fails with "Booking failed" error
- Check that all environment variables are set correctly
- Verify Taxi4U API credentials
- Check API logs in Vercel dashboard or console

#### Address autocomplete not working
- Kartverket API may be down or slow
- Check browser console for network errors
- Ensure you're typing Norwegian addresses

#### Price quote returns error
- Both pickup and destination addresses are required
- Ensure city and postal code are included
- Check that addresses are in Voss area

#### GPS location not working
- User must grant location permission
- GPS may not work indoors or with poor signal
- Try refreshing the page

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
```

Check logs in:
- Browser console (F12)
- Server logs (Vercel dashboard or terminal)
- Network tab for API calls

## 📚 Documentation

- **[TODO.md](./TODO.md)** - Task tracking and known issues
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and changes
- **[ROADMAP.md](./ROADMAP.md)** - Future plans and features
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide (if exists)

## 🤝 Contributing

This is a private project for Voss Taxi. If you're a developer working on this project:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Add comments for complex logic
- Keep components small and focused

### Testing
- Test all booking flows end-to-end
- Verify both Norwegian and English versions
- Check mobile responsiveness
- Test error scenarios

## Contact

**Voss Taxi**
- Address: Uttrågata 19, 5700 Voss
- Phone: +47 56 51 13 40
- Email: post@vosstaxi.no

## License

© 2024 Voss Taxi. All rights reserved.
