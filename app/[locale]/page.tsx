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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-taxi-yellow/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-taxi-yellow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-taxi-yellow/5 rounded-full blur-3xl" />

      <Container className="relative z-10 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Header - More Prominent */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 drop-shadow-lg">
              {locale === 'no' ? 'Voss Taxi' : 'Voss Taxi'}
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-taxi-yellow to-transparent mx-auto mb-8 rounded-full" />
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              {locale === 'no'
                ? 'Bestill din tur enkelt og raskt'
                : 'Book your ride easily and quickly'}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-10">
            {/* Booking Form */}
            <div>
              <BookingForm locale={locale} />
            </div>

            {/* Booking Checker Sidebar */}
            <div className="lg:sticky lg:top-24 self-start space-y-6">
              <BookingChecker locale={locale} />

              {/* Emergency Contact Card */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-taxi-yellow/20 to-taxi-yellow/10 backdrop-blur-md border-2 border-taxi-yellow/40 rounded-2xl p-6 md:p-8 shadow-2xl hover:scale-105 transition-transform duration-300">
                  <p className="text-sm md:text-base text-white mb-3 font-semibold">
                    {locale === 'no'
                      ? 'Treng taxi med ein gong? Ring oss direkte!'
                      : 'Need a taxi right now? Call us directly!'}
                  </p>
                  <a
                    href="tel:+4756511340"
                    className="text-2xl md:text-3xl font-bold text-taxi-yellow hover:text-white transition-colors inline-block drop-shadow-lg mb-3"
                  >
                    +47 56 51 13 40
                  </a>
                  <p className="text-xs text-white/80 mt-3 bg-white/10 px-4 py-2 rounded-full inline-block">
                    {locale === 'no'
                      ? '🚖 Tilgjengeleg 24/7, alle dagar i året'
                      : '🚖 Available 24/7, every day of the year'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
