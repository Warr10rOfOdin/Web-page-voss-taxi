import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingCheckCard } from '@/components/booking/BookingCheckCard';

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-16 md:py-24 min-h-screen bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {locale === 'no' ? 'Bestill Taxi No' : 'Book Your Taxi Now'}
          </h1>
          <p className="text-lg text-taxi-grey">
            {locale === 'no'
              ? 'Fyll ut skjemaet nedanfor, så kontaktar me deg snart'
              : 'Fill out the form below and we\'ll get in touch with you shortly'}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Booking Form (2 columns on large screens) */}
          <div className="lg:col-span-2">
            <BookingForm locale={locale} />

            {/* Emergency Contact */}
            <div className="mt-8 text-center p-6 bg-taxi-yellow/10 rounded-lg border-2 border-taxi-yellow">
              <p className="font-bold mb-2">
                {locale === 'no'
                  ? 'Treng du taxi no med ein gong?'
                  : 'Need a taxi right now?'}
              </p>
              <a
                href="tel:+4756511340"
                className="text-2xl font-bold text-taxi-yellow hover:text-taxi-black transition-colors"
              >
                +47 56 51 13 40
              </a>
              <p className="text-sm text-taxi-grey mt-2">
                {locale === 'no'
                  ? 'Tilgjengeleg 24/7 - Ring oss direkte'
                  : 'Available 24/7 - Call us directly'}
              </p>
            </div>
          </div>

          {/* Right: Check Your Booking (1 column on large screens) */}
          <div className="lg:col-span-1">
            <BookingCheckCard locale={locale} />
          </div>
        </div>
      </Container>
    </div>
  );
}
