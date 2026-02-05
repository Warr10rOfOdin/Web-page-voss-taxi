# Images Directory

Place your images in this directory. Recommended images:

## Required Images

### Hero Section
- `hero-voss-taxi.jpg` - Main hero image (1920x1080px recommended)
  - Should show: Voss landscape with taxi vehicle
  - High quality, professional photo

### Fleet
- `taxi-standard.jpg` - Standard taxi vehicle
- `taxi-maxi.jpg` - Maxi taxi (larger vehicle)
- `taxi-wheelchair.jpg` - Wheelchair accessible vehicle

### Destinations/Sightseeing
- `stalheimskleiva.jpg` - Scenic mountain road
- `tvindefossen.jpg` - Waterfall
- `naeroyfjorden.jpg` - Fjord scenery
- `voss-landscape.jpg` - General Voss scenery

### Logo
- `voss-taxi-logo.svg` - Logo in SVG format (preferred)
- `voss-taxi-logo.png` - Logo in PNG format (fallback)

### Favicon
- `favicon.ico` - Browser favicon (16x16, 32x32)
- `apple-touch-icon.png` - Apple touch icon (180x180)
- `icon-192.png` - PWA icon (192x192)
- `icon-512.png` - PWA icon (512x512)

## Image Guidelines

- **Format**: Use WebP for web images, with JPG/PNG fallbacks
- **Optimization**: Compress images before uploading (use tools like TinyPNG)
- **Dimensions**:
  - Hero images: 1920x1080px
  - Card images: 800x600px
  - Thumbnails: 400x300px
- **File size**: Keep under 200KB per image when possible
- **Alt text**: Always provide descriptive alt text in the components

## Using Images in Components

```tsx
import Image from 'next/image';

<Image
  src="/images/hero-voss-taxi.jpg"
  alt="Voss Taxi vehicle in beautiful Voss landscape"
  width={1920}
  height={1080}
  priority
/>
```
