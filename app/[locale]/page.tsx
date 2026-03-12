import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingChecker } from '@/components/booking/BookingChecker';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black overflow-hidden">
      {/* Subtle Background Element */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl" />

      <Container className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
              {locale === 'no' ? 'Voss Taxi' : 'Voss Taxi'}
            </h1>
            <div className="w-24 h-1 bg-taxi-yellow mx-auto mb-6" />
            <p className="text-xl text-taxi-light-grey/80">
              {locale === 'no'
                ? 'Bestill din tur enkelt og raskt'
                : 'Book your ride easily and quickly'}
            </p>
          </div>

          {/* Booking Form */}
          <BookingForm locale={locale} />

          {/* Booking Checker */}
          <div className="mt-12">
            <BookingChecker locale={locale} />
          </div>

          {/* Emergency Contact */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <p className="text-sm text-taxi-light-grey/70 mb-3">
                {locale === 'no'
                  ? 'Treng taxi med ein gong? Ring oss direkte'
                  : 'Need a taxi right now? Call us directly'}
              </p>
              <a
                href="tel:+4756511340"
                className="text-2xl md:text-3xl font-bold text-white hover:text-taxi-yellow transition-colors inline-block"
              >
                +47 56 51 13 40
              </a>
              <p className="text-xs text-taxi-light-grey/60 mt-3">
                {locale === 'no'
                  ? 'Tilgjengeleg 24/7, alle dagar i året'
                  : 'Available 24/7, every day of the year'}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
