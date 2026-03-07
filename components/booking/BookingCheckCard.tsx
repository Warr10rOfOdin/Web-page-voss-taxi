'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface BookingCheckCardProps {
  locale: string;
}

export function BookingCheckCard({ locale }: BookingCheckCardProps) {
  const [bookRef, setBookRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!bookRef) {
      setError(locale === 'no' ? 'Skriv inn bookingkode' : 'Enter booking reference');
      return;
    }

    // Redirect to manage booking page with the reference
    window.location.href = `/${locale}/manage-booking?ref=${encodeURIComponent(bookRef)}`;
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-xl">
          {locale === 'no' ? 'Sjekk din booking' : 'Check Your Booking'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-taxi-grey">
          {locale === 'no'
            ? 'Har du allereie bestilt? Sjekk eller endre bookinga di her.'
            : 'Already booked? Check or manage your booking here.'}
        </p>

        <div>
          <label className="block text-sm font-medium mb-2">
            {locale === 'no' ? 'Bookingkode' : 'Booking Reference'}
          </label>
          <input
            type="text"
            value={bookRef}
            onChange={(e) => {
              setBookRef(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleCheck();
            }}
            placeholder="BDQ558"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
          />
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>

        <Button
          onClick={handleCheck}
          disabled={loading}
          className="w-full"
        >
          {loading
            ? (locale === 'no' ? 'Søkjer...' : 'Searching...')
            : (locale === 'no' ? 'Sjekk booking' : 'Check Booking')}
        </Button>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-taxi-grey">
            {locale === 'no'
              ? 'Du kan sjå bookingdetaljar og slette bookinga di (viss ingen taxi er tilvist enno).'
              : 'You can view booking details and delete your booking (if no taxi assigned yet).'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
