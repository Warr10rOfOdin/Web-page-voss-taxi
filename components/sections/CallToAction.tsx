import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface CallToActionProps {
  locale: string;
}

export function CallToAction({ locale }: CallToActionProps) {
  const content = {
    no: {
      title: 'Klar for din reise?',
      subtitle: 'Bestill din taxi no, eller ring oss for øyeblikkelig service. Me er alltid klare til å hjelpe deg.',
      bookNow: 'Bestill No',
      callNow: 'Ring Oss',
      available: 'Tilgjengeleg 24/7 - 365 dagar i året',
      features: [
        { icon: '⚡', text: 'Rask respons' },
        { icon: '💳', text: 'Alle betalingsmetodar' },
        { icon: '🚗', text: 'Moderne køyretøy' },
        { icon: '✓', text: 'Erfarne sjåførar' },
      ],
    },
    en: {
      title: 'Ready for your journey?',
      subtitle: 'Book your taxi now, or call us for immediate service. We are always ready to help you.',
      bookNow: 'Book Now',
      callNow: 'Call Us',
      available: 'Available 24/7 - 365 days a year',
      features: [
        { icon: '⚡', text: 'Fast response' },
        { icon: '💳', text: 'All payment methods' },
        { icon: '🚗', text: 'Modern vehicles' },
        { icon: '✓', text: 'Experienced drivers' },
      ],
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-96 h-96 bg-taxi-yellow/20 rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
      </div>

      <Container className="relative z-10">
        <div className="glass-dark backdrop-blur-xl rounded-3xl p-8 md:p-16 depth-4 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-taxi-yellow to-white">
                {t.title}
              </span>
            </h2>
            <p className="text-xl text-taxi-light-grey/90 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href={`/${locale}/book`} className="flex-1 sm:flex-none">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto text-lg px-12 py-6 depth-glow hover-scale smooth-transition font-bold"
              >
                <svg className="w-6 h-6 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t.bookNow}
              </Button>
            </Link>
            <a
              href="tel:+4756511340"
              className="flex-1 sm:flex-none glass-strong backdrop-blur-lg rounded-full px-12 py-6 text-lg font-bold text-white hover:text-taxi-yellow hover-lift smooth-transition depth-2 inline-flex items-center justify-center border border-white/20"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t.callNow}
            </a>
          </div>

          {/* Phone Number Display */}
          <div className="text-center mb-8">
            <a
              href="tel:+4756511340"
              className="inline-block glass-yellow rounded-2xl px-8 py-4 depth-2 hover-glow smooth-transition"
            >
              <p className="text-sm text-taxi-black/70 font-semibold mb-1">
                📞 {t.callNow}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-taxi-black">
                +47 56 51 13 40
              </p>
            </a>
          </div>

          {/* Availability */}
          <p className="text-center text-taxi-light-grey/70 mb-10">
            ⏰ {t.available}
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center">
            {t.features.map((feature, index) => (
              <div
                key={index}
                className="glass-strong backdrop-blur-xl rounded-full px-6 py-3 depth-1 hover-lift smooth-transition"
              >
                <span className="text-lg mr-2">{feature.icon}</span>
                <span className="font-semibold text-white">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Animated Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 animated-gradient" />
    </section>
  );
}
