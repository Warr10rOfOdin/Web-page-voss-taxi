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
  const [clientNote, setClientNote] = useState('');
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
      const attributes: number[] = [];
      if (passengerCount === 2) {
        attributes.push(2); // 2 PERSONER attribute ID
      } else if (passengerCount === 3) {
        attributes.push(3); // 3 PERSONER attribute ID
      } else if (passengerCount === 4) {
        attributes.push(4); // 4 PERSONER attribute ID
      }

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
      const attributes: string[] = [];
      if (passengerCount === 2) {
        attributes.push('2 PERSONER');
      } else if (passengerCount === 3) {
        attributes.push('3 PERSONER');
      } else if (passengerCount === 4) {
        attributes.push('4 PERSONER');
      } else if (passengerCount === 5 || passengerCount === 6) {
        attributes.push('6 SETER');
      } else if (passengerCount === 7) {
        attributes.push('7 SETER');
      } else if (passengerCount === 8) {
        attributes.push('8 SETER');
      }

      // Prepare booking data for API
      const bookingData = {
        orderedBy: 'Website',
        messageToCar: messageToCar || undefined,
        pickupTime: pickupTime
          ? new Date(pickupTime).toISOString()
          : new Date(Date.now() + 15 * 60000).toISOString(),
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
          pickupTime: pickupTime
            ? new Date(pickupTime).toISOString()
            : new Date(Date.now() + 15 * 60000).toISOString(),
          clientNote: clientNote || undefined,
          clientNoteToCar: true,
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
    setClientNote('');
    setMessageToCar('');
    setPriceQuote(null);
    setPriceError(null);
    setSuccess(false);
    setBookRef(null);
  };

  // Get minimum datetime (now + 5 minutes)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  if (success && bookRef) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            ✅ {t('successTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-taxi-grey">{t('successMessage')}</p>
          <div className="bg-taxi-light-grey p-4 rounded-lg">
            <p className="text-sm text-taxi-grey mb-1">{t('bookingReference')}</p>
            <p className="text-2xl font-bold text-taxi-yellow">{bookRef}</p>
          </div>
          <p className="text-taxi-grey">{t('confirmationNote')}</p>
          <Button onClick={resetForm} variant="secondary">
            {t('bookAnother')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('name')} *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('phone')} *
              </label>
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
                className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                placeholder="+47 123 45 678"
              />
            </div>
          </div>

          {/* Passenger Count */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {locale === 'no' ? 'Antall passasjerer *' : 'Number of passengers *'}
            </label>
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-taxi-grey flex items-center">
                <svg className="w-4 h-4 text-taxi-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" />
                </svg>
                {t('pickupLocation')}
              </h4>
              <button
                type="button"
                onClick={getMyLocation}
                disabled={loadingLocation}
                className="text-xs font-medium text-taxi-yellow hover:text-taxi-black transition-colors flex items-center gap-1 disabled:opacity-50"
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
              }}
              label={t('street')}
              placeholder="Uttrågata 19"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('city')} *
                </label>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('postalCode')} *
                </label>
                <input
                  type="text"
                  value={fromPostalCode}
                  onChange={(e) => setFromPostalCode(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-taxi-grey flex items-center">
              <svg className="w-4 h-4 text-taxi-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('destination')}
              <span className="ml-2 text-xs text-taxi-grey font-normal">
                ({locale === 'no' ? 'valfritt' : 'optional'})
              </span>
            </h4>

            <AddressAutocomplete
              value={toStreet}
              onChange={setToStreet}
              onSelect={(address) => {
                setToStreet(address.street);
                setToCity(address.city);
                setToPostalCode(address.postalCode);
              }}
              label={t('street')}
              placeholder={t('optionalDestination')}
              required={false}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('city')}
                </label>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('postalCode')}
                </label>
                <input
                  type="text"
                  value={toPostalCode}
                  onChange={(e) => setToPostalCode(e.target.value)}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
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
                <div className="mt-3 bg-taxi-yellow/10 border-2 border-taxi-yellow rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-taxi-grey">
                        {locale === 'no' ? 'Estimert pris' : 'Estimated price'}
                      </p>
                      <p className="text-2xl font-bold text-taxi-black">
                        {priceQuote.price} kr
                      </p>
                      {priceQuote.tariff && (
                        <p className="text-xs text-taxi-grey mt-1">
                          {locale === 'no' ? 'Takst' : 'Tariff'}: {priceQuote.tariff}
                        </p>
                      )}
                    </div>
                    <svg className="w-12 h-12 text-taxi-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-taxi-grey mt-2">
                    {locale === 'no'
                      ? 'Dette er eit estimat. Faktisk pris kan variere avhengig av trafikk og rute.'
                      : 'This is an estimate. Actual price may vary depending on traffic and route.'
                    }
                  </p>
                </div>
              )}

              {/* Price Error */}
              {priceError && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="text-sm">{priceError}</p>
                </div>
              )}
            </div>
          )}

          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('pickupTime')}
            </label>
            <input
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              min={getMinDateTime()}
              className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
            />
            <p className="text-xs text-taxi-grey mt-1">{t('pickupTimeNote')}</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {locale === 'no' ? 'Notat (valfritt)' : 'Note (optional)'}
            </label>
            <textarea
              value={clientNote}
              onChange={(e) => setClientNote(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
              placeholder={locale === 'no' ? 'T.d. bagasje, spesielle ønskje...' : 'E.g. luggage, special requests...'}
            />
          </div>

          {/* General Message to Driver */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('messageOptional')}
            </label>
            <textarea
              value={messageToCar}
              onChange={(e) => setMessageToCar(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
              placeholder={t('messagePlaceholder')}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">{t('errorTitle')}</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? t('processing') : tCta('bookNow')}
          </Button>

          <p className="text-xs text-center text-taxi-grey">
            {t('privacyNote')}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
