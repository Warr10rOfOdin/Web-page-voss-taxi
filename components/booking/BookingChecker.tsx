'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface BookingCheckerProps {
  locale: string;
}

export function BookingChecker({ locale }: BookingCheckerProps) {
  const [bookRef, setBookRef] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookRef.trim()) {
      setError(locale === 'no' ? 'Skriv inn bestillingsreferanse' : 'Enter booking reference');
      return;
    }

    if (!phoneNumber.trim()) {
      setError(locale === 'no' ? 'Skriv inn telefonnummer' : 'Enter phone number');
      return;
    }

    // Redirect to manage-booking page with both parameters
    window.location.href = `/${locale}/manage-booking?ref=${encodeURIComponent(bookRef)}&phone=${encodeURIComponent(phoneNumber)}`;
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
          <label className="block text-white/90 text-sm font-medium mb-2">
            {locale === 'no' ? 'Bookingkode' : 'Booking Reference'}
          </label>
          <input
            type="text"
            value={bookRef}
            onChange={(e) => {
              setBookRef(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder={locale === 'no' ? 'T.d. VOSS123' : 'e.g., VOSS123'}
            className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 font-semibold tracking-wide focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">
            {locale === 'no' ? 'Telefonnummer' : 'Phone Number'}
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setError(null);
            }}
            placeholder={locale === 'no' ? '12345678' : '12345678'}
            className="w-full px-5 py-4 text-base bg-white/95 border-2 border-white/30 rounded-xl text-taxi-black placeholder-gray-400 font-semibold focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow focus:bg-white smooth-transition shadow-sm"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-4 text-base font-bold"
          disabled={!bookRef.trim() || !phoneNumber.trim()}
        >
          {locale === 'no' ? 'Sjekk' : 'Check'}
        </Button>
      </form>

      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mt-3 text-[10px] text-white/70 text-center space-y-1">
        <p>
          {locale === 'no'
            ? 'Finn bestillingsreferansen i e-posten din'
            : 'Find your booking reference in your confirmation email'}
        </p>
        <p className="text-taxi-yellow/80">
          {locale === 'no'
            ? '🔒 For di tryggleik krev vi både bookingkode og telefonnummer'
            : '🔒 For your security, we require both booking reference and phone number'}
        </p>
      </div>
    </div>
  );
}
