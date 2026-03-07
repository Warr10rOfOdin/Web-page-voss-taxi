'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface PopularDestinationsProps {
  locale: string;
}

export function PopularDestinations({ locale }: PopularDestinationsProps) {
  const content = {
    no: {
      title: 'Populære Destinasjonar',
      subtitle: 'Utforsk dei vakreste stadane rundt Voss',
      destinations: [
        {
          name: 'Stalheimskleiva',
          description: 'Noregs brattaste veg med 13 hårnålssvingar og spektakulære utsiktspunkt. Ein must-see for alle besøkande.',
          icon: '🏔️',
          time: '25 min',
          highlight: 'Ikonisk veganlegg'
        },
        {
          name: 'Bordalsgjelet',
          description: 'Dramatisk vinterlandskap med issøyler og frosne fossar. Eit av Noregs mest fotograferte stader.',
          icon: '❄️',
          time: '15 min',
          highlight: 'Vintermagi'
        },
        {
          name: 'Tvindefossen',
          description: 'Majestisk 152m høg foss som styrtlar ned i dalen. Lett tilgjengeleg og perfekt for familiar.',
          icon: '💧',
          time: '10 min',
          highlight: 'Familievennleg'
        },
        {
          name: 'Bergen Flesland',
          description: 'Direkte flyplass-transfer med komfort og stil. Me kjenner alle veganea og sikrar trygg transport.',
          icon: '✈️',
          time: '90 min',
          highlight: 'Døgnopen service'
        },
        {
          name: 'Flåm & Sognefjorden',
          description: 'Opplev verdas vakreste fjord og den berømte Flåmsbana. Perfekt dagstu frå Voss.',
          icon: '⛵',
          time: '60 min',
          highlight: 'UNESCO-området'
        },
        {
          name: 'Voss Resort',
          description: 'Alpinsenter med verdskl asse fasiliteter. Vinter og sommaraktivitetar for heile familien.',
          icon: '⛷️',
          time: '5 min',
          highlight: 'All-season'
        }
      ],
      cta: 'Bestill Tur No',
      viewAll: 'Sjå Alle Destinasjonar'
    },
    en: {
      title: 'Popular Destinations',
      subtitle: 'Explore the most beautiful places around Voss',
      destinations: [
        {
          name: 'Stalheimskleiva',
          description: 'Norway\'s steepest road with 13 hairpin bends and spectacular viewpoints. A must-see for all visitors.',
          icon: '🏔️',
          time: '25 min',
          highlight: 'Iconic road'
        },
        {
          name: 'Bordalsgj',
          description: 'Dramatic winter landscape with ice pillars and frozen waterfalls. One of Norway\'s most photographed locations.',
          icon: '❄️',
          time: '15 min',
          highlight: 'Winter magic'
        },
        {
          name: 'Tvindefossen',
          description: 'Majestic 152m high waterfall cascading into the valley. Easily accessible and perfect for families.',
          icon: '💧',
          time: '10 min',
          highlight: 'Family friendly'
        },
        {
          name: 'Bergen Flesland',
          description: 'Direct airport transfer with comfort and style. We know all the routes and ensure safe transport.',
          icon: '✈️',
          time: '90 min',
          highlight: '24/7 service'
        },
        {
          name: 'Flåm & Sognefjord',
          description: 'Experience the world\'s most beautiful fjord and the famous Flåm Railway. Perfect day trip from Voss.',
          icon: '⛵',
          time: '60 min',
          highlight: 'UNESCO area'
        },
        {
          name: 'Voss Resort',
          description: 'Alpine center with world-class facilities. Winter and summer activities for the whole family.',
          icon: '⛷️',
          time: '5 min',
          highlight: 'All-season'
        }
      ],
      cta: 'Book Tour Now',
      viewAll: 'See All Destinations'
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-taxi-yellow/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-taxi-yellow to-white">
              {t.title}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-taxi-light-grey/90 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {t.destinations.map((dest, index) => (
            <div
              key={index}
              className="glass-dark backdrop-blur-xl rounded-3xl p-8 hover-lift smooth-transition depth-3 group border border-white/10"
            >
              {/* Icon & Time */}
              <div className="flex justify-between items-start mb-6">
                <div className="text-6xl group-hover:scale-110 smooth-transition">
                  {dest.icon}
                </div>
                <div className="glass-yellow px-4 py-2 rounded-full text-sm font-bold text-taxi-black">
                  🚗 {dest.time}
                </div>
              </div>

              {/* Title & Highlight */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-taxi-yellow smooth-transition">
                  {dest.name}
                </h3>
                <div className="inline-block glass-strong px-3 py-1 rounded-full text-xs font-semibold text-taxi-yellow">
                  ✨ {dest.highlight}
                </div>
              </div>

              {/* Description */}
              <p className="text-taxi-light-grey/90 leading-relaxed mb-6">
                {dest.description}
              </p>

              {/* CTA */}
              <Link href={`/${locale}/book`}>
                <Button variant="glass" size="sm" className="w-full group-hover:bg-taxi-yellow group-hover:text-taxi-black">
                  {locale === 'no' ? 'Bestill Tur' : 'Book Tour'}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center glass-dark backdrop-blur-xl rounded-3xl p-12 depth-4">
          <h3 className="text-3xl font-bold mb-4">
            {locale === 'no' ? 'Klar for eventyret?' : 'Ready for Adventure?'}
          </h3>
          <p className="text-xl text-taxi-light-grey/90 mb-8 max-w-2xl mx-auto">
            {locale === 'no' 
              ? 'Lat oss ta deg til dei vakreste stadane i Voss og omegn. Erfarne sjåførar, komfortable bilar, lokalkunnskap.' 
              : 'Let us take you to the most beautiful places in and around Voss. Experienced drivers, comfortable cars, local expertise.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href={`/${locale}/book`}>
              <Button size="lg" variant="primary" className="w-full sm:w-auto px-12">
                {t.cta}
              </Button>
            </Link>
            <Link href={`/${locale}/destinations`}>
              <Button size="lg" variant="glass" className="w-full sm:w-auto px-12">
                {t.viewAll}
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 animated-gradient" />
    </section>
  );
}
