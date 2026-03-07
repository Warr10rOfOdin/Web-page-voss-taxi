import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { BookingForm } from '@/components/booking/BookingForm';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative py-16 md:py-24 min-h-screen bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-taxi-yellow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-block glass-dark backdrop-blur-xl px-8 py-3 rounded-full mb-6 depth-2">
              <span className="text-taxi-yellow font-bold">📅 {locale === 'no' ? 'Bestilling' : 'Booking'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-white">
              {locale === 'no' ? 'Bestill Taxi No' : 'Book Your Taxi Now'}
            </h1>
            <p className="text-xl text-taxi-light-grey/90">
              {locale === 'no'
                ? 'Fyll ut skjemaet nedanfor, så kontaktar me deg snart'
                : 'Fill out the form below and we\'ll get in touch with you shortly'}
            </p>
          </div>

          {/* Booking Form */}
          <BookingForm locale={locale} />

          {/* Emergency Contact */}
          <div className="mt-8 glass-yellow backdrop-blur-xl rounded-2xl p-6 depth-2 border-2 border-taxi-yellow/50 text-center">
            <p className="font-bold text-taxi-black mb-3 text-lg">
              {locale === 'no'
                ? '⚡ Treng du taxi no med ein gong?'
                : '⚡ Need a taxi right now?'}
            </p>
            <a
              href="tel:+4756511340"
              className="text-3xl md:text-4xl font-bold text-taxi-black hover:text-white transition-all duration-300 inline-block hover:scale-105"
            >
              +47 56 51 13 40
            </a>
            <p className="text-sm text-taxi-black/70 mt-3">
              {locale === 'no'
                ? 'Tilgjengeleg 24/7 - Ring oss direkte for øyeblikkelig service'
                : 'Available 24/7 - Call us directly for immediate service'}
            </p>
          </div>
        </div>
      </Container>

      {/* Animated Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 animated-gradient" />
    </div>
  );
}
