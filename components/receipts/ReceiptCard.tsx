'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface ReceiptCardData {
  bookRef: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  dropoffTime?: string;
  distance?: number;
  duration?: number;
  vehicleNumber?: string;
  licenseNumber?: string;
  driverName?: string;
  price?: number;
  vat?: number;
  currency?: string;
  paymentMethod?: string;
  tripStatus: string;
}

interface ReceiptCardProps {
  data: ReceiptCardData;
  locale: 'no' | 'en';
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ data, locale }) => {
  const t = locale === 'no' ? {
    receiptPreview: 'Kvitteringsførehandsvisning',
    tripSummary: 'Oppsummering av turen',
    bookingReference: 'Bestillingsreferanse',
    date: 'Dato',
    customer: 'Kunde',
    phone: 'Telefon',
    pickup: 'Henting',
    dropoff: 'Avlevering',
    pickupTime: 'Hentetid',
    dropoffTime: 'Avleveringstid',
    distance: 'Avstand',
    duration: 'Varighet',
    vehicle: 'Køyretøy',
    license: 'Løyve',
    driver: 'Sjåfør',
    subtotal: 'Delsum',
    vat: 'MVA (25%)',
    total: 'Totalt',
    paymentMethod: 'Betalingsmåte',
    thankYou: 'Takk for at du reiser med Voss Taxi!',
  } : {
    receiptPreview: 'Receipt Preview',
    tripSummary: 'Trip Summary',
    bookingReference: 'Booking Reference',
    date: 'Date',
    customer: 'Customer',
    phone: 'Phone',
    pickup: 'Pickup',
    dropoff: 'Drop-off',
    pickupTime: 'Pickup Time',
    dropoffTime: 'Drop-off Time',
    distance: 'Distance',
    duration: 'Duration',
    vehicle: 'Vehicle',
    license: 'License',
    driver: 'Driver',
    subtotal: 'Subtotal',
    vat: 'VAT (25%)',
    total: 'Total',
    paymentMethod: 'Payment Method',
    thankYou: 'Thank you for traveling with Voss Taxi!',
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return `${amount.toFixed(2)} ${data.currency || 'NOK'}`;
  };

  const formatDistance = (km?: number) => {
    if (!km) return '-';
    return `${km.toFixed(1)} km`;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}t ${mins}min`;
    }
    return `${mins}min`;
  };

  const calculateVAT = () => {
    if (!data.price) return 0;
    if (data.vat !== undefined) return data.vat;
    return data.price * 0.25;
  };

  const calculateSubtotal = () => {
    if (!data.price) return 0;
    return data.price - calculateVAT();
  };

  return (
    <Card className="border-2 border-taxi-yellow/30 bg-gradient-to-br from-white to-taxi-yellow/5">
      <CardHeader className="border-b border-taxi-yellow/20 bg-taxi-yellow/10">
        <CardTitle className="text-xl flex items-center gap-2">
          <span>📄</span>
          <span>{t.receiptPreview}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Header Info */}
        <div className="space-y-2 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t.bookingReference}:</span>
            <span className="font-bold text-lg text-taxi-black">{data.bookRef}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t.date}:</span>
            <span className="text-sm">
              {new Date(data.date).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
            {t.customer}
          </h4>
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t.customer}:</span>
              <span className="font-medium">{data.customerName}</span>
            </div>
            {data.customerPhone && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.phone}:</span>
                <span className="font-medium">{data.customerPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
            {t.tripSummary}
          </h4>
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">{t.pickup}:</span>
              <span className="font-medium text-right max-w-[60%]">{data.pickupAddress}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">{t.dropoff}:</span>
              <span className="font-medium text-right max-w-[60%]">{data.dropoffAddress}</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t.pickupTime}:</span>
              <span className="text-sm">
                {new Date(data.pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            {data.dropoffTime && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.dropoffTime}:</span>
                <span className="text-sm">
                  {new Date(data.dropoffTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
            {(data.distance !== undefined || data.duration !== undefined) && (
              <div className="h-px bg-gray-200 my-2"></div>
            )}
            {data.distance !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.distance}:</span>
                <span className="font-medium">{formatDistance(data.distance)}</span>
              </div>
            )}
            {data.duration !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.duration}:</span>
                <span className="font-medium">{formatDuration(data.duration)}</span>
              </div>
            )}
            {(data.vehicleNumber || data.licenseNumber || data.driverName) && (
              <div className="h-px bg-gray-200 my-2"></div>
            )}
            {data.vehicleNumber && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.vehicle}:</span>
                <span className="font-medium">{data.vehicleNumber}</span>
              </div>
            )}
            {data.licenseNumber && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.license}:</span>
                <span className="font-medium">{data.licenseNumber}</span>
              </div>
            )}
            {data.driverName && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.driver}:</span>
                <span className="font-medium">{data.driverName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price Information - Only show if price is available */}
        {data.price !== undefined && data.price > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
              {t.total}
            </h4>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t.subtotal}:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t.vat}:</span>
                <span className="font-medium">{formatCurrency(calculateVAT())}</span>
              </div>
              <div className="h-px bg-gray-300 my-2"></div>
              <div className="flex justify-between items-center bg-taxi-yellow/20 -mx-4 px-4 py-3 rounded">
                <span className="font-bold text-lg">{t.total}:</span>
                <span className="font-bold text-2xl text-taxi-black">
                  {formatCurrency(data.price)}
                </span>
              </div>
              {data.paymentMethod && (
                <>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.paymentMethod}:</span>
                    <span className="font-medium">{data.paymentMethod}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Thank You Message */}
        <div className="bg-gradient-to-r from-taxi-yellow/20 to-taxi-yellow/10 border-l-4 border-taxi-yellow p-4 rounded-r">
          <p className="text-center font-medium text-taxi-black">
            {t.thankYou}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
          <p>Voss Taxi • +47 56 51 13 40 • post@vosstaxi.no</p>
          <p className="mt-1">
            {locale === 'no'
              ? 'Dette er ein elektronisk generert kvittering'
              : 'This is an electronically generated receipt'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
