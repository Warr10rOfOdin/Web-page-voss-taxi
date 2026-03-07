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
      subtitle: 'Bestill din taxi no, eller ring oss for øyeblikkelig service.',
      bookNow: 'Bestill No',
      callUs: 'Ring Oss',
      phone: '+47 56 51 13 40',
      available: 'Tilgjengeleg 24/7',
      features: [
        'Rask respons',
        'Alle betalingsmetodar',
        'Moderne køyretøy',
        'Erfarne sjåførar',
      ],
    },
    en: {
      title: 'Ready for your journey?',
      subtitle: 'Book your taxi now, or call us for immediate service.',
      bookNow: 'Book Now',
      callUs: 'Call Us',
      phone: '+47 56 51 13 40',
      available: 'Available 24/7',
      features: [
        'Fast response',
        'All payment methods',
        'Modern vehicles',
        'Experienced drivers',
      ],
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-br from-taxi-black to-gray-900 text-white overflow-hidden">
      {/* Subtle Background Element */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {t.title}
            </h2>
            <div className="w-24 h-1 bg-taxi-yellow mx-auto mb-6" />
            <p className="text-lg md:text-xl text-taxi-light-grey/80 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href={`/${locale}/book`}>
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto px-8 py-4 font-semibold"
              >
                {t.bookNow}
              </Button>
            </Link>
            <a
              href="tel:+4756511340"
              className="bg-white/10 border border-white/20 rounded-lg px-8 py-4 font-semibold text-white hover:bg-white/20 transition-colors inline-flex items-center justify-center"
            >
              {t.callUs}
            </a>
          </div>

          {/* Phone Number Display */}
          <div className="text-center mb-12 pb-12 border-b border-white/10">
            <p className="text-sm text-taxi-light-grey/60 mb-2 uppercase tracking-wide">
              {t.callUs}
            </p>
            <a
              href="tel:+4756511340"
              className="text-3xl md:text-4xl font-bold text-white hover:text-taxi-yellow transition-colors inline-block"
            >
              {t.phone}
            </a>
            <p className="text-sm text-taxi-light-grey/60 mt-3">
              {t.available}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {t.features.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="w-2 h-2 rounded-full bg-taxi-yellow mx-auto" />
                <p className="text-sm text-taxi-light-grey/70">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
