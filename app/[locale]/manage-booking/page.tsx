'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getStatusInfo, getStatusColorClass } from '@/lib/booking-status';
import { ReceiptCard } from '@/components/receipts/ReceiptCard';

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

function ManageBookingContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();

  const [bookRef, setBookRef] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [emailingReceipt, setEmailingReceipt] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState('');

  // Auto-search if ref and phone are in URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    const phone = searchParams.get('phone');

    if (ref) {
      setBookRef(ref.toUpperCase());
    }

    if (phone) {
      setPhoneNumber(phone);
    }

    // Auto-trigger search if both params are present
    if (ref && phone) {
      setTimeout(() => {
        const searchButton = document.querySelector('[data-search-button]') as HTMLButtonElement;
        searchButton?.click();
      }, 100);
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!bookRef) {
      setError(locale === 'no' ? 'Skriv inn ein bookingkode' : 'Please enter a booking reference');
      return;
    }

    if (!phoneNumber) {
      setError(locale === 'no' ? 'Skriv inn telefonnummer' : 'Please enter phone number');
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

  const handleDelete = async () => {
    if (!bookRef || !phoneNumber || !booking) return;

    const confirmMsg = locale === 'no'
      ? 'Er du sikker på at du vil slette denne bookinga?'
      : 'Are you sure you want to delete this booking?';

    if (!confirm(confirmMsg)) return;

    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/booking/delete?bookRef=${encodeURIComponent(bookRef)}&phoneNumber=${encodeURIComponent(phoneNumber)}`,
        {
          method: 'DELETE',
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete booking');
      }

      setSuccess(locale === 'no' ? 'Booking sletta!' : 'Booking deleted successfully!');
      setBooking(null);
      setBookRef('');
      setPhoneNumber('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  // Get status info and check capabilities based on current status
  const statusInfo = booking ? getStatusInfo(booking.tripStatus) : null;
  const canDelete = booking && statusInfo ? statusInfo.canDelete : false;
  const canGetReceipt = booking && statusInfo ? statusInfo.canGetReceipt === true : false;

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download receipt');
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const handlePrintReceipt = async () => {
    if (!bookRef) return;

    // Open print window before awaiting network request to avoid popup blocking
    const printWindow = window.open('', '_blank');

    try {
      const response = await fetch(
        `/api/booking/receipt/pdf?bookRef=${encodeURIComponent(bookRef)}&locale=${locale}`
      );

      if (!response.ok) {
        const data = await response.json();
        printWindow?.close();
        throw new Error(data.error || 'Failed to load receipt');
      }

      // Load PDF into the already-open window
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      if (printWindow) {
        printWindow.location.href = url;
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      // Clean up after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send receipt');
    } finally {
      setEmailingReceipt(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {locale === 'no' ? 'Sjekk din booking' : 'Check Your Booking'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'no' ? 'Bookingkode' : 'Booking Reference'}
              </label>
              <input
                type="text"
                value={bookRef}
                onChange={(e) => setBookRef(e.target.value.toUpperCase())}
                placeholder="BDQ558"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'no' ? 'Telefonnummer' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={locale === 'no' ? '12345678' : '12345678'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {locale === 'no'
                  ? '🔒 For di tryggleik krev vi både bookingkode og telefonnummer'
                  : '🔒 For your security, we require both booking reference and phone number'}
              </p>
            </div>

            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full"
              data-search-button
            >
              {loading
                ? (locale === 'no' ? 'Søkjer...' : 'Searching...')
                : (locale === 'no' ? 'Søk' : 'Search')}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {success}
            </div>
          )}

          {/* Booking Details */}
          {booking && (
            <div className="space-y-6 border-t pt-6">
              <div>
                <h3 className="text-lg font-bold mb-4">
                  {locale === 'no' ? 'Bookingdetaljar' : 'Booking Details'}
                </h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">{locale === 'no' ? 'Bookingkode:' : 'Reference:'}</span>
                    <span>{booking.bookRef}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">{locale === 'no' ? 'Status:' : 'Status:'}</span>
                    <div className="text-right">
                      {(() => {
                        const currentStatusInfo = getStatusInfo(booking.tripStatus);
                        return (
                          <div>
                            <div className="flex items-center justify-end gap-1">
                              <span>{currentStatusInfo.icon}</span>
                              <span className="font-semibold">{currentStatusInfo.label[locale === 'no' ? 'no' : 'en']}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {currentStatusInfo.description[locale === 'no' ? 'no' : 'en']}
                            </div>
                            {/* Show løyve (license) for M/I statuses (accepted by car) */}
                            {currentStatusInfo.showLoyve && booking.licenseNo && (
                              <div className="text-xs font-semibold text-taxi-yellow mt-1">
                                {locale === 'no' ? '🚕 Løyve:' : '🚕 Taxi:'} {booking.licenseNo}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">{locale === 'no' ? 'Hentingstid:' : 'Pickup Time:'}</span>
                    <span>{new Date(booking.pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US')}</span>
                  </div>

                  {booking.passengers && booking.passengers[0] && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">{locale === 'no' ? 'Namn:' : 'Name:'}</span>
                        <span>{booking.passengers[0].clientName}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">{locale === 'no' ? 'Telefon:' : 'Phone:'}</span>
                        <span>{booking.passengers[0].tel}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">{locale === 'no' ? 'Frå:' : 'From:'}</span>
                        <span>
                          {booking.passengers[0].fromStreet}, {booking.passengers[0].fromPostalCode} {booking.passengers[0].fromCity}
                        </span>
                      </div>

                      {booking.passengers[0].toStreet && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">{locale === 'no' ? 'Til:' : 'To:'}</span>
                          <span>
                            {booking.passengers[0].toStreet}, {booking.passengers[0].toPostalCode} {booking.passengers[0].toCity}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Receipt Section - Only for completed trips */}
              {canGetReceipt && (
                <div className="space-y-6 border-t pt-6">
                  {/* Receipt Card Preview */}
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
                      vehicleNumber: booking.vehicleNo > 0 ? String(booking.vehicleNo) : undefined,
                      licenseNumber: booking.licenseNo || undefined,
                      tripStatus: booking.tripStatus,
                    }}
                    locale={locale === 'no' ? 'no' : 'en'}
                  />

                  {/* Receipt Action Buttons */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">
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
                        className="bg-taxi-black hover:bg-taxi-black/90 text-white"
                      >
                        {locale === 'no' ? '🖨️ Skriv ut' : '🖨️ Print'}
                      </Button>
                    </div>

                    {/* Email Receipt Section */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        {locale === 'no' ? 'Send kvittering på e-post' : 'Email Receipt'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={receiptEmail}
                          onChange={(e) => setReceiptEmail(e.target.value)}
                          placeholder={locale === 'no' ? 'din@epost.no' : 'your@email.com'}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
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
                </div>
              )}

              {/* Delete Button */}
              {canDelete && (
                <div className="border-t pt-6">
                  <Button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleting
                      ? (locale === 'no' ? 'Slettar...' : 'Deleting...')
                      : (locale === 'no' ? 'Slett booking' : 'Delete Booking')}
                  </Button>
                </div>
              )}

              {!canDelete && !canGetReceipt && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  {locale === 'no'
                    ? 'Taxi har akseptert turen. Kontakt oss på telefon om du vil gjere endringar.'
                    : 'Taxi has accepted the trip. Please contact us by phone for changes.'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ManageBookingPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {locale === 'no' ? 'Sjekk din booking' : 'Check Your Booking'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-taxi-grey">
              {locale === 'no' ? 'Lastar...' : 'Loading...'}
            </p>
          </CardContent>
        </Card>
      </div>
    }>
      <ManageBookingContent locale={locale} />
    </Suspense>
  );
}
