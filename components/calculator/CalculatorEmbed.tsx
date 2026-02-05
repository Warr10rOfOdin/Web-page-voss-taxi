'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';

interface CalculatorEmbedProps {
  locale: string;
}

export function CalculatorEmbed({ locale }: CalculatorEmbedProps) {
  const t = useTranslations('calculator');

  // The calculator URL - update this with your deployed calculator URL
  // For now, using the GitHub repo URL as placeholder
  const calculatorUrl = process.env.NEXT_PUBLIC_CALCULATOR_URL || 'https://voss-taxi-kalkulator.vercel.app';

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-taxi-grey mb-4">
            {locale === 'no'
              ? 'Bruk kalkulatoren nedanfor for å få eit prisoverslag på turen din. Kalkulatoren tar omsyn til avstand, køyretid, tidspunkt og biltype.'
              : 'Use the calculator below to get a price estimate for your trip. The calculator considers distance, travel time, time of day, and vehicle type.'}
          </p>
          <div className="flex items-start space-x-2 text-sm text-taxi-grey">
            <svg
              className="w-5 h-5 text-taxi-yellow mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p>
              {locale === 'no'
                ? 'Prisane er basert på gjeldande Voss Taxi-takstar. Endeleg pris kan variere avhengig av faktiske forhold.'
                : 'Prices are based on current Voss Taxi tariffs. Final price may vary depending on actual conditions.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Embed */}
      <Card>
        <CardContent className="p-0">
          <div className="relative w-full bg-white rounded-lg overflow-hidden" style={{ minHeight: '800px' }}>
            <iframe
              src={`${calculatorUrl}${locale === 'en' ? '?lang=en' : ''}`}
              className="w-full h-full min-h-[800px] border-0"
              title={t('title')}
              allow="geolocation"
            />
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-taxi-light-grey">
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'no' ? 'Treng du hjelp?' : 'Need Help?'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-taxi-grey">
            {locale === 'no'
              ? 'Dersom du har spørsmål om prisen eller ønskjer å bestille, kan du kontakte oss direkte:'
              : 'If you have questions about the price or want to book, contact us directly:'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+4756511340"
              className="inline-flex items-center justify-center px-6 py-3 bg-taxi-yellow text-taxi-black font-bold rounded-lg hover:bg-taxi-black hover:text-taxi-yellow transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +47 56 51 13 40
            </a>
            <a
              href={`/${locale}/book`}
              className="inline-flex items-center justify-center px-6 py-3 bg-taxi-black text-white font-bold rounded-lg hover:bg-taxi-grey transition-colors"
            >
              {locale === 'no' ? 'Bestill Online' : 'Book Online'}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
