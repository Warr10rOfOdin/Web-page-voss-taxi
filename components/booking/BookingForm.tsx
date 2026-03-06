'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';

interface BookingFormProps {
  locale: string;
}

interface Passenger {
  id: string;
  seqNo: number;
  clientName: string;
  tel: string;
  fromStreet: string;
  fromCity: string;
  fromPostalCode: string;
  toStreet: string;
  toCity: string;
  toPostalCode: string;
  pickupTime: string;
  clientNote: string;
  childAge?: string; // Optional child age for automatic seat selection
}

export function BookingForm({ locale }: BookingFormProps) {
  const t = useTranslations('booking');
  const tCta = useTranslations('cta');

  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: '1',
      seqNo: 1,
      clientName: '',
      tel: '',
      fromStreet: '',
      fromCity: 'Voss',
      fromPostalCode: '5700',
      toStreet: '',
      toCity: '',
      toPostalCode: '',
      pickupTime: '',
      clientNote: '',
      childAge: '',
    },
  ]);

  const [messageToCar, setMessageToCar] = useState('');
  const [carGroupId, setCarGroupId] = useState<number>(0); // No default - require explicit selection
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookRef, setBookRef] = useState<string | null>(null);

  // Get current GPS location and reverse geocode to address
  const getMyLocation = async (passengerId: string) => {
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

      // Update passenger location fields
      updatePassenger(passengerId, 'fromStreet', address.road || address.suburb || '');
      updatePassenger(passengerId, 'fromCity', address.town || address.city || address.village || 'Voss');
      updatePassenger(passengerId, 'fromPostalCode', address.postcode || '5700');

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

  const addPassenger = () => {
    const newPassenger: Passenger = {
      id: Date.now().toString(),
      seqNo: passengers.length + 1,
      clientName: '',
      tel: '',
      fromStreet: passengers[0].fromStreet,
      fromCity: passengers[0].fromCity,
      fromPostalCode: passengers[0].fromPostalCode,
      toStreet: passengers[0].toStreet,
      toCity: passengers[0].toCity,
      toPostalCode: passengers[0].toPostalCode,
      pickupTime: passengers[0].pickupTime,
      clientNote: '',
      childAge: '',
    };

    fetchAttributes();
  }, []);

  const toggleAttribute = (code: number) => {
    setSelectedAttributes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  // Calculate attributes automatically based on form inputs
  const calculateAttributes = (): string[] => {
    const attributes: string[] = [];
    const passengerCount = passengers.length;

    // Auto-select seating capacity based on passenger count
    if (passengerCount === 2) {
      attributes.push('2 PERSONER');
    } else if (passengerCount === 3) {
      attributes.push('3 PERSONER');
    } else if (passengerCount === 4) {
      attributes.push('4 PERSONER');
    } else if (passengerCount >= 5 && passengerCount <= 6) {
      attributes.push('6 SETER');
    } else if (passengerCount === 7) {
      attributes.push('7 SETER');
    } else if (passengerCount === 8) {
      attributes.push('8 SETER');
    }
    // Note: 9+ passengers must call - not available for online booking

    // Auto-select child seats based on child ages
    passengers.forEach(passenger => {
      if (passenger.childAge) {
        const age = parseInt(passenger.childAge);
        if (!isNaN(age)) {
          if (age <= 1) {
            attributes.push('BARNESTOL 0-1ÅR/0-13KG');
          } else if (age >= 2 && age <= 4) {
            attributes.push('BARNESTOL 1-4ÅR/9-18KG');
          } else if (age >= 5 && age <= 10) {
            attributes.push('BARNESTOL 4-10ÅR/15-25KG');
          }
        }
      }
    });

    return attributes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate vehicle type is selected
    if (carGroupId === 0) {
      setError(locale === 'no' ? 'Velg en kjøretøytype' : 'Please select a vehicle type');
      setLoading(false);
      return;
    }

    try {
      // Calculate attributes automatically based on form data
      const attributes = calculateAttributes();

      // Prepare booking data for API
      const bookingData = {
        fromStreet,
        fromCity,
        fromPostalCode,
        toStreet: toStreet || undefined,
        toCity: toCity || undefined,
        toPostalCode: toPostalCode || undefined,
        customerName: clientName,
        tel,
        messageToCar: messageToCar || undefined,
        pickupTime: pickupTime
          ? new Date(pickupTime).toISOString()
          : new Date(Date.now() + 15 * 60000).toISOString(),
        carGroupId: carGroupId, // Vehicle type
        numberOfCars: 1, // Single car per booking
        attributes: attributes.length > 0 ? attributes : undefined, // Auto-selected attributes
        passengers: passengers.map(p => ({
          seqNo: p.seqNo,
          clientName: p.clientName,
          tel: p.tel,
          fromStreet: p.fromStreet,
          fromCity: p.fromCity,
          fromPostalCode: p.fromPostalCode,
          toStreet: p.toStreet || undefined,
          toCity: p.toCity || undefined,
          toPostalCode: p.toPostalCode || undefined,
          pickupTime: p.pickupTime
            ? new Date(p.pickupTime).toISOString()
            : passengers[0].pickupTime
              ? new Date(passengers[0].pickupTime).toISOString()
              : new Date(Date.now() + 15 * 60000).toISOString(),
          clientNote: p.clientNote || undefined,
          clientNoteToCar: true,
        })),
      };

      const response = await fetch('/api/booking/simple', {
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

      // Send SMS confirmation (non-blocking - don't fail booking if SMS fails)
      try {
        const pickupTimeFormatted = passengers[0].pickupTime
          ? new Date(passengers[0].pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US')
          : (locale === 'no' ? 'Snarast mogleg' : 'As soon as possible');

        await fetch('/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: passengers[0].tel,
            bookRef: data.bookRef,
            pickupTime: pickupTimeFormatted,
            from: `${passengers[0].fromStreet}, ${passengers[0].fromCity}`,
          }),
        });
      } catch (smsError) {
        // SMS failure doesn't affect booking success
        console.error('SMS send failed:', smsError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPassengers([
      {
        id: '1',
        seqNo: 1,
        clientName: '',
        tel: '',
        fromStreet: '',
        fromCity: 'Voss',
        fromPostalCode: '5700',
        toStreet: '',
        toCity: '',
        toPostalCode: '',
        pickupTime: '',
        clientNote: '',
        childAge: '',
      },
    ]);
    setMessageToCar('');
    setCarGroupId(0);
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
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
              {locale === 'no' ? 'Kontaktinformasjon' : 'Contact Information'}
            </h3>
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
          </div>

          {/* Pickup Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center">
              <svg className="w-5 h-5 text-taxi-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              {t('pickupLocation')}
            </h3>

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
                    onClick={() => getMyLocation(passenger.id)}
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('street')} *
                  </label>
                  <input
                    type="text"
                    value={passenger.fromStreet}
                    onChange={(e) => updatePassenger(passenger.id, 'fromStreet', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    placeholder="Uttrågata 19"
                  />
                </div>

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

          {/* Passenger and Equipment Details */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-bold">
              {locale === 'no' ? 'Passasjerar og utstyr' : 'Passengers and Equipment'}
            </h3>

            {/* Number of Passengers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {locale === 'no' ? 'Antal passasjerar' : 'Number of passengers'}
                </label>
                <select
                  value={passengerCount}
                  onChange={(e) => {
                    setPassengerCount(parseInt(e.target.value));
                    if (parseInt(e.target.value) === 1) setHasChildren(false);
                  }}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Children checkbox */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasChildren}
                    onChange={(e) => {
                      setHasChildren(e.target.checked);
                      if (!e.target.checked) setChildAge('');
                    }}
                    className="w-5 h-5 text-taxi-yellow border-taxi-grey rounded focus:ring-taxi-yellow"
                  />
                  <span className="ml-2 text-sm font-medium">
                    {locale === 'no' ? 'Med barn' : 'With children'}
                  </span>
                </label>
              </div>
            </div>

            {/* Child Age (conditional) */}
            {hasChildren && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {locale === 'no' ? 'Alder på barn' : 'Age of child'}
                </label>
                <input
                  type="text"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                  placeholder={locale === 'no' ? 'T.d. 5 år' : 'E.g. 5 years'}
                />
              </div>
            )}

              {/* Child Seat (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {locale === 'no' ? 'Alder på barn (valfritt)' : 'Child age (optional)'}
                </label>
                <input
                  type="number"
                  value={passenger.childAge || ''}
                  onChange={(e) => updatePassenger(passenger.id, 'childAge', e.target.value)}
                  min="0"
                  max="12"
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                  placeholder={locale === 'no' ? 'Alder (0-12 år)' : 'Age (0-12 years)'}
                />
                <p className="text-xs text-taxi-grey mt-1">
                  {locale === 'no'
                    ? 'Fyll ut om du reiser med barn som treng barnesete (0-10 år)'
                    : 'Fill in if traveling with a child who needs a car seat (0-10 years)'}
                </p>
              </div>

              {/* Passenger Note */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {locale === 'no' ? 'Antal par ski' : 'Number of ski pairs'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={skisCount}
                  onChange={(e) => setSkisCount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {locale === 'no' ? 'Antal bagasje' : 'Amount of baggage'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={baggageCount}
                  onChange={(e) => setBaggageCount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Add Passenger Button */}
          {passengers.length < 8 ? (
            <button
              type="button"
              onClick={addPassenger}
              className="w-full py-3 border-2 border-dashed border-taxi-yellow rounded-lg text-taxi-yellow hover:bg-taxi-yellow/10 transition-colors font-medium"
            >
              + {locale === 'no' ? 'Legg til passasjer' : 'Add passenger'}
            </button>
          ) : (
            <div className="w-full py-3 border-2 border-dashed border-taxi-grey/30 rounded-lg text-taxi-grey text-center">
              <p className="font-medium">
                {locale === 'no' ? 'Maksimalt 8 passasjerer for nettbestilling' : 'Maximum 8 passengers for online booking'}
              </p>
              <p className="text-sm mt-1">
                {locale === 'no' ? 'For større grupper, ring oss på 56 51 07 00' : 'For larger groups, call us at 56 51 07 00'}
              </p>
            </div>
          )}

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {locale === 'no' ? 'Kjøretøytype *' : 'Vehicle Type *'}
            </label>
            <select
              value={carGroupId}
              onChange={(e) => setCarGroupId(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
            >
              <option value={0} disabled>
                {locale === 'no' ? '-- Velg kjøretøytype --' : '-- Select vehicle type --'}
              </option>
              <option value={1}>
                {locale === 'no' ? 'Standard Taxi (1-4 personer)' : 'Standard Taxi (1-4 people)'}
              </option>
              <option value={2}>
                {locale === 'no' ? 'Stor Taxi (5-6 personer)' : 'Large Taxi (5-6 people)'}
              </option>
              <option value={3}>
                {locale === 'no' ? 'Minibuss (7-8 personer)' : 'Minibus (7-8 people)'}
              </option>
            </select>
            <p className="text-xs text-taxi-grey mt-1">
              {locale === 'no'
                ? 'Velg kjøretøytype basert på antall passasjerer og bagasje'
                : 'Select vehicle type based on number of passengers and luggage'}
            </p>
          </div>

          {/* Additional Note */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {locale === 'no' ? 'Tilleggsnotat (valfritt)' : 'Additional note (optional)'}
            </label>
            <textarea
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
              placeholder={locale === 'no' ? 'Andre ønskje eller informasjon...' : 'Other requests or information...'}
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
