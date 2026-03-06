'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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
    },
  ]);

  const [messageToCar, setMessageToCar] = useState('');
  const [carGroupId, setCarGroupId] = useState(1); // Default to standard taxi
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookRef, setBookRef] = useState<string | null>(null);

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
    };
    setPassengers([...passengers, newPassenger]);
  };

  const removePassenger = (id: string) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id).map((p, idx) => ({ ...p, seqNo: idx + 1 })));
    }
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: string) => {
    setPassengers(
      passengers.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare booking data for API
      const bookingData = {
        orderedBy: 'Website',
        messageToCar: messageToCar || undefined,
        pickupTime: passengers[0].pickupTime
          ? new Date(passengers[0].pickupTime).toISOString()
          : new Date(Date.now() + 15 * 60000).toISOString(),
        carGroupId: carGroupId, // Vehicle type
        numberOfCars: 1, // Single car per booking
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
      },
    ]);
    setMessageToCar('');
    setCarGroupId(1);
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Passengers */}
          {passengers.map((passenger, index) => (
            <div
              key={passenger.id}
              className="border border-taxi-grey/30 rounded-lg p-6 space-y-4 relative"
            >
              {/* Passenger header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {locale === 'no' ? 'Passasjer' : 'Passenger'} {index + 1}
                </h3>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(passenger.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    {locale === 'no' ? 'Fjern' : 'Remove'}
                  </button>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('name')} *
                  </label>
                  <input
                    type="text"
                    value={passenger.clientName}
                    onChange={(e) => updatePassenger(passenger.id, 'clientName', e.target.value)}
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
                    value={passenger.tel}
                    onChange={(e) => updatePassenger(passenger.id, 'tel', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    placeholder="+47 123 45 678"
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-taxi-grey flex items-center">
                  <svg className="w-4 h-4 text-taxi-yellow mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" />
                  </svg>
                  {t('pickupLocation')}
                </h4>

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
                      {t('city')} *
                    </label>
                    <input
                      type="text"
                      value={passenger.fromCity}
                      onChange={(e) => updatePassenger(passenger.id, 'fromCity', e.target.value)}
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
                      value={passenger.fromPostalCode}
                      onChange={(e) => updatePassenger(passenger.id, 'fromPostalCode', e.target.value)}
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
                </h4>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('street')}
                  </label>
                  <input
                    type="text"
                    value={passenger.toStreet}
                    onChange={(e) => updatePassenger(passenger.id, 'toStreet', e.target.value)}
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
                      value={passenger.toCity}
                      onChange={(e) => updatePassenger(passenger.id, 'toCity', e.target.value)}
                      className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('postalCode')}
                    </label>
                    <input
                      type="text"
                      value={passenger.toPostalCode}
                      onChange={(e) => updatePassenger(passenger.id, 'toPostalCode', e.target.value)}
                      className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Pickup Time (only for first passenger) */}
              {index === 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('pickupTime')}
                  </label>
                  <input
                    type="datetime-local"
                    value={passenger.pickupTime}
                    onChange={(e) => updatePassenger(passenger.id, 'pickupTime', e.target.value)}
                    min={getMinDateTime()}
                    className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                  />
                  <p className="text-xs text-taxi-grey mt-1">{t('pickupTimeNote')}</p>
                </div>
              )}

              {/* Passenger Note */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {locale === 'no' ? 'Notat (valfritt)' : 'Note (optional)'}
                </label>
                <textarea
                  value={passenger.clientNote}
                  onChange={(e) => updatePassenger(passenger.id, 'clientNote', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                  placeholder={locale === 'no' ? 'T.d. bagasje, spesielle ønskje...' : 'E.g. luggage, special requests...'}
                />
              </div>
            </div>
          ))}

          {/* Add Passenger Button */}
          <button
            type="button"
            onClick={addPassenger}
            className="w-full py-3 border-2 border-dashed border-taxi-yellow rounded-lg text-taxi-yellow hover:bg-taxi-yellow/10 transition-colors font-medium"
          >
            + {locale === 'no' ? 'Legg til passasjer' : 'Add passenger'}
          </button>

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {locale === 'no' ? 'Kjøretøytype' : 'Vehicle Type'}
            </label>
            <select
              value={carGroupId}
              onChange={(e) => setCarGroupId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
            >
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
