# TODO - Voss Taxi Website

## 🚨 High Priority

### Booking System
- [ ] Test booking flow end-to-end with real Taxi4U API
- [ ] Add booking confirmation email/SMS integration
- [ ] Implement booking history for users
- [ ] Add ability to cancel/modify bookings
- [x] Comprehensive input validation with clear error messages
- [x] TypeScript interfaces for type safety
- [x] Retry logic for transient failures
- [ ] Handle edge cases:
  - [x] Network timeouts (retry logic implemented)
  - [ ] API rate limiting
  - [ ] Concurrent bookings
  - [x] Invalid phone numbers (validation implemented)

### Address Autocomplete
- [ ] Test Kartverket API reliability
- [ ] Add fallback for Kartverket API failures
- [ ] Cache frequently used addresses
- [ ] Add manual address entry option
- [ ] Improve mobile keyboard experience

### Error Handling
- [ ] Add user-friendly error messages in Norwegian
- [ ] Implement error tracking/monitoring (Sentry?)
- [ ] Add retry logic for failed API calls
- [ ] Create error recovery flows

## 🔧 Medium Priority

### UI/UX Improvements
- [ ] Add loading states for all async operations
- [ ] Improve mobile responsiveness
- [ ] Add animations/transitions
- [ ] Implement proper form validation feedback
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Support dark mode

### Price Calculator
- [ ] Verify price calculation accuracy
- [ ] Add price estimate disclaimer
- [ ] Show price breakdown (base fare, distance, time)
- [ ] Add surge pricing indicators
- [ ] Save price quotes for comparison

### Internationalization
- [ ] Complete Norwegian (Nynorsk) translations
- [ ] Add English translations
- [ ] Verify all UI text is translatable
- [ ] Add language switcher

## 📊 Low Priority / Future Enhancements

### Analytics & Monitoring
- [x] Health check endpoint for monitoring (/api/health)
- [ ] Add Google Analytics or privacy-friendly alternative
- [ ] Track booking conversion rates
- [ ] Monitor API performance
- [ ] Set up uptime monitoring with health endpoint
- [ ] Create admin dashboard

### Features
- [ ] Corporate account bookings
- [ ] Recurring bookings
- [ ] Favorite locations
- [ ] Multiple passengers/stops
- [ ] Special requests (child seat, wheelchair accessible)
- [ ] Real-time driver tracking
- [ ] In-app payments
- [ ] Rating/review system

### Technical Improvements
- [ ] Add comprehensive test suite (unit, integration, e2e)
- [ ] Set up CI/CD pipeline
- [ ] Optimize bundle size
- [ ] Implement service worker for offline support
- [ ] Add database for booking history
- [ ] Implement user authentication
- [ ] Add rate limiting
- [ ] Security audit

### Documentation
- [x] Create TODO.md
- [ ] Create CHANGELOG.md
- [ ] Create ROADMAP.md
- [ ] Update README.md
- [ ] Add API documentation
- [ ] Create developer setup guide
- [ ] Add contributing guidelines

## 🐛 Known Issues

1. **Zone number errors** - API sometimes rejects valid addresses (removed zone logic as workaround)
2. **Price quote requires destination** - Cannot get estimate for unknown destination
3. **GPS location accuracy** - May not work accurately indoors
4. **Kartverket API** - No SLA, could be slow or unavailable

## 🔍 Investigation Needed

- [ ] Understand Taxi4U API zone requirements fully
- [ ] Determine if API supports optional destinations
- [ ] Check if there's a sandbox/test environment
- [ ] Verify attribute IDs for passenger counts
- [ ] Understand carGroupId assignment logic

## 📝 Notes

- Removed all zone calculation logic - API should handle address-to-zone mapping
- Vehicle type (carGroupId) auto-determined by passenger count
- Destination is optional for bookings but required for price quotes
- Using Kartverket (ws.geonorge.no) for Norwegian address autocomplete
