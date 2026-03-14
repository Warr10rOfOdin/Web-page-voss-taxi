import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 15,
    borderBottom: '3px solid #FFD700',
    paddingBottom: 12,
    backgroundColor: '#FFFBF0',
    padding: 12,
    marginLeft: -30,
    marginRight: -30,
    marginTop: -30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  receiptNumber: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
  },
  receiptInfoBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 4,
    borderLeft: '3px solid #FFD700',
    marginTop: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1a1a1a',
    backgroundColor: '#FFF9E6',
    padding: 8,
    borderLeft: '4px solid #FFD700',
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFF9E6',
    borderLeft: '4px solid #FFD700',
    borderTop: '2px solid #FFD700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
    bottom: 25,
    left: 30,
    right: 30,
    borderTop: '2px solid #FFD700',
    paddingTop: 10,
    fontSize: 7,
    color: '#666',
    textAlign: 'center',
  },
  highlight: {
    backgroundColor: '#FFF9E6',
    padding: 6,
    borderLeft: '3px solid #FFD700',
    marginVertical: 6,
  },
  vatSection: {
    marginTop: 6,
    padding: 6,
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
  vehicleNumber?: string;
  licenseNumber?: string;
  driverName?: string;
  driverId?: string;
  tariff?: string;
  price: number;
  vat?: number;
  currency?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  invoiceNumber?: string;
  fromZone?: string;
  toZone?: string;
  tripSpecification?: Array<{
    type: string;
    km?: number;
    time?: string;
    price: number;
  }>;
  cardTerminal?: string;
  authorization?: string;
  referenceNumber?: string;
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
    vat: 'MVA (12%)',
    total: 'Totalt å betale',
    paymentMethod: 'Betalingsmåte',
    thankYou: 'Takk for at du reiser med Voss Taxi!',
    companyName: 'Voss Taxi',
    companyAddress: 'Voss, Noreg',
    companyPhone: '+47 56 51 13 40',
    companyEmail: 'post@vosstaxi.no',
    companyOrg: 'Org.nr: NO999505279MVA',
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
    vat: 'VAT (12%)',
    total: 'Total Amount',
    paymentMethod: 'Payment Method',
    thankYou: 'Thank you for traveling with Voss Taxi!',
    companyName: 'Voss Taxi',
    companyAddress: 'Voss, Norway',
    companyPhone: '+47 56 51 13 40',
    companyEmail: 'post@vosstaxi.no',
    companyOrg: 'Org.no: NO999505279MVA',
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
    // Norwegian VAT for passenger transport is 12% of base amount
    // Total price includes VAT, so: total = base * 1.12
    // Therefore: VAT = total - (total / 1.12) = total * (12/112)
    return data.price * (12 / 112);
  };

  const calculateSubtotal = () => {
    return data.price - calculateVAT();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🚕 {t.companyName}</Text>
          <Text style={styles.companyInfo}>{t.companyAddress}</Text>
          <Text style={styles.companyInfo}>{t.companyPhone} • {t.companyEmail}</Text>
          <Text style={styles.companyInfo}>{t.companyOrg}</Text>
        </View>

        {/* Receipt Title */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a' }}>
            {t.receipt}
          </Text>
          <View style={styles.receiptInfoBox}>
            <Text style={{ fontSize: 10, color: '#1a1a1a', marginBottom: 4, fontWeight: 'bold' }}>
              {t.bookingReference}: {data.bookRef}
            </Text>
            {data.receiptNumber && (
              <Text style={styles.receiptNumber}>
                {locale === 'no' ? 'Kvitt.nr' : 'Receipt No'}: {data.receiptNumber}
              </Text>
            )}
            {data.invoiceNumber && (
              <Text style={styles.receiptNumber}>
                {locale === 'no' ? 'Rekv.nr' : 'Invoice No'}: {data.invoiceNumber}
              </Text>
            )}
            <Text style={styles.receiptNumber}>
              {t.date}: {new Date(data.date).toLocaleString(locale === 'no' ? 'no-NO' : 'en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Text>
            {data.licenseNumber && (
              <Text style={{ fontSize: 9, color: '#1a1a1a', marginTop: 4, fontWeight: 'bold' }}>
                {t.license}: {data.licenseNumber}
              </Text>
            )}
            {data.driverId && (
              <Text style={styles.receiptNumber}>
                {locale === 'no' ? 'Fører ID' : 'Driver ID'}: {data.driverId}
              </Text>
            )}
          </View>
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
          {data.fromZone && (
            <View style={styles.row}>
              <Text style={styles.label}>{locale === 'no' ? 'Fra sone' : 'From zone'}</Text>
              <Text style={styles.value}>{data.fromZone}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>{t.dropoff}</Text>
            <Text style={styles.value}>{data.dropoffAddress}</Text>
          </View>
          {data.toZone && (
            <View style={styles.row}>
              <Text style={styles.label}>{locale === 'no' ? 'Til sone' : 'To zone'}</Text>
              <Text style={styles.value}>{data.toZone}</Text>
            </View>
          )}
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

        {/* Trip Specification */}
        {data.tripSpecification && data.tripSpecification.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {locale === 'no' ? 'Spesifikasjon' : 'Specification'}
            </Text>

            {/* Table header */}
            <View style={{ flexDirection: 'row', borderBottom: '1px solid #1a1a1a', paddingVertical: 5, backgroundColor: '#f5f5f5' }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', width: '40%', paddingLeft: 5 }}>
                {locale === 'no' ? 'Type' : 'Type'}
              </Text>
              <Text style={{ fontSize: 9, fontWeight: 'bold', width: '20%', textAlign: 'right' }}>KM</Text>
              <Text style={{ fontSize: 9, fontWeight: 'bold', width: '20%', textAlign: 'right' }}>
                {locale === 'no' ? 'Tid' : 'Time'}
              </Text>
              <Text style={{ fontSize: 9, fontWeight: 'bold', width: '20%', textAlign: 'right', paddingRight: 5 }}>
                {locale === 'no' ? 'Kr' : 'Price'}
              </Text>
            </View>

            {/* Table rows */}
            {data.tripSpecification.map((spec, index) => (
              <View key={index} style={{ flexDirection: 'row', paddingVertical: 4, borderBottom: '1px solid #eee' }}>
                <Text style={{ fontSize: 9, width: '40%', paddingLeft: 5 }}>{spec.type}</Text>
                <Text style={{ fontSize: 9, width: '20%', textAlign: 'right' }}>
                  {spec.km !== undefined ? spec.km.toFixed(3) : '-'}
                </Text>
                <Text style={{ fontSize: 9, width: '20%', textAlign: 'right' }}>{spec.time || '-'}</Text>
                <Text style={{ fontSize: 9, width: '20%', textAlign: 'right', paddingRight: 5 }}>
                  {spec.price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Economic Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.economicDetails}</Text>

          {data.tariff && (
            <View style={{ backgroundColor: '#FFF9E6', padding: 8, marginBottom: 6, borderLeft: '3px solid #FFD700' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1a1a1a' }}>{t.tariff}</Text>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1a1a1a' }}>{data.tariff}</Text>
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

          {data.cardTerminal && (
            <View style={{ marginTop: 5 }}>
              <View style={styles.row}>
                <Text style={styles.label}>{locale === 'no' ? 'Kortterminal' : 'Card Terminal'}</Text>
                <Text style={styles.value}>{data.cardTerminal}</Text>
              </View>
            </View>
          )}

          {data.authorization && (
            <View style={{ marginTop: 5 }}>
              <View style={styles.row}>
                <Text style={styles.label}>{locale === 'no' ? 'Autorisasjon' : 'Authorization'}</Text>
                <Text style={styles.value}>{data.authorization}</Text>
              </View>
            </View>
          )}

          {data.referenceNumber && (
            <View style={{ marginTop: 5 }}>
              <View style={styles.row}>
                <Text style={styles.label}>{locale === 'no' ? 'Referanse' : 'Reference'}</Text>
                <Text style={styles.value}>{data.referenceNumber}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Thank You Message */}
        <View style={{ backgroundColor: '#FFD700', padding: 10, marginTop: 8, borderRadius: 4 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', color: '#1a1a1a' }}>
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
