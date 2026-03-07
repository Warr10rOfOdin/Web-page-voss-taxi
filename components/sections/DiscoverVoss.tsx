'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface DiscoverVossProps {
  locale: string;
}

export function DiscoverVoss({ locale }: DiscoverVossProps) {
  const content = {
    no: {
      title: 'Opplev Voss',
      subtitle: 'Det Naturlege Eventyret',
      description: 'Voss ligg midt i hjartet av Vestlandet, omgjeven av majestiske fjell, klårt vatn og spektakulær natur. Her kan du oppleve ekstrem sport, roleg natur og autentisk norsk kultur - alt på éin plass.',
      features: [
        {
          icon: '🏔️',
          title: 'Eventyr i Fjellet',
          description: 'Frå verdskjent fallskjermhopping til roleg fjellvandring - Voss er eit paradis for eventyrlyste og naturelskarar.'
        },
        {
          icon: '💧',
          title: 'Fossar og Fjordar',
          description: 'Besøk Tvindefossen og Bordalsgjelet, eller ta ein tur til dei nærliggjande fjordane. Naturopplevingar du aldri gløymer.'
        },
        {
          icon: '⛷️',
          title: 'Verdsklasse Vintersport',
          description: 'Voss Resort er eit av Noregs beste alpinsenter, med utfordrande løyper og moderne fasiliteter for heile familien.'
        },
        {
          icon: '🎭',
          title: 'Kultur og Historie',
          description: 'Utforsk Finneloftet, Voss Folkemuseum og den rike kulturarven som strekk seg tusen år tilbake i tid.'
        }
      ],
      cta: 'Bestill Taxi-tur',
      learnMore: 'Sjå Alle Destinasjonar'
    },
    en: {
      title: 'Discover Voss',
      subtitle: 'Nature\'s Adventure Capital',
      description: 'Nestled in the heart of Western Norway, Voss is surrounded by majestic mountains, crystal-clear waters, and spectacular nature. Experience extreme sports, peaceful nature, and authentic Norwegian culture - all in one place.',
      features: [
        {
          icon: '🏔️',
          title: 'Mountain Adventures',
          description: 'From world-famous skydiving to peaceful mountain hiking - Voss is paradise for adventure seekers and nature lovers.'
        },
        {
          icon: '💧',
          title: 'Waterfalls & Fjords',
          description: 'Visit Tvindefossen and Bordalsgjelet, or take a trip to the nearby fjords. Nature experiences you\'ll never forget.'
        },
        {
          icon: '⛷️',
          title: 'World-Class Winter Sports',
          description: 'Voss Resort is one of Norway\'s best alpine centers, with challenging slopes and modern facilities for the whole family.'
        },
        {
          icon: '🎭',
          title: 'Culture & History',
          description: 'Explore Finneloftet, Voss Folk Museum and the rich cultural heritage that stretches back a thousand years.'
        }
      ],
      cta: 'Book Taxi Tour',
      learnMore: 'See All Destinations'
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-taxi-light-grey/30 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-taxi-black via-taxi-yellow to-taxi-black">
            {t.title}
          </h2>
          <p className="text-2xl md:text-3xl text-taxi-grey font-semibold mb-6">
            {t.subtitle}
          </p>
          <p className="text-lg md:text-xl text-taxi-grey/80 max-w-4xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="glass-strong backdrop-blur-xl rounded-3xl p-8 hover-lift smooth-transition depth-3 group"
            >
              <div className="text-6xl mb-6 group-hover:scale-110 smooth-transition">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-taxi-black">
                {feature.title}
              </h3>
              <p className="text-taxi-grey leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight Stats */}
        <div className="glass-yellow backdrop-blur-xl rounded-3xl p-12 depth-4 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-taxi-black mb-2">600m</div>
              <div className="text-sm md:text-base text-taxi-grey font-semibold">
                {locale === 'no' ? 'Høgde over havet' : 'Elevation'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-taxi-black mb-2">1000+</div>
              <div className="text-sm md:text-base text-taxi-grey font-semibold">
                {locale === 'no' ? 'År med historie' : 'Years of History'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-taxi-black mb-2">15min</div>
              <div className="text-sm md:text-base text-taxi-grey font-semibold">
                {locale === 'no' ? 'Til Bordalsgjelet' : 'To Bordalsgjelet'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-taxi-black mb-2">24/7</div>
              <div className="text-sm md:text-base text-taxi-grey font-semibold">
                {locale === 'no' ? 'Taxi Service' : 'Taxi Service'}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href={`/${locale}/book`}>
            <Button size="lg" variant="primary" className="w-full sm:w-auto text-xl px-12 py-6">
              {t.cta}
            </Button>
          </Link>
          <Link href={`/${locale}/destinations`}>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-xl px-12 py-6">
              {t.learnMore}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
