'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface BookingFormProps {
  locale: string;
}

interface BookingFormData {
  fromStreet: string;
  fromCity: string;
  fromPostalCode: string;
  toStreet: string;
  toCity: string;
  toPostalCode: string;
  customerName: string;
  tel: string;
  messageToCar: string;
  pickupTime: string;
}

export function BookingForm({ locale }: BookingFormProps) {
  const t = useTranslations('booking');
  const tCta = useTranslations('cta');

  const [formData, setFormData] = useState<BookingFormData>({
    fromStreet: '',
    fromCity: 'Voss',
    fromPostalCode: '5700',
    toStreet: '',
    toCity: '',
    toPostalCode: '',
    customerName: '',
    tel: '',
    messageToCar: '',
    pickupTime: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookRef, setBookRef] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/booking/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pickupTime: formData.pickupTime
            ? new Date(formData.pickupTime).toISOString()
            : new Date(Date.now() + 15 * 60000).toISOString(), // Default: 15 mins from now
          orderedBy: 'Website',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Booking failed');
      }

      setSuccess(true);
      setBookRef(data.bookRef);

      // Reset form
      setFormData({
        fromStreet: '',
        fromCity: 'Voss',
        fromPostalCode: '5700',
        toStreet: '',
        toCity: '',
        toPostalCode: '',
        customerName: '',
        tel: '',
        messageToCar: '',
        pickupTime: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
          <Button
            onClick={() => {
              setSuccess(false);
              setBookRef(null);
            }}
            variant="secondary"
          >
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
          {/* Pickup Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center">
              <svg
                className="w-5 h-5 text-taxi-yellow mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
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
                name="fromStreet"
                value={formData.fromStreet}
                onChange={handleChange}
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
                  name="fromCity"
                  value={formData.fromCity}
                  onChange={handleChange}
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
                  name="fromPostalCode"
                  value={formData.fromPostalCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Destination Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center">
              <svg
                className="w-5 h-5 text-taxi-yellow mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {t('destination')}
            </h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('street')}
              </label>
              <input
                type="text"
                name="toStreet"
                value={formData.toStreet}
                onChange={handleChange}
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
                  name="toCity"
                  value={formData.toCity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t('postalCode')}
                </label>
                <input
                  type="text"
                  name="toPostalCode"
                  value={formData.toPostalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t('contactInfo')}</h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('name')} *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
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
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                placeholder="+47 123 45 678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('pickupTime')}
              </label>
              <input
                type="datetime-local"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                min={getMinDateTime()}
                className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
              />
              <p className="text-xs text-taxi-grey mt-1">{t('pickupTimeNote')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('messageOptional')}
              </label>
              <textarea
                name="messageToCar"
                value={formData.messageToCar}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-taxi-grey rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                placeholder={t('messagePlaceholder')}
              />
            </div>
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
