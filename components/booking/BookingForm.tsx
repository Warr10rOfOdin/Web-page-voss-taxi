'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface BookingFormProps {
  locale: string;
}

interface TripAttribute {
  attributeCode: number;
  description: string;
  attributeType: number;
}

export function BookingForm({ locale }: BookingFormProps) {
  const t = useTranslations('booking');
  const tCta = useTranslations('cta');

  // Single passenger booking
  const [clientName, setClientName] = useState('');
  const [tel, setTel] = useState('');
  const [fromStreet, setFromStreet] = useState('');
  const [fromCity, setFromCity] = useState('Voss');
  const [fromPostalCode, setFromPostalCode] = useState('5700');
  const [toStreet, setToStreet] = useState('');
  const [toCity, setToCity] = useState('');
  const [toPostalCode, setToPostalCode] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  // Additional requirements
  const [passengerCount, setPassengerCount] = useState(1);
  const [hasChildren, setHasChildren] = useState(false);
  const [childAge, setChildAge] = useState('');
  const [skisCount, setSkisCount] = useState(0);
  const [baggageCount, setBaggageCount] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [additionalNote, setAdditionalNote] = useState('');

  // Trip attributes from API
  const [attributes, setAttributes] = useState<TripAttribute[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookRef, setBookRef] = useState<string | null>(null);

  // Fetch available trip attributes on mount
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await fetch('/api/booking/attributes');
        const data = await response.json();

        if (data.success && data.attributes) {
          setAttributes(data.attributes);
        }
      } catch (err) {
        console.error('Failed to fetch attributes:', err);
      } finally {
        setAttributesLoading(false);
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Build message to car
      const messages: string[] = [];

      // Add equipment info
      if (passengerCount > 1) messages.push(`${passengerCount} ${locale === 'no' ? 'passasjerar' : 'passengers'}`);
      if (hasChildren && childAge) messages.push(`${locale === 'no' ? 'Barn' : 'Child'} ${childAge} ${locale === 'no' ? 'år' : 'years'}`);
      if (skisCount > 0) messages.push(`${skisCount} ${locale === 'no' ? 'par ski' : 'pairs of skis'}`);
      if (baggageCount > 0) messages.push(`${baggageCount} ${locale === 'no' ? 'bagasje' : 'luggage'}`);
      if (additionalNote) messages.push(additionalNote);

      const messageToCar = messages.join(', ');

      // Prepare booking data using simple /api/book endpoint structure
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
        orderedBy: 'Website',
        attributes: selectedAttributes.length > 0 ? selectedAttributes.join(',') : undefined,
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
    setHasChildren(false);
    setChildAge('');
    setSkisCount(0);
    setBaggageCount(0);
    setSelectedAttributes([]);
    setAdditionalNote('');
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

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('street')} *
              </label>
              <input
                type="text"
                value={fromStreet}
                onChange={(e) => setFromStreet(e.target.value)}
                required
                className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                placeholder="Uttrågata 19"
              />
            </div>

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
            <h3 className="text-lg font-bold flex items-center">
              <svg className="w-5 h-5 text-taxi-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('destination')}
            </h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('street')}
              </label>
              <input
                type="text"
                value={toStreet}
                onChange={(e) => setToStreet(e.target.value)}
                className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                placeholder={t('optionalDestination')}
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

            {/* Skis and Baggage */}
            <div className="grid md:grid-cols-2 gap-4">
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

          {/* Trip Attributes from API */}
          {!attributesLoading && attributes.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                {locale === 'no' ? 'Spesielle behov (vel fleire)' : 'Special requirements (select multiple)'}
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {attributes.map(attr => (
                  <label
                    key={attr.attributeCode}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAttributes.includes(attr.attributeCode)
                        ? 'border-taxi-yellow bg-taxi-yellow/10'
                        : 'border-taxi-grey/30 hover:border-taxi-yellow/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAttributes.includes(attr.attributeCode)}
                      onChange={() => toggleAttribute(attr.attributeCode)}
                      className="w-4 h-4 text-taxi-yellow border-taxi-grey rounded focus:ring-taxi-yellow"
                    />
                    <span className="ml-2 text-sm">{attr.description}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

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
