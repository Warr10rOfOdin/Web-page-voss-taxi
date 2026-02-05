import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: {
      default: 'Voss Taxi - ' + t('title'),
      template: '%s | Voss Taxi',
    },
    description: t('subtitle'),
    keywords: [
      'Voss taxi',
      'taxi Voss',
      'airport transfer Voss',
      'sightseeing Voss',
      'Bergen Flesland taxi',
      'Voss transport',
    ],
    authors: [{ name: 'Voss Taxi' }],
    openGraph: {
      title: 'Voss Taxi - ' + t('title'),
      description: t('subtitle'),
      url: 'https://www.vosstaxi.no',
      siteName: 'Voss Taxi',
      locale: locale === 'no' ? 'nb_NO' : 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TaxiService',
              name: 'Voss Taxi',
              telephone: '+47 56 51 13 40',
              email: 'post@vosstaxi.no',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Uttrågata 19',
                postalCode: '5700',
                addressLocality: 'Voss',
                addressCountry: 'NO',
              },
              url: 'https://www.vosstaxi.no',
              areaServed: {
                '@type': 'GeoCircle',
                geoMidpoint: {
                  '@type': 'GeoCoordinates',
                  latitude: 60.6289,
                  longitude: 6.4156,
                },
              },
              priceRange: '$$',
              openingHours: 'Mo-Su 00:00-23:59',
            }),
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
