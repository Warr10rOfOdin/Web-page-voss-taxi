'use client';

import { Container } from '@/components/ui/Container';

interface WhyChooseUsProps {
  locale: string;
}

export function WhyChooseUs({ locale }: WhyChooseUsProps) {
  const content = {
    no: {
      title: 'Kvifor Velje Voss Taxi?',
      subtitle: 'Me er meir enn bare ein taxi - me er din lokale partner',
      reasons: [
        {
          icon: '🏆',
          title: '75 År med Erfaring',
          description: 'Sidan 1950 har me vore Voss sitt leiande taxiselskap. Generasjonar av erfaring og lokal kunnskap.'
        },
        {
          icon: '⚡',
          title: 'Rask Respons',
          description: 'Gjennomsnittleg opphentingstid på under 10 minutt i sentrum. Me er alltid klare når du treng oss.'
        },
        {
          icon: '🌍',
          title: 'Lokale Ekspertar',
          description: 'Våre sjåførar er fødd og oppvaksne i Voss. Ingen kjenner området betre - me veit alle smugar og snarveiar.'
        },
        {
          icon: '💳',
          title: 'Transparent Prising',
          description: 'Fastpris på populære ruter, ingen overraskingar. Alle betalingsmåtar akseptert: kort, Vipps, kontant.'
        },
        {
          icon: '🚗',
          title: 'Moderne Flåte',
          description: 'Nye, komfortable bilar med GPS, klima og USB-lading. Frå standard taxi til 16-seters minibuss.'
        },
        {
          icon: '🌐',
          title: 'Fleirspråkleg Service',
          description: 'Våre sjåførar snakkar norsk, engelsk og fleire språk. Perfekt for internasjonale besøkande.'
        },
        {
          icon: '♿',
          title: 'Universell Tilgjenge',
          description: 'Rullestol-taxi med godkjent utstyr. TT-kort akseptert. Me sikrar at alle kan reise trygt.'
        },
        {
          icon: '📱',
          title: 'Enkel Booking',
          description: 'Book online, via telefon eller app. Bestill no eller planlegg fram i tid. Bekreftelse med ein gang.'
        },
        {
          icon: '🎯',
          title: 'Punktlege & Pålitelege',
          description: 'Me respekterer tida di. 99% punktlegheit på alle køyrer. Me sporer flyet ditt for flyplasstransport.'
        },
        {
          icon: '🌟',
          title: 'Premium Service',
          description: 'Reine bilar, profesjonelle sjåførar, assistanse med bagasje. Me går den ekstra mila for deg.'
        },
        {
          icon: '🔒',
          title: 'Trygg & Sikker',
          description: 'Alle sjåførar er bakgrunnssjekka og sertifiserte. Forsikra køyrer. Din sikkerheit er vår prioritet.'
        },
        {
          icon: '🏔️',
          title: 'Kjenner Voss',
          description: 'Frå Stalheimskleiva til Bordalsgjelet - me kjenner kvart fjell, foss og fjord. Den perfekte guiden.'
        }
      ]
    },
    en: {
      title: 'Why Choose Voss Taxi?',
      subtitle: 'We\'re more than just a taxi - we\'re your local partner',
      reasons: [
        {
          icon: '🏆',
          title: '75 Years of Experience',
          description: 'Since 1950, we\'ve been Voss\'s leading taxi company. Generations of experience and local knowledge.'
        },
        {
          icon: '⚡',
          title: 'Fast Response',
          description: 'Average pickup time under 10 minutes in the center. We\'re always ready when you need us.'
        },
        {
          icon: '🌍',
          title: 'Local Experts',
          description: 'Our drivers were born and raised in Voss. Nobody knows the area better - we know all the shortcuts.'
        },
        {
          icon: '💳',
          title: 'Transparent Pricing',
          description: 'Fixed prices on popular routes, no surprises. All payment methods accepted: card, Vipps, cash.'
        },
        {
          icon: '🚗',
          title: 'Modern Fleet',
          description: 'New, comfortable cars with GPS, climate control and USB charging. From standard taxi to 16-seat minibus.'
        },
        {
          icon: '🌐',
          title: 'Multilingual Service',
          description: 'Our drivers speak Norwegian, English and several other languages. Perfect for international visitors.'
        },
        {
          icon: '♿',
          title: 'Universal Access',
          description: 'Wheelchair taxi with approved equipment. TT-card accepted. We ensure everyone can travel safely.'
        },
        {
          icon: '📱',
          title: 'Easy Booking',
          description: 'Book online, by phone or app. Order now or schedule ahead. Instant confirmation.'
        },
        {
          icon: '🎯',
          title: 'Punctual & Reliable',
          description: 'We respect your time. 99% punctuality on all rides. We track your flight for airport transfers.'
        },
        {
          icon: '🌟',
          title: 'Premium Service',
          description: 'Clean cars, professional drivers, luggage assistance. We go the extra mile for you.'
        },
        {
          icon: '🔒',
          title: 'Safe & Secure',
          description: 'All drivers are background-checked and certified. Insured rides. Your safety is our priority.'
        },
        {
          icon: '🏔️',
          title: 'Knows Voss',
          description: 'From Stalheimskleiva to Bordalsgjelet - we know every mountain, waterfall and fjord. Your perfect guide.'
        }
      ]
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-taxi-light-grey/30 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-taxi-black via-taxi-yellow to-taxi-black">
              {t.title}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-taxi-grey max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {t.reasons.map((reason, index) => (
            <div
              key={index}
              className="glass-strong backdrop-blur-xl rounded-2xl p-6 depth-2 hover-lift smooth-transition group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 smooth-transition">
                {reason.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 text-taxi-black group-hover:text-taxi-yellow smooth-transition">
                {reason.title}
              </h3>
              <p className="text-sm text-taxi-grey leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-20 glass-yellow backdrop-blur-xl rounded-3xl p-12 depth-4 text-center">
          <h3 className="text-4xl font-bold mb-4 text-taxi-black">
            {locale === 'no' ? 'Din Lokale Taxipartner' : 'Your Local Taxi Partner'}
          </h3>
          <p className="text-xl text-taxi-grey max-w-3xl mx-auto leading-relaxed">
            {locale === 'no'
              ? 'Me er ikkje bare ein taxi - me er din lokale guide, din pålitelege transport, og din veg til dei vakreste opplevingane i Voss og omegn.'
              : 'We\'re not just a taxi - we\'re your local guide, your reliable transport, and your gateway to the most beautiful experiences in Voss and surroundings.'}
          </p>
        </div>
      </Container>
    </section>
  );
}
