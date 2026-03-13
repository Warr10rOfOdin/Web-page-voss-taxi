'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getStatusInfo, getStatusColorClass } from '@/lib/booking-status';

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
    <div className="bg-white/10 backdrop-blur-md border-2 border-taxi-yellow/30 rounded-2xl p-6 depth-3 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
        <span className="text-2xl">🔍</span>
        <span>{locale === 'no' ? 'Sjekk bestilling' : 'Check Booking'}</span>
      </h2>
      <p className="text-white/80 mb-6 text-sm">
        {locale === 'no'
          ? 'Skriv inn bestillingsreferansen din'
          : 'Enter your booking reference'}
      </p>

      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <input
            type="text"
            value={bookRef}
            onChange={(e) => setBookRef(e.target.value.toUpperCase())}
            placeholder={locale === 'no' ? 'T.d. VOSS123' : 'e.g., VOSS123'}
            className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 font-semibold tracking-wide focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-4 text-base font-bold"
          disabled={loading || !bookRef.trim()}
        >
          {loading
            ? locale === 'no'
              ? 'Sjekkar...'
              : 'Checking...'
            : locale === 'no'
            ? 'Sjekk'
            : 'Check'}
        </Button>
      </form>

      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {bookingInfo && (() => {
        const statusInfo = getStatusInfo(bookingInfo.status);
        const colorClass = getStatusColorClass(statusInfo.type);

        return (
          <div className={`mt-4 border rounded-lg p-3 space-y-2 ${colorClass}`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{statusInfo.icon}</span>
              <h3 className="text-base font-bold">
                {statusInfo.label[locale === 'no' ? 'no' : 'en']}
              </h3>
            </div>

            {/* Status Description - prominent for cancelled bookings */}
            {statusInfo.type === 'cancelled' && (
              <div className="mb-3 pb-2 border-b border-red-500/30">
                <p className="text-xs text-red-200 font-medium">
                  {statusInfo.description[locale === 'no' ? 'no' : 'en']}
                </p>
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/70">
                  {locale === 'no' ? 'Referanse:' : 'Reference:'}
                </span>
                <span className="font-bold text-taxi-yellow">{bookingInfo.bookRef}</span>
              </div>

              {bookingInfo.customerName && (
                <div className="flex justify-between">
                  <span className="text-white/70">
                    {locale === 'no' ? 'Namn:' : 'Name:'}
                  </span>
                  <span className="text-white/90">{bookingInfo.customerName}</span>
                </div>
              )}

              {bookingInfo.pickupTime && (
                <div className="flex justify-between">
                  <span className="text-white/70">
                    {locale === 'no' ? 'Tid:' : 'Time:'}
                  </span>
                  <span className="text-right text-white/90">
                    {new Date(bookingInfo.pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
              )}

              {bookingInfo.fromStreet && (
                <div>
                  <span className="text-white/70 block mb-1">
                    {locale === 'no' ? 'Henting:' : 'From:'}
                  </span>
                  <span className="text-sm text-white/90">
                    {bookingInfo.fromStreet}
                    {bookingInfo.fromCity && `, ${bookingInfo.fromCity}`}
                    {bookingInfo.fromPostalCode && ` ${bookingInfo.fromPostalCode}`}
                  </span>
                </div>
              )}

              {bookingInfo.toStreet && (
                <div>
                  <span className="text-white/70 block mb-1">
                    {locale === 'no' ? 'Til:' : 'To:'}
                  </span>
                  <span className="text-sm text-white/90">
                    {bookingInfo.toStreet}
                    {bookingInfo.toCity && `, ${bookingInfo.toCity}`}
                    {bookingInfo.toPostalCode && ` ${bookingInfo.toPostalCode}`}
                  </span>
                </div>
              )}

              {/* Detailed status information */}
              <div className="mt-2 pt-2 border-t border-white/20">
                <div className="flex justify-between items-start">
                  <span className="text-white/70">Status:</span>
                  <div className="text-right">
                    <div className="font-bold">
                      {statusInfo.label[locale === 'no' ? 'no' : 'en']}
                    </div>
                    <div className="text-[10px] text-white/60 mt-0.5">
                      {statusInfo.code}
                    </div>
                  </div>
                </div>
                {statusInfo.type !== 'cancelled' && (
                  <p className="text-[10px] text-white/60 mt-1">
                    {statusInfo.description[locale === 'no' ? 'no' : 'en']}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/20">
              <a
                href="tel:+4756511340"
                className="text-xs text-taxi-yellow hover:underline block text-center font-medium"
              >
                {locale === 'no' ? '📞 Ring oss' : '📞 Call us'}
              </a>
            </div>
          </div>
        );
      })()}

      <div className="mt-3 text-[10px] text-taxi-light-grey/50 text-center">
        {locale === 'no'
          ? 'Finn bestillingsreferansen i e-posten din'
          : 'Find your booking reference in your confirmation email'}
      </div>
    </div>
  );
}
