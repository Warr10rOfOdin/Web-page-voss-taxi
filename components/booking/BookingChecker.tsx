'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ReceiptCard } from '@/components/receipts/ReceiptCard';
import { getStatusInfo } from '@/lib/booking-status';

interface BookingCheckerProps {
  locale: string;
}

interface BookingDetails {
  centralCode: string;
  internalNo: number;
  bookRef: string;
  orderedBy: string;
  bookedTimeStamp: string;
  pickupTime: string;
  tripStatus: string;
  licenseNo: string;
  vehicleNo: number;
  passengers: Array<{
    clientName: string;
    tel: string;
    fromStreet: string;
    fromCity: string;
    fromPostalCode: string;
    toStreet?: string;
    toCity?: string;
    toPostalCode?: string;
  }>;
}

export function BookingChecker({ locale }: BookingCheckerProps) {
  const [bookRef, setBookRef] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [emailingReceipt, setEmailingReceipt] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookRef.trim()) {
      setError(locale === 'no' ? 'Skriv inn bestillingsreferanse' : 'Enter booking reference');
      return;
    }

    if (!phoneNumber.trim()) {
      setError(locale === 'no' ? 'Skriv inn telefonnummer' : 'Enter phone number');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setBooking(null);

    try {
      const response = await fetch(
        `/api/booking/details?bookRef=${encodeURIComponent(bookRef)}&phoneNumber=${encodeURIComponent(phoneNumber)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch booking');
      }

      setBooking(data.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!bookRef) return;

    setDownloadingReceipt(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/booking/receipt/pdf?bookRef=${encodeURIComponent(bookRef)}&locale=${locale}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to download receipt');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voss-taxi-receipt-${bookRef}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(locale === 'no' ? 'Kvittering lasta ned!' : 'Receipt downloaded!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download receipt');
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const handlePrintReceipt = async () => {
    if (!bookRef) return;

    setError(null);

    try {
      // Fetch the PDF
      const response = await fetch(
        `/api/booking/receipt/pdf?bookRef=${encodeURIComponent(bookRef)}&locale=${locale}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load receipt');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Open in new window for printing
      const printWindow = window.open(url, '_blank');

      if (!printWindow) {
        // Popup blocked - provide alternative
        setError(
          locale === 'no'
            ? 'Kunne ikkje opne vindauge. Ver grei og tillat popup-vindauge eller last ned PDF i staden.'
            : 'Could not open window. Please allow popups or download the PDF instead.'
        );
        window.URL.revokeObjectURL(url);
        return;
      }

      // Set up print dialog when PDF loads
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          try {
            printWindow.print();
          } catch (printError) {
            console.error('Print error:', printError);
          }
        }, 250); // Small delay to ensure PDF is fully loaded
      });

      // Clean up the blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 5000); // Keep URL valid longer for slower connections

      setSuccess(locale === 'no' ? 'Print-dialog opna!' : 'Print dialog opened!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Print receipt error:', err);
      setError(err instanceof Error ? err.message : 'Failed to print receipt');
    }
  };

  const handleEmailReceipt = async () => {
    if (!bookRef || !receiptEmail) {
      setError(locale === 'no' ? 'Skriv inn e-postadresse' : 'Please enter email address');
      return;
    }

    setEmailingReceipt(true);
    setError(null);

    try {
      const response = await fetch('/api/booking/receipt/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookRef,
          email: receiptEmail,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send receipt');
      }

      setSuccess(data.message);
      setReceiptEmail('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send receipt');
    } finally {
      setEmailingReceipt(false);
    }
  };

  const statusInfo = booking ? getStatusInfo(booking.tripStatus) : null;
  const canGetReceipt = booking && statusInfo ? statusInfo.canGetReceipt === true : false;

  return (
    <div className="space-y-6">
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
            disabled={loading || !bookRef.trim() || !phoneNumber.trim()}
          >
            {loading
              ? (locale === 'no' ? 'Søkjer...' : 'Searching...')
              : (locale === 'no' ? 'Sjekk' : 'Check')}
          </Button>
        </form>

        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-900/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg text-sm">
            {success}
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

      {/* Receipt Card - Show for ALL bookings found */}
      {booking && (
        <ReceiptCard
          data={{
            bookRef: booking.bookRef,
            date: booking.bookedTimeStamp,
            customerName: booking.passengers[0]?.clientName || '',
            customerPhone: booking.passengers[0]?.tel,
            pickupAddress: `${booking.passengers[0]?.fromStreet}, ${booking.passengers[0]?.fromPostalCode} ${booking.passengers[0]?.fromCity}`,
            dropoffAddress: booking.passengers[0]?.toStreet
              ? `${booking.passengers[0].toStreet}, ${booking.passengers[0].toPostalCode} ${booking.passengers[0].toCity}`
              : locale === 'no' ? 'Ikkje spesifisert' : 'Not specified',
            pickupTime: booking.pickupTime,
            licenseNumber: booking.licenseNo || undefined,
            tripStatus: booking.tripStatus,
          }}
          locale={locale === 'no' ? 'no' : 'en'}
        />
      )}

      {/* Status Info Card - Show when booking found */}
      {booking && (
        <div className="bg-white/10 backdrop-blur-md border-2 border-taxi-yellow/30 rounded-2xl p-6 depth-3 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{statusInfo?.icon}</span>
              <span>{statusInfo?.label[locale === 'no' ? 'no' : 'en']}</span>
            </h3>

            <div className="pt-3 border-t border-white/20">
              <p className="text-sm text-white/80">
                {statusInfo?.description[locale === 'no' ? 'no' : 'en']}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`/${locale}/manage-booking?ref=${encodeURIComponent(bookRef)}&phone=${encodeURIComponent(phoneNumber)}`}
                className="text-sm text-taxi-yellow hover:underline block text-center font-medium"
              >
                {locale === 'no' ? '📋 Handter bestilling' : '📋 Manage Booking'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Action Buttons - Only for completed trips */}
      {booking && canGetReceipt && (
        <div className="bg-white/10 backdrop-blur-md border-2 border-taxi-yellow/30 rounded-2xl p-6 depth-3 shadow-xl space-y-4">
          <h4 className="font-bold text-lg text-white">
            {locale === 'no' ? '📥 Last ned eller send kvittering' : '📥 Download or Send Receipt'}
          </h4>

          {/* Download and Print Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleDownloadReceipt}
              disabled={downloadingReceipt}
              className="bg-taxi-yellow hover:bg-taxi-yellow/90 text-taxi-black"
            >
              {downloadingReceipt
                ? (locale === 'no' ? 'Lastar...' : 'Loading...')
                : (locale === 'no' ? '⬇️ Last ned PDF' : '⬇️ Download PDF')}
            </Button>
            <Button
              onClick={handlePrintReceipt}
              className="bg-white hover:bg-white/90 text-taxi-black"
            >
              {locale === 'no' ? '🖨️ Skriv ut' : '🖨️ Print'}
            </Button>
          </div>

          {/* Email Receipt Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              {locale === 'no' ? 'Send kvittering på e-post' : 'Email Receipt'}
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={receiptEmail}
                onChange={(e) => setReceiptEmail(e.target.value)}
                placeholder={locale === 'no' ? 'din@epost.no' : 'your@email.com'}
                className="flex-1 px-4 py-2 border-2 border-white/30 rounded-lg bg-white/95 text-taxi-black placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow"
              />
              <Button
                onClick={handleEmailReceipt}
                disabled={emailingReceipt || !receiptEmail}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {emailingReceipt
                  ? (locale === 'no' ? 'Sender...' : 'Sending...')
                  : (locale === 'no' ? '📧 Send' : '📧 Send')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
