'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';

interface BookingFormProps {
  locale: string;
}

export function BookingForm({ locale }: BookingFormProps) {
  const t = useTranslations('booking');
  const tCta = useTranslations('cta');

  // Basic booking info
  const [clientName, setClientName] = useState('');
  const [tel, setTel] = useState('');
  const [fromStreet, setFromStreet] = useState('');
  const [fromCity, setFromCity] = useState('Voss');
  const [fromPostalCode, setFromPostalCode] = useState('5700');
  const [fromLat, setFromLat] = useState<number | null>(null);
  const [fromLon, setFromLon] = useState<number | null>(null);
  const [toStreet, setToStreet] = useState('');
  const [toCity, setToCity] = useState('');
  const [toPostalCode, setToPostalCode] = useState('');
  const [toLat, setToLat] = useState<number | null>(null);
  const [toLon, setToLon] = useState<number | null>(null);
  const [pickupTime, setPickupTime] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [messageToCar, setMessageToCar] = useState('');

  // Price quote state
  const [priceQuote, setPriceQuote] = useState<{ tariff: string; price: number } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Booking state
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookRef, setBookRef] = useState<string | null>(null);

  // Rules checking state
  const [ruleWarnings, setRuleWarnings] = useState<any[]>([]);
  const [ruleRestrictions, setRuleRestrictions] = useState<any[]>([]);
  const [ruleDisclaimers, setRuleDisclaimers] = useState<any[]>([]);
  const [hasRestrictions, setHasRestrictions] = useState(false);

  // Get current GPS location and reverse geocode to address
  const getMyLocation = async () => {
    setLoadingLocation(true);
    setError(null);

    try {
      // Get GPS coordinates
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error(locale === 'no' ? 'GPS er ikke tilgjengeleg i nettlesaren din' : 'Geolocation is not supported by your browser'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      // Store GPS coordinates
      setFromLat(latitude);
      setFromLon(longitude);

      // Reverse geocode using Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': locale === 'no' ? 'no,nn,nb' : 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error(locale === 'no' ? 'Kunne ikkje hente adresse' : 'Could not fetch address');
      }

      const data = await response.json();
      const address = data.address;

      // Update location fields
      setFromStreet(address.road || address.suburb || '');
      setFromCity(address.town || address.city || address.village || 'Voss');
      setFromPostalCode(address.postcode || '5700');

    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        if (err.code === err.PERMISSION_DENIED) {
          setError(locale === 'no' ? 'Du må gi løyve til å bruke GPS-posisjonen din' : 'You must allow location access');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError(locale === 'no' ? 'Posisjon er ikkje tilgjengeleg' : 'Location unavailable');
        } else {
          setError(locale === 'no' ? 'Tidsavbrot ved henting av posisjon' : 'Location request timed out');
        }
      } else {
        setError(err instanceof Error ? err.message : (locale === 'no' ? 'Kunne ikkje hente posisjon' : 'Could not get location'));
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  // Check booking rules
  const checkRules = async (pickupTimeStr: string) => {
    if (!pickupTimeStr) {
      setRuleWarnings([]);
      setRuleRestrictions([]);
      setRuleDisclaimers([]);
      setHasRestrictions(false);
      return;
    }

    try {
      const response = await fetch(`/api/booking/check-rules?pickupTime=${encodeURIComponent(pickupTimeStr)}`);
      const data = await response.json();

      if (data.success) {
        setRuleWarnings(data.data.warnings || []);
        setRuleRestrictions(data.data.restrictions || []);
        setRuleDisclaimers(data.data.disclaimers || []);
        setHasRestrictions(data.data.hasRestrictions);
      }
    } catch (error) {
      console.error('Error checking rules:', error);
    }
  };

  // Get price quote
  const getPriceQuote = async () => {
    if (!fromStreet || !toStreet) {
      setPriceError(locale === 'no' ? 'Fyll ut henting- og leveringsadresse først' : 'Please fill in pickup and destination addresses first');
      return;
    }

    setLoadingPrice(true);
    setPriceError(null);
    setPriceQuote(null);

    try {
      // Calculate attributes based on passenger count
      // ONLY send attributes for 2-4 passengers (standard taxi)
      // For 5+ passengers, rely solely on carGroupId (2 or 3)
      const attributes: number[] = [];
      if (passengerCount >= 2 && passengerCount <= 4) {
        attributes.push(passengerCount); // 2 PERSONER, 3 PERSONER, 4 PERSONER
      }
      // 5-8 passengers: no attributes, carGroupId determines vehicle type

      const response = await fetch('/api/pricequote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromStreet,
          fromCity,
          fromPostalCode,
          fromLat: 0,
          fromLon: 0,
          toStreet,
          toCity,
          toPostalCode,
          toLat: 0,
          toLon: 0,
          attributes,
          pickupTime: pickupTime || new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get price quote');
      }

      setPriceQuote({ tariff: data.tariff, price: data.price });
    } catch (err) {
      setPriceError(err instanceof Error ? err.message : 'Failed to get price quote');
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Auto-determine vehicle type based on passenger count
    // 1-4 passengers = Standard Taxi (carGroupId 1)
    // 5-6 passengers = Large Taxi (carGroupId 2)
    // 7+ passengers = Minibus (carGroupId 3)
    const carGroupId = passengerCount <= 4 ? 1 : passengerCount <= 6 ? 2 : 3;

    try {
      // Calculate attributes based on passenger count
      // ONLY send attributes for 2-4 passengers (standard taxi)
      // For 5+ passengers, rely solely on carGroupId (2 or 3)
      const attributes: number[] = [];
      if (passengerCount >= 2 && passengerCount <= 4) {
        attributes.push(passengerCount); // 2 PERSONER, 3 PERSONER, 4 PERSONER
      }
      // 5-8 passengers: no attributes, carGroupId determines vehicle type

      // Prepare booking data for API
      // Calculate pickup time - round to nearest 5 minutes
      const calculatePickupTime = (): string => {
        if (pickupTime) {
          return new Date(pickupTime).toISOString();
        }
        // Book now: add 15 minutes and round to nearest 5
        const now = new Date(Date.now() + 15 * 60000);
        return roundToNearest5Minutes(now).toISOString();
      };

      const finalPickupTime = calculatePickupTime();

      const bookingData = {
        orderedBy: 'Website',
        messageToCar: messageToCar || undefined,
        pickupTime: finalPickupTime,
        carGroupId: carGroupId,
        numberOfCars: 1,
        attributes: attributes.length > 0 ? attributes : undefined,
        passengers: [{
          seqNo: 1,
          clientName,
          tel,
          fromStreet,
          fromCity,
          fromPostalCode,
          fromLat,
          fromLon,
          toStreet: toStreet || undefined,
          toCity: toCity || undefined,
          toPostalCode: toPostalCode || undefined,
          toLat,
          toLon,
          pickupTime: finalPickupTime,
        }],
      };

      const response = await fetch('/api/booking/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || 'Booking failed');
      }

      setSuccess(true);
      setBookRef(data.bookRef);

      // Send SMS confirmation (non-blocking)
      try {
        const pickupTimeFormatted = pickupTime
          ? new Date(pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US')
          : (locale === 'no' ? 'Snarast mogleg' : 'As soon as possible');

        await fetch('/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: tel,
            bookRef: data.bookRef,
            pickupTime: pickupTimeFormatted,
            from: `${fromStreet}, ${fromCity}`,
          }),
        });
      } catch (smsError) {
        console.error('SMS send failed:', smsError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClientName('');
    setTel('');
    setFromStreet('');
    setFromCity('Voss');
    setFromPostalCode('5700');
    setToStreet('');
    setToCity('');
    setToPostalCode('');
    setPickupTime('');
    setPassengerCount(1);
    setMessageToCar('');
    setPriceQuote(null);
    setPriceError(null);
    setSuccess(false);
    setBookRef(null);
  };

  // Round time to nearest 5-minute increment
  const roundToNearest5Minutes = (date: Date): Date => {
    const minutes = date.getMinutes();
    const remainder = minutes % 5;
    const roundedMinutes = remainder >= 2.5 ? minutes + (5 - remainder) : minutes - remainder;

    const newDate = new Date(date);
    newDate.setMinutes(roundedMinutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return newDate;
  };

  // Get minimum datetime (now + 15 minutes, rounded to nearest 5)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15); // Add 15 minutes buffer
    const rounded = roundToNearest5Minutes(now);
    return rounded.toISOString().slice(0, 16);
  };

  if (success && bookRef) {
    return (
      <div className="glass-dark backdrop-blur-xl rounded-3xl overflow-hidden depth-4">
        <div className="p-8 md:p-12 text-center space-y-6">
          {/* Success Icon with Glow */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full glass-yellow depth-glow-strong mb-4">
            <svg className="w-12 h-12 text-taxi-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            {t('successTitle')}
          </h2>

          <p className="text-lg text-taxi-light-grey/90">{t('successMessage')}</p>

          {/* Booking Reference Card */}
          <div className="glass-strong backdrop-blur-xl rounded-2xl p-6 depth-2 border-2 border-taxi-yellow/30">
            <p className="text-sm text-taxi-light-grey/70 mb-2">{t('bookingReference')}</p>
            <p className="text-3xl md:text-4xl font-bold text-taxi-yellow tracking-wider font-mono">
              {bookRef}
            </p>
            <p className="text-xs text-taxi-light-grey/60 mt-3">
              {locale === 'no' ? 'Ta vare på denne referansen' : 'Save this reference number'}
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="glass-strong backdrop-blur-xl rounded-2xl p-6 depth-2 border border-white/10 text-left">
            <h3 className="text-lg font-bold text-white mb-4">
              {locale === 'no' ? 'Bookingdetaljer' : 'Booking Details'}
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-taxi-light-grey/60 mb-1">
                  {locale === 'no' ? 'Henting' : 'Pickup'}
                </p>
                <p className="text-white font-semibold">
                  {fromStreet}, {fromCity} {fromPostalCode}
                </p>
              </div>
              {toStreet && (
                <div>
                  <p className="text-taxi-light-grey/60 mb-1">
                    {locale === 'no' ? 'Destinasjon' : 'Destination'}
                  </p>
                  <p className="text-white font-semibold">
                    {toStreet}, {toCity} {toPostalCode}
                  </p>
                </div>
              )}
              <div>
                <p className="text-taxi-light-grey/60 mb-1">
                  {locale === 'no' ? 'Hentetid' : 'Pickup Time'}
                </p>
                <p className="text-white font-semibold">
                  {pickupTime
                    ? new Date(pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })
                    : (locale === 'no' ? 'Snarast mogleg' : 'As soon as possible')
                  }
                </p>
              </div>
              <div>
                <p className="text-taxi-light-grey/60 mb-1">
                  {locale === 'no' ? 'Passasjerer' : 'Passengers'}
                </p>
                <p className="text-white font-semibold">
                  {passengerCount} {passengerCount === 1 ? (locale === 'no' ? 'passasjer' : 'passenger') : (locale === 'no' ? 'passasjerer' : 'passengers')}
                </p>
              </div>
            </div>
          </div>

          <p className="text-taxi-light-grey/90">{t('confirmationNote')}</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href={`/${locale}/manage-booking`}
              className="flex-1 glass-yellow rounded-full px-8 py-4 font-bold text-taxi-black hover-scale smooth-transition depth-2 inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {locale === 'no' ? 'Sjekk/endre booking' : 'View/Manage Booking'}
            </a>
            <button
              onClick={resetForm}
              className="flex-1 glass-strong backdrop-blur-xl rounded-full px-8 py-4 font-bold text-white hover:text-taxi-yellow hover-lift smooth-transition depth-2"
            >
              {t('bookAnother')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-dark backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden depth-4">
      <div className="p-4 sm:p-6 md:p-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">
          {t('title')}
        </h2>
        <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-taxi-yellow to-transparent mb-6 sm:mb-8 rounded-full" />

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">
                {t('name')} *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-taxi-light-grey/50 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">
                {t('phone')} *
              </label>
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
                className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-taxi-light-grey/50 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition"
                placeholder="+47 123 45 678"
              />
            </div>
          </div>

          {/* Passenger Count */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              {locale === 'no' ? 'Antall passasjerer *' : 'Number of Passengers *'}
            </label>
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              required
              className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition"
            >
              <option value={1}>1 {locale === 'no' ? 'passasjer' : 'passenger'}</option>
              <option value={2}>2 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={3}>3 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={4}>4 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={5}>5 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={6}>6 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={7}>7 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
              <option value={8}>8 {locale === 'no' ? 'passasjerer' : 'passengers'}</option>
            </select>
          </div>

          {/* Pickup Location */}
          <div className="glass-strong backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4 sm:space-y-5 mt-4 sm:mt-6">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-lg sm:text-xl font-bold text-taxi-yellow flex items-center flex-shrink-0">
                <svg className="w-5 h-5 text-taxi-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" />
                </svg>
                <span className="hidden sm:inline">{t('pickupLocation')}</span>
                <span className="sm:hidden">{locale === 'no' ? 'Henting' : 'Pickup'}</span>
              </h3>
              <button
                type="button"
                onClick={getMyLocation}
                disabled={loadingLocation}
                className="text-xs sm:text-sm font-semibold text-taxi-black hover:text-taxi-black/80 transition-colors flex items-center gap-1 disabled:opacity-50 glass-yellow px-4 py-3 rounded-full hover-scale smooth-transition whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {loadingLocation
                  ? (locale === 'no' ? 'Hentar...' : 'Getting...')
                  : (locale === 'no' ? 'Bruk min posisjon' : 'Use my location')
                }
              </button>
            </div>

            <AddressAutocomplete
              value={fromStreet}
              onChange={setFromStreet}
              onSelect={(address) => {
                setFromStreet(address.street);
                setFromCity(address.city);
                setFromPostalCode(address.postalCode);
                // Store GPS coordinates if available
                if (address.lat && address.lon) {
                  setFromLat(address.lat);
                  setFromLon(address.lon);
                }
              }}
              label={t('street')}
              placeholder="Uttrågata 19"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  {t('city')} *
                </label>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  required
                  className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-taxi-light-grey/50 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  {t('postalCode')} *
                </label>
                <input
                  type="text"
                  value={fromPostalCode}
                  onChange={(e) => setFromPostalCode(e.target.value)}
                  required
                  className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-taxi-light-grey/50 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition"
                />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="glass-strong backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4 sm:space-y-5 mt-4">
            <h3 className="text-lg sm:text-xl font-bold text-taxi-yellow flex items-center mb-1">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-taxi-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('destination')}
              <span className="ml-2 text-xs text-taxi-light-grey/60 font-normal">
                ({locale === 'no' ? 'valfritt' : 'optional'})
              </span>
            </h3>

            <AddressAutocomplete
              value={toStreet}
              onChange={setToStreet}
              onSelect={(address) => {
                setToStreet(address.street);
                setToCity(address.city);
                setToPostalCode(address.postalCode);
                // Store GPS coordinates if available
                if (address.lat && address.lon) {
                  setToLat(address.lat);
                  setToLon(address.lon);
                }
              }}
              label={t('street')}
              placeholder={t('optionalDestination')}
              required={false}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  {t('city')}
                </label>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-taxi-light-grey/50 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  {t('postalCode')}
                </label>
                <input
                  type="text"
                  value={toPostalCode}
                  onChange={(e) => setToPostalCode(e.target.value)}
                  className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-taxi-light-grey/50 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition"
                />
              </div>
            </div>
          </div>

          {/* Price Quote Button - Only for 1-4 passengers */}
          {passengerCount >= 1 && passengerCount <= 4 && (
            <div>
              <Button
                type="button"
                onClick={getPriceQuote}
                disabled={loadingPrice || !fromStreet || !toStreet}
                variant="secondary"
                className="w-full"
                title={!toStreet ? (locale === 'no' ? 'Treng destinasjon for prisestimat' : 'Destination required for price quote') : ''}
              >
                {loadingPrice
                  ? (locale === 'no' ? 'Hentar prisestimat...' : 'Getting price quote...')
                  : (locale === 'no' ? 'Få prisestimat' : 'Get price quote')
                }
              </Button>

              {/* Price Quote Display */}
              {priceQuote && (
                <div className="mt-4 glass-yellow backdrop-blur-xl rounded-2xl p-6 depth-2 border-2 border-taxi-yellow/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-taxi-black/70 font-semibold">
                        {locale === 'no' ? 'Estimert pris' : 'Estimated price'}
                      </p>
                      <p className="text-3xl md:text-4xl font-bold text-taxi-black mt-1">
                        {priceQuote.price} kr
                      </p>
                      {priceQuote.tariff && (
                        <p className="text-xs text-taxi-black/60 mt-2">
                          {locale === 'no' ? 'Takst' : 'Tariff'}: {priceQuote.tariff}
                        </p>
                      )}
                    </div>
                    <div className="glass-strong rounded-full p-4 depth-2">
                      <svg className="w-10 h-10 text-taxi-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="h-px bg-taxi-black/20 my-3" />
                  <p className="text-xs text-taxi-black/70">
                    {locale === 'no'
                      ? 'Dette er eit estimat. Faktisk pris kan variere avhengig av trafikk og rute.'
                      : 'This is an estimate. Actual price may vary depending on traffic and route.'
                    }
                  </p>
                </div>
              )}

              {/* Price Error */}
              {priceError && (
                <div className="mt-4 glass-dark backdrop-blur-xl px-4 py-3 rounded-xl border border-red-500/50">
                  <p className="text-sm text-red-300">{priceError}</p>
                </div>
              )}
            </div>
          )}

          {/* Pickup Time */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2 text-white">
              {t('pickupTime')}
            </label>
            <input
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => {
                // Round selected time to nearest 5 minutes
                if (e.target.value) {
                  const selectedDate = new Date(e.target.value);
                  const rounded = roundToNearest5Minutes(selectedDate);
                  const timeStr = rounded.toISOString().slice(0, 16);
                  setPickupTime(timeStr);
                  // Check rules for this time
                  checkRules(rounded.toISOString());
                } else {
                  setPickupTime(e.target.value);
                  // Clear rules if no time selected
                  checkRules('');
                }
              }}
              min={getMinDateTime()}
              step="300"
              className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition"
            />
            <p className="text-xs text-taxi-light-grey/60 mt-2">{t('pickupTimeNote')}</p>

            {/* Rule Restrictions */}
            {hasRestrictions && ruleRestrictions.length > 0 && (
              <div className="mt-4 bg-red-900/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl">
                <p className="font-bold text-white mb-2">
                  {locale === 'no' ? '⚠️ Bestilling ikke mulig' : '⚠️ Booking not possible'}
                </p>
                {ruleRestrictions.map((rule, index) => (
                  <p key={index} className="text-sm mb-1">
                    {locale === 'no' ? rule.messageNo : rule.messageEn}
                  </p>
                ))}
              </div>
            )}

            {/* Rule Warnings */}
            {ruleWarnings.length > 0 && (
              <div className="mt-4 bg-yellow-900/20 border border-yellow-500/50 text-yellow-300 px-6 py-4 rounded-xl">
                <p className="font-bold text-white mb-2">
                  {locale === 'no' ? '⚠️ Viktig informasjon' : '⚠️ Important information'}
                </p>
                {ruleWarnings.map((rule, index) => (
                  <p key={index} className="text-sm mb-1">
                    {locale === 'no' ? rule.messageNo : rule.messageEn}
                  </p>
                ))}
              </div>
            )}

            {/* Rule Disclaimers */}
            {ruleDisclaimers.length > 0 && (
              <div className="mt-4 bg-blue-900/20 border border-blue-500/50 text-blue-300 px-6 py-4 rounded-xl">
                <p className="font-bold text-white mb-2">
                  {locale === 'no' ? 'ℹ️ Merk' : 'ℹ️ Note'}
                </p>
                {ruleDisclaimers.map((rule, index) => (
                  <p key={index} className="text-sm mb-1">
                    {locale === 'no' ? rule.messageNo : rule.messageEn}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* General Message to Driver */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2 text-white">
              {t('messageOptional')}
            </label>
            <textarea
              value={messageToCar}
              onChange={(e) => setMessageToCar(e.target.value)}
              rows={3}
              className="w-full px-4 py-4 text-base glass-strong backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-taxi-light-grey/50 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow smooth-transition resize-none"
              placeholder={t('messagePlaceholder')}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="glass-dark backdrop-blur-xl border border-red-500/50 text-red-300 px-6 py-4 rounded-2xl depth-2">
              <p className="font-bold text-white mb-1">{t('errorTitle')}</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full depth-glow hover-scale smooth-transition text-lg font-bold py-6"
            disabled={loading || hasRestrictions}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('processing')}
              </span>
            ) : (
              tCta('bookNow')
            )}
          </Button>

          <p className="text-xs text-center text-taxi-light-grey/70">
            {t('privacyNote')}
          </p>
        </form>
      </div>
    </div>
  );
}
