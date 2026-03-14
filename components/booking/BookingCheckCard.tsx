'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getStatusInfo } from '@/lib/booking-status';
import { ReceiptCard } from '@/components/receipts/ReceiptCard';

interface BookingCheckCardProps {
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

interface ReceiptData {
  bookRef: string;
  receiptNo: number;
  licenseNo: string;
  driverId: number;
  taxiAccountNo: string;
  maxPrice: number;
  originalMaxPrice: number;
  total: number;
  sceduledPickup: string;
  startDateTime: string;
  endDateTime: string;
  bookeDateTime: string;
  km: number;
  fromAddress: string;
  toAddress: string;
  fixedPrice: string;
  vatPercentage: number;
  vat: number;
  vatBasis: number;
  vatRegistrationNo: string;
}

export function BookingCheckCard({ locale }: BookingCheckCardProps) {
  const [bookRef, setBookRef] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [emailingReceipt, setEmailingReceipt] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState('');

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
    setReceiptData(null);

    try {
      const response = await fetch(
        `/api/booking/details?bookRef=${encodeURIComponent(bookRef)}&phoneNumber=${encodeURIComponent(phoneNumber)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch booking');
      }

      setBooking(data.booking);

      // Also try to fetch receipt data if available
      try {
        const receiptResponse = await fetch(
          `/api/booking/receipt?bookRef=${encodeURIComponent(bookRef)}`
        );

        if (receiptResponse.ok && receiptResponse.status !== 204) {
          const receipt = await receiptResponse.json();
          setReceiptData(receipt);
        }
      } catch (receiptErr) {
        // Don't show error for receipt - it may not be available yet
      }
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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      if (printWindow) {
        printWindow.location.href = url;
        printWindow.onload = () => {
          printWindow.print();
        };
      }

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

  // Get status info and check capabilities
  const statusInfo = booking ? getStatusInfo(booking.tripStatus) : null;
  const canDelete = booking && statusInfo ? statusInfo.canDelete : false;
  const canGetReceipt = booking && statusInfo ? statusInfo.canGetReceipt === true : false;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-xl">
          {locale === 'no' ? 'Sjekk din booking' : 'Check Your Booking'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!booking ? (
          <>
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
                  if (e.key === 'Enter') handleSearch();
                }}
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
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                placeholder={locale === 'no' ? '12345678' : '12345678'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {locale === 'no'
                  ? '🔒 For di tryggleik krev vi både bookingkode og telefonnummer'
                  : '🔒 For your security, we require both booking reference and phone number'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full"
            >
              {loading
                ? (locale === 'no' ? 'Søkjer...' : 'Searching...')
                : (locale === 'no' ? 'Søk' : 'Search')}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-taxi-grey">
                {locale === 'no'
                  ? 'Du kan sjå bookingdetaljar og slette bookinga di (viss ingen taxi er tilvist enno).'
                  : 'You can view booking details and delete your booking (if no taxi assigned yet).'}
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                {success}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold mb-3">
                {locale === 'no' ? 'Bookingdetaljar' : 'Booking Details'}
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{locale === 'no' ? 'Bookingkode:' : 'Reference:'}</span>
                  <span>{booking.bookRef}</span>
                </div>

                <div className="flex justify-between items-start">
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

                <div className="flex justify-between">
                  <span className="font-medium">{locale === 'no' ? 'Hentingstid:' : 'Pickup Time:'}</span>
                  <span>{new Date(booking.pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US')}</span>
                </div>

                {booking.passengers && booking.passengers[0] && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">{locale === 'no' ? 'Namn:' : 'Name:'}</span>
                      <span>{booking.passengers[0].clientName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">{locale === 'no' ? 'Frå:' : 'From:'}</span>
                      <span className="text-right">
                        {booking.passengers[0].fromStreet}, {booking.passengers[0].fromPostalCode} {booking.passengers[0].fromCity}
                      </span>
                    </div>

                    {booking.passengers[0].toStreet && (
                      <div className="flex justify-between">
                        <span className="font-medium">{locale === 'no' ? 'Til:' : 'To:'}</span>
                        <span className="text-right">
                          {booking.passengers[0].toStreet}, {booking.passengers[0].toPostalCode} {booking.passengers[0].toCity}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Receipt Section */}
            {canGetReceipt && (
              <div className="space-y-4 border-t pt-4">
                <ReceiptCard
                  data={{
                    bookRef: booking.bookRef,
                    date: booking.bookedTimeStamp,
                    customerName: booking.passengers[0]?.clientName || '',
                    customerPhone: booking.passengers[0]?.tel,
                    pickupAddress: receiptData?.fromAddress || `${booking.passengers[0]?.fromStreet || ''}, ${booking.passengers[0]?.fromPostalCode || ''} ${booking.passengers[0]?.fromCity || ''}`.trim(),
                    dropoffAddress: receiptData?.toAddress || (booking.passengers[0]?.toStreet
                      ? `${booking.passengers[0].toStreet}, ${booking.passengers[0].toPostalCode || ''} ${booking.passengers[0].toCity || ''}`.trim()
                      : locale === 'no' ? 'Ikkje spesifisert' : 'Not specified'),
                    pickupTime: receiptData?.startDateTime || booking.pickupTime,
                    dropoffTime: receiptData?.endDateTime,
                    distance: receiptData?.km,
                    duration: receiptData ? Math.round((new Date(receiptData.endDateTime).getTime() - new Date(receiptData.startDateTime).getTime()) / 60000) : undefined,
                    licenseNumber: receiptData?.licenseNo || booking.licenseNo || undefined,
                    driverName: undefined,
                    tariff: undefined,
                    price: receiptData?.total,
                    vat: receiptData?.vat,
                    paymentMethod: undefined,
                    tripStatus: booking.tripStatus,
                  }}
                  locale={locale === 'no' ? 'no' : 'en'}
                />

                <div className="space-y-3">
                  <h4 className="font-bold text-sm">
                    {locale === 'no' ? '📥 Kvittering' : '📥 Receipt'}
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleDownloadReceipt}
                      disabled={downloadingReceipt}
                      className="bg-taxi-yellow hover:bg-taxi-yellow/90 text-taxi-black text-xs py-2"
                    >
                      {downloadingReceipt
                        ? (locale === 'no' ? 'Lastar...' : 'Loading...')
                        : (locale === 'no' ? '⬇️ Last ned' : '⬇️ Download')}
                    </Button>
                    <Button
                      onClick={handlePrintReceipt}
                      className="bg-taxi-black hover:bg-taxi-black/90 text-white text-xs py-2"
                    >
                      {locale === 'no' ? '🖨️ Skriv ut' : '🖨️ Print'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium">
                      {locale === 'no' ? 'Send på e-post' : 'Email Receipt'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={receiptEmail}
                        onChange={(e) => setReceiptEmail(e.target.value)}
                        placeholder={locale === 'no' ? 'din@epost.no' : 'your@email.com'}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent text-sm"
                      />
                      <Button
                        onClick={handleEmailReceipt}
                        disabled={emailingReceipt || !receiptEmail}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3"
                      >
                        {emailingReceipt ? '...' : '📧'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Button */}
            {canDelete && (
              <div className="border-t pt-4">
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
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-xs">
                {locale === 'no'
                  ? 'Taxi har akseptert turen. Kontakt oss på telefon om du vil gjere endringar.'
                  : 'Taxi has accepted the trip. Please contact us by phone for changes.'}
              </div>
            )}

            <Button
              onClick={() => {
                setBooking(null);
                setBookRef('');
                setPhoneNumber('');
                setError(null);
                setSuccess(null);
              }}
              variant="secondary"
              className="w-full"
            >
              {locale === 'no' ? '← Tilbake' : '← Back'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
