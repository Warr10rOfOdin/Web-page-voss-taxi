# Changelog

All notable changes to the Voss Taxi website project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive input validation for all booking endpoints
- Enhanced error logging with timestamps and stack traces
- User-friendly error messages with detailed feedback
- TODO.md for tracking project tasks and issues
- CHANGELOG.md for documenting changes
- Structured error responses with error types

### Changed
- Improved error handling across all API endpoints
- Better logging format for debugging
- Enhanced validation error messages

## [0.2.0] - 2026-03-06

### Added
- **Kartverket address autocomplete integration**
  - Norwegian address search via ws.geonorge.no API
  - Auto-fills street, city, and postal code
  - Works for both pickup and destination addresses
  - Debounced search with 300ms delay
- AddressAutocomplete UI component

### Changed
- **Removed ALL zone calculation logic**
  - No more zone number fields (fromZoneNo, toZoneNo)
  - API now receives only address information
  - Simplified booking payload structure
- **Made destination optional**
  - Removed required attribute from destination fields
  - Added "(optional)" label to destination section
  - Price quote still requires destination
- Integrated AddressAutocomplete into BookingForm
- Improved booking form UX

### Fixed
- "From ZoneNo is missing" API errors
- "Geopos Unrecognized" price quote errors
- Zone calculation inconsistencies

## [0.1.0] - 2026-03-06

### Added
- **Auto-determined vehicle type**
  - 1-4 passengers → Standard Taxi (carGroupId 1)
  - 5-6 passengers → Large Taxi (carGroupId 2)
  - 7+ passengers → Minibus (carGroupId 3)
- Zone number fields with dual naming (fromZone/fromZoneNo)
- City fields to price quote requests

### Removed
- Vehicle type (Kjøretøytype) dropdown from UI
- Manual vehicle selection

### Changed
- Vehicle type now calculated automatically from passenger count
- Simplified booking form

### Fixed
- Vehicle type selection requirement
- Price quote API "Geopos Unrecognized" errors

## [0.0.1] - Initial Setup

### Added
- Next.js 14 with App Router
- TypeScript configuration
- Tailwind CSS for styling
- Internationalization (i18n) support
- Basic booking form
- Taxi4U API integration
- Price quote calculator
- GPS location support
- Multiple booking endpoints:
  - `/api/booking/general` - Multi-passenger bookings
  - `/api/booking/simple` - Single passenger bookings
  - `/api/pricequote` - Price estimates
- Environment configuration
- Git repository setup

### Components
- BookingForm - Main booking interface
- CalculatorEmbed - Price calculator
- AddressAutocomplete - Address search (initially unused)
- UI components (Button, Card, etc.)

### API Integration
- Taxi4U authentication with token management
- Automatic token refresh
- Zone number calculation (later removed)
- Norwegian address geocoding

---

## Migration Notes

### Zone Logic Removal (v0.2.0)
If upgrading from v0.1.0, note that:
- All zone calculation code has been removed
- API endpoints now send address-only data
- No zone fields (fromZone, toZone, fromZoneNo, toZoneNo) are included
- The Taxi4U API should handle address-to-zone mapping internally

### Vehicle Type Changes (v0.1.0)
- Remove any manual vehicle selection UI
- carGroupId is now calculated server-side based on passengerCount
- No user input needed for vehicle type selection
