import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isNorwegian = locale === 'no';

  return (
    <div className="min-h-screen bg-gradient-to-b from-taxi-black via-taxi-black to-taxi-grey">
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center py-12">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="text-taxi-yellow">VOSS</span>
            <span className="text-white"> TAXI</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl">
            {isNorwegian
              ? 'Din pålitelege transportpartner i Voss'
              : 'Your Reliable Transport Partner in Voss'}
          </p>

          {/* Main CTA - Book Now */}
          <Link href={`/${locale}/book`}>
            <Button size="lg" className="text-lg px-12 py-6 mb-8">
              {isNorwegian ? 'Bestill Taxi No' : 'Book Your Taxi Now'}
            </Button>
          </Link>

          {/* Phone Number */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md border border-taxi-yellow/30">
            <p className="text-white/80 mb-3 text-sm uppercase tracking-wide">
              {isNorwegian ? 'Treng du taxi no?' : 'Need a taxi right now?'}
            </p>
            <a
              href="tel:+4756511340"
              className="text-3xl md:text-4xl font-bold text-taxi-yellow hover:text-taxi-yellow/80 transition-colors block"
            >
              +47 56 51 13 40
            </a>
            <p className="text-white/60 mt-3 text-sm">
              {isNorwegian ? 'Tilgjengeleg 24/7' : 'Available 24/7'}
            </p>
          </div>

          {/* Quick Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl text-white">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-taxi-yellow text-3xl mb-2">🚕</div>
              <h3 className="font-bold mb-1">
                {isNorwegian ? 'Lokale Sjåførar' : 'Local Drivers'}
              </h3>
              <p className="text-sm text-white/70">
                {isNorwegian
                  ? 'Erfarne lokale sjåførar som kjenner området'
                  : 'Experienced local drivers who know the area'}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-taxi-yellow text-3xl mb-2">⏰</div>
              <h3 className="font-bold mb-1">24/7</h3>
              <p className="text-sm text-white/70">
                {isNorwegian
                  ? 'Tilgjengeleg heile døgnet, alle dagar'
                  : 'Available around the clock, every day'}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-taxi-yellow text-3xl mb-2">💳</div>
              <h3 className="font-bold mb-1">
                {isNorwegian ? 'Alle Betalingsmåtar' : 'All Payment Methods'}
              </h3>
              <p className="text-sm text-white/70">
                {isNorwegian
                  ? 'Kontant, kort, Vipps og faktura'
                  : 'Cash, card, Vipps, and invoice'}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
