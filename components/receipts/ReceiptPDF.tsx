import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #1a1a1a',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 8,
    color: '#666',
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  receiptNumber: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottom: '1px solid #eee',
  },
  label: {
    fontSize: 10,
    color: '#666',
    width: '40%',
  },
  value: {
    fontSize: 10,
    color: '#1a1a1a',
    width: '60%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '2px solid #1a1a1a',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1px solid #eee',
    paddingTop: 15,
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
  },
  highlight: {
    backgroundColor: '#FFF9E6',
    padding: 10,
    borderLeft: '3px solid #FFD700',
    marginVertical: 10,
  },
  vatSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  vatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  vatLabel: {
    fontSize: 9,
    color: '#666',
  },
  vatValue: {
    fontSize: 9,
    color: '#1a1a1a',
  },
});

export interface ReceiptData {
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
  licenseNumber?: string;
  driverName?: string;
  tariff?: string;
  price: number;
  vat?: number;
  currency?: string;
  paymentMethod?: string;
}

interface ReceiptPDFProps {
  data: ReceiptData;
  locale: 'no' | 'en';
}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ data, locale }) => {
  const t = locale === 'no' ? {
    receipt: 'Kvittering',
    receiptFor: 'Kvittering for',
    tripDetails: 'Turdetaljar',
    economicDetails: 'Økonomiske detaljar',
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
    license: 'Løyve',
    driver: 'Sjåfør',
    tariff: 'Takst',
    subtotal: 'Delsum',
    vat: 'MVA (25%)',
    total: 'Totalt å betale',
    paymentMethod: 'Betalingsmåte',
    thankYou: 'Takk for at du reiser med Voss Taxi!',
    companyName: 'Voss Taxi',
    companyAddress: 'Voss, Noreg',
    companyPhone: '+47 56 51 13 40',
    companyEmail: 'post@vosstaxi.no',
    companyOrg: 'Org.nr: 123456789 MVA',
    footer: 'Dette er ein elektronisk generert kvittering. Spar denne for dine eigne register.',
  } : {
    receipt: 'Receipt',
    receiptFor: 'Receipt for',
    tripDetails: 'Trip Details',
    economicDetails: 'Economic Details',
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
    license: 'License',
    driver: 'Driver',
    tariff: 'Tariff',
    subtotal: 'Subtotal',
    vat: 'VAT (25%)',
    total: 'Total Amount',
    paymentMethod: 'Payment Method',
    thankYou: 'Thank you for traveling with Voss Taxi!',
    companyName: 'Voss Taxi',
    companyAddress: 'Voss, Norway',
    companyPhone: '+47 56 51 13 40',
    companyEmail: 'post@vosstaxi.no',
    companyOrg: 'Org.no: 123456789 VAT',
    footer: 'This is an electronically generated receipt. Please save for your records.',
  };

  const formatCurrency = (amount: number) => {
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
    if (data.vat !== undefined) return data.vat;
    // Norwegian VAT is 25%
    return data.price * 0.25;
  };

  const calculateSubtotal = () => {
    return data.price - calculateVAT();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.companyName}</Text>
          <Text style={styles.companyInfo}>{t.companyAddress}</Text>
          <Text style={styles.companyInfo}>{t.companyPhone} • {t.companyEmail}</Text>
          <Text style={styles.companyInfo}>{t.companyOrg}</Text>
        </View>

        {/* Receipt Title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
            {t.receipt}
          </Text>
          <Text style={styles.receiptNumber}>
            {t.bookingReference}: {data.bookRef}
          </Text>
          <Text style={styles.receiptNumber}>
            {t.date}: {new Date(data.date).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.receiptFor}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.customer}</Text>
            <Text style={styles.value}>{data.customerName}</Text>
          </View>
          {data.customerPhone && (
            <View style={styles.row}>
              <Text style={styles.label}>{t.phone}</Text>
              <Text style={styles.value}>{data.customerPhone}</Text>
            </View>
          )}
        </View>

        {/* Trip Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.tripDetails}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.pickup}</Text>
            <Text style={styles.value}>{data.pickupAddress}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.dropoff}</Text>
            <Text style={styles.value}>{data.dropoffAddress}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.pickupTime}</Text>
            <Text style={styles.value}>
              {new Date(data.pickupTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </Text>
          </View>
          {data.dropoffTime && (
            <View style={styles.row}>
              <Text style={styles.label}>{t.dropoffTime}</Text>
              <Text style={styles.value}>
                {new Date(data.dropoffTime).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </Text>
            </View>
          )}
          {data.distance !== undefined && (
            <View style={styles.row}>
              <Text style={styles.label}>{t.distance}</Text>
              <Text style={styles.value}>{formatDistance(data.distance)}</Text>
            </View>
          )}
          {data.duration !== undefined && (
            <View style={styles.row}>
              <Text style={styles.label}>{t.duration}</Text>
              <Text style={styles.value}>{formatDuration(data.duration)}</Text>
            </View>
          )}
          {data.licenseNumber && (
            <View style={styles.row}>
              <Text style={styles.label}>{t.license}</Text>
              <Text style={styles.value}>{data.licenseNumber}</Text>
            </View>
          )}
          {data.driverName && (
            <View style={styles.row}>
              <Text style={styles.label}>{t.driver}</Text>
              <Text style={styles.value}>{data.driverName}</Text>
            </View>
          )}
          {data.tariff && (
            <View style={styles.row}>
              <Text style={styles.label}>{t.tariff}</Text>
              <Text style={styles.value}>{data.tariff}</Text>
            </View>
          )}
        </View>

        {/* Economic Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.economicDetails}</Text>

          {data.tariff && (
            <View style={styles.highlight}>
              <View style={styles.row}>
                <Text style={{ ...styles.label, fontWeight: 'bold', color: '#1a1a1a' }}>{t.tariff}</Text>
                <Text style={{ ...styles.value, fontWeight: 'bold' }}>{data.tariff}</Text>
              </View>
            </View>
          )}

          <View style={styles.vatSection}>
            <View style={styles.vatRow}>
              <Text style={styles.vatLabel}>{t.subtotal}</Text>
              <Text style={styles.vatValue}>{formatCurrency(calculateSubtotal())}</Text>
            </View>
            <View style={styles.vatRow}>
              <Text style={styles.vatLabel}>{t.vat}</Text>
              <Text style={styles.vatValue}>{formatCurrency(calculateVAT())}</Text>
            </View>
          </View>

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t.total}</Text>
              <Text style={styles.totalValue}>{formatCurrency(data.price)}</Text>
            </View>
          </View>

          {data.paymentMethod && (
            <View style={{ marginTop: 10 }}>
              <View style={styles.row}>
                <Text style={styles.label}>{t.paymentMethod}</Text>
                <Text style={styles.value}>{data.paymentMethod}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Thank You Message */}
        <View style={styles.highlight}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center' }}>
            {t.thankYou}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{t.footer}</Text>
          <Text style={{ marginTop: 5 }}>
            {t.companyName} • {t.companyPhone} • {t.companyEmail}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
