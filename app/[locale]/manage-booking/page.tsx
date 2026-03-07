'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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

export default function ManageBookingPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = useTranslations('manageBooking');
  const searchParams = useSearchParams();

  const [bookRef, setBookRef] = useState('');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-search if ref is in URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setBookRef(ref.toUpperCase());
      // Trigger search after setting ref
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

    setLoading(true);
    setError(null);
    setSuccess(null);
    setBooking(null);

    try {
      const response = await fetch(`/api/booking/details?bookRef=${encodeURIComponent(bookRef)}`);
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
    if (!bookRef || !booking) return;

    const confirmMsg = locale === 'no' 
      ? 'Er du sikker på at du vil slette denne bookinga?' 
      : 'Are you sure you want to delete this booking?';

    if (!confirm(confirmMsg)) return;

    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/booking/delete?bookRef=${encodeURIComponent(bookRef)}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete booking');
      }

      setSuccess(locale === 'no' ? 'Booking sletta!' : 'Booking deleted successfully!');
      setBooking(null);
      setBookRef('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  const canDelete = booking && (
    booking.tripStatus === 'AU' || 
    booking.vehicleNo === 0 || 
    !booking.licenseNo ||
    booking.licenseNo === ''
  );

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
                    <span>
                      {booking.vehicleNo && booking.vehicleNo > 0 
                        ? `${locale === 'no' ? 'Taxi tilvist' : 'Taxi assigned'} (${booking.licenseNo})`
                        : (locale === 'no' ? 'Ventar på taxi' : 'Waiting for taxi')}
                    </span>
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

              {/* Delete Button */}
              {canDelete ? (
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting
                    ? (locale === 'no' ? 'Slettar...' : 'Deleting...')
                    : (locale === 'no' ? 'Slett booking' : 'Delete Booking')}
                </Button>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  {locale === 'no' 
                    ? 'Kan ikkje slette - taxi har akseptert turen. Kontakt oss på telefon.' 
                    : 'Cannot delete - taxi has accepted the trip. Please contact us by phone.'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
