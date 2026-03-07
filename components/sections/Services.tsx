'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface ServicesProps {
  locale: string;
}

export function Services({ locale }: ServicesProps) {
  const content = {
    no: {
      title: 'Våre Tenester',
      subtitle: 'Profesjonell taxiservice for alle behov',
      services: [
        {
          icon: '✈️',
          title: 'Flyplasstransport',
          description: 'Komfortabel og påliteleg transport til og frå Bergen Flesland. Me sporer flyet ditt og er klare når du landet.',
          features: ['Døgnopen service', 'Møter deg ved utgangen', 'Hjelp med bagasje', 'Fastpris tilgjengeleg'],
          price: 'Frå 1400kr',
          popular: true
        },
        {
          icon: '🏔️',
          title: 'Sightseeing & Utflukter',
          description: 'Utforsk Voss og omegn med lokale sjåførar som kjenner alle hemmelege perler og historiske stader.',
          features: ['Lokale guider', 'Fleksibel rute', 'Stopp for foto', 'Gruppereduktion'],
          price: 'Frå 800kr/timen',
          popular: false
        },
        {
          icon: '🎿',
          title: 'Vinteraktivitetar',
          description: 'Transport til skisentre, snowboard-areas, og andre vinteraktivitetar. Plass til all utstyret.',
          features: ['Ski-rack', 'Vinterutstyr-transport', 'Flexible tider', 'Gruppe-booking'],
          price: 'Frå 150kr',
          popular: false
        },
        {
          icon: '🏢',
          title: 'Bedriftstransport',
          description: 'Profesjonell transport for møter, konferanser og bedriftsarrangement. Faktura og avtaler tilgjengeleg.',
          features: ['Fastpris avtaler', 'Faktura', 'Prioritert service', 'Flåte-booking'],
          price: 'Kontakt oss',
          popular: false
        },
        {
          icon: '♿',
          title: 'Rullestol-Taxi',
          description: 'Tilgjengeleg transport med spesialutstyr for rullestolbrukarar. Trygg og komfortabel reise.',
          features: ['TT-kort godkjent', 'Løfter og ramper', 'Trent personale', 'Dør-til-dør service'],
          price: 'TT-refusjon',
          popular: false
        },
        {
          icon: '🚐',
          title: 'Maxi Taxi & Minibuss',
          description: 'Stor taxi og minibuss for grupper opp til 16 personar. Perfekt for bryllaup, teamsbuilding og turistgrupper.',
          features: ['8-16 passasjerar', 'Bagasjeplass', 'Komfort-seter', 'USB lading'],
          price: 'Frå 2000kr',
          popular: false
        }
      ],
      cta: 'Bestill No',
      contact: 'Kontakt Oss'
    },
    en: {
      title: 'Our Services',
      subtitle: 'Professional taxi service for all needs',
      services: [
        {
          icon: '✈️',
          title: 'Airport Transfer',
          description: 'Comfortable and reliable transport to and from Bergen Flesland. We track your flight and are ready when you land.',
          features: ['24/7 service', 'Meet & greet', 'Luggage assistance', 'Fixed price available'],
          price: 'From 1400kr',
          popular: true
        },
        {
          icon: '🏔️',
          title: 'Sightseeing & Tours',
          description: 'Explore Voss and surroundings with local drivers who know all the hidden gems and historic sites.',
          features: ['Local guides', 'Flexible route', 'Photo stops', 'Group discounts'],
          price: 'From 800kr/hour',
          popular: false
        },
        {
          icon: '🎿',
          title: 'Winter Activities',
          description: 'Transport to ski resorts, snowboard areas, and other winter activities. Room for all equipment.',
          features: ['Ski racks', 'Winter gear transport', 'Flexible times', 'Group booking'],
          price: 'From 150kr',
          popular: false
        },
        {
          icon: '🏢',
          title: 'Corporate Transport',
          description: 'Professional transport for meetings, conferences and corporate events. Invoicing and agreements available.',
          features: ['Fixed price agreements', 'Invoicing', 'Priority service', 'Fleet booking'],
          price: 'Contact us',
          popular: false
        },
        {
          icon: '♿',
          title: 'Wheelchair Taxi',
          description: 'Accessible transport with specialized equipment for wheelchair users. Safe and comfortable journey.',
          features: ['TT-card approved', 'Lifts and ramps', 'Trained staff', 'Door-to-door service'],
          price: 'TT refund',
          popular: false
        },
        {
          icon: '🚐',
          title: 'Maxi Taxi & Minibus',
          description: 'Large taxi and minibus for groups up to 16 people. Perfect for weddings, team building and tourist groups.',
          features: ['8-16 passengers', 'Luggage space', 'Comfort seats', 'USB charging'],
          price: 'From 2000kr',
          popular: false
        }
      ],
      cta: 'Book Now',
      contact: 'Contact Us'
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-taxi-light-grey/20 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.services.map((service, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 depth-3 hover-lift smooth-transition ${
                service.popular
                  ? 'glass-yellow border-2 border-taxi-yellow'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="glass-dark backdrop-blur-xl px-6 py-2 rounded-full text-sm font-bold text-taxi-yellow depth-glow">
                    ⭐ {locale === 'no' ? 'Mest Populær' : 'Most Popular'}
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="text-7xl mb-6 smooth-transition hover:scale-110">
                {service.icon}
              </div>

              {/* Title & Price */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-taxi-black">
                  {service.title}
                </h3>
                <div className="text-taxi-yellow font-bold text-lg">
                  {service.price}
                </div>
              </div>

              {/* Description */}
              <p className="text-taxi-grey mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start space-x-2 text-sm">
                    <span className="text-taxi-yellow mt-0.5">✓</span>
                    <span className="text-taxi-grey">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href={`/${locale}/book`}>
                <Button
                  variant={service.popular ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-full"
                >
                  {t.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center glass-strong backdrop-blur-xl rounded-3xl p-12 depth-4">
          <h3 className="text-3xl font-bold mb-4 text-taxi-black">
            {locale === 'no' ? 'Spesielle ønskje?' : 'Special Requests?'}
          </h3>
          <p className="text-xl text-taxi-grey mb-8 max-w-2xl mx-auto">
            {locale === 'no'
              ? 'Me kan tilpasse tenestene etter dine behov. Kontakt oss for skreddarsydde løysingar.'
              : 'We can customize our services to your needs. Contact us for tailored solutions.'}
          </p>
          <Link href={`/${locale}/contact`}>
            <Button size="lg" variant="primary" className="px-12">
              {t.contact}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
