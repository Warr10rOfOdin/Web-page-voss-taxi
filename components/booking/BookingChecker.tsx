'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface BookingCheckerProps {
  locale: string;
}

export function BookingChecker({ locale }: BookingCheckerProps) {
  const [bookRef, setBookRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookRef.trim()) {
      setError(locale === 'no' ? 'Skriv inn bestillingsreferanse' : 'Enter booking reference');
      return;
    }

    setLoading(true);
    setError(null);
    setBookingInfo(null);

    try {
      const response = await fetch(`/api/booking/status?bookRef=${encodeURIComponent(bookRef)}`);
      const data = await response.json();

      if (data.success && data.booking) {
        setBookingInfo(data.booking);
      } else {
        setError(
          locale === 'no'
            ? 'Fann ikkje bestilling. Sjekk referansenummeret ditt.'
            : 'Booking not found. Please check your reference number.'
        );
      }
    } catch (err) {
      console.error('Error checking booking:', err);
      setError(
        locale === 'no'
          ? 'Kunne ikkje sjekke bestilling. Prøv igjen seinare.'
          : 'Could not check booking. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-dark backdrop-blur-md border border-white/20 rounded-xl p-6 depth-2">
      <h2 className="text-2xl font-bold text-white mb-4">
        {locale === 'no' ? '🔍 Sjekk din bestilling' : '🔍 Check Your Booking'}
      </h2>
      <p className="text-taxi-light-grey/80 mb-6 text-sm">
        {locale === 'no'
          ? 'Skriv inn bestillingsreferansen din for å sjå status'
          : 'Enter your booking reference to check status'}
      </p>

      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <input
            type="text"
            value={bookRef}
            onChange={(e) => setBookRef(e.target.value.toUpperCase())}
            placeholder={locale === 'no' ? 'T.d. VOSS123' : 'e.g., VOSS123'}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading || !bookRef.trim()}
        >
          {loading
            ? locale === 'no'
              ? 'Sjekkar...'
              : 'Checking...'
            : locale === 'no'
            ? 'Sjekk bestilling'
            : 'Check Booking'}
        </Button>
      </form>

      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {bookingInfo && (
        <div className="mt-6 bg-green-900/20 border border-green-500/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold text-white">
              {locale === 'no' ? 'Bestilling funnen!' : 'Booking Found!'}
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/90">
              <span className="text-taxi-light-grey/70">
                {locale === 'no' ? 'Referanse:' : 'Reference:'}
              </span>
              <span className="font-bold text-taxi-yellow">{bookingInfo.bookRef}</span>
            </div>

            {bookingInfo.customerName && (
              <div className="flex justify-between text-white/90">
                <span className="text-taxi-light-grey/70">
                  {locale === 'no' ? 'Namn:' : 'Name:'}
                </span>
                <span>{bookingInfo.customerName}</span>
              </div>
            )}

            {bookingInfo.pickupTime && (
              <div className="flex justify-between text-white/90">
                <span className="text-taxi-light-grey/70">
                  {locale === 'no' ? 'Hentetid:' : 'Pickup Time:'}
                </span>
                <span>{new Date(bookingInfo.pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US')}</span>
              </div>
            )}

            {bookingInfo.fromStreet && (
              <div className="flex justify-between text-white/90">
                <span className="text-taxi-light-grey/70">
                  {locale === 'no' ? 'Henting:' : 'Pickup:'}
                </span>
                <span className="text-right">{bookingInfo.fromStreet}</span>
              </div>
            )}

            {bookingInfo.toStreet && (
              <div className="flex justify-between text-white/90">
                <span className="text-taxi-light-grey/70">
                  {locale === 'no' ? 'Levering:' : 'Destination:'}
                </span>
                <span className="text-right">{bookingInfo.toStreet}</span>
              </div>
            )}

            {bookingInfo.status && (
              <div className="flex justify-between text-white/90 mt-4 pt-3 border-t border-green-500/30">
                <span className="text-taxi-light-grey/70">
                  {locale === 'no' ? 'Status:' : 'Status:'}
                </span>
                <span className="font-bold text-green-400">{bookingInfo.status}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-green-500/30">
            <p className="text-xs text-taxi-light-grey/70 text-center">
              {locale === 'no'
                ? 'Spørsmål? Ring oss på +47 56 51 13 40'
                : 'Questions? Call us at +47 56 51 13 40'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-taxi-light-grey/60 text-center">
        {locale === 'no'
          ? 'Finn bestillingsreferansen i e-posten din'
          : 'Find your booking reference in your confirmation email'}
      </div>
    </div>
  );
}
