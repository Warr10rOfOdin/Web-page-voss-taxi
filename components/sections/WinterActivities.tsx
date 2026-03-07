'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface WinterActivitiesProps {
  locale: string;
}

export function WinterActivities({ locale }: WinterActivitiesProps) {
  const content = {
    no: {
      title: 'Vinter i Voss',
      subtitle: 'Vintereventyr i hjartet av Vestlandet',
      intro: 'Frå november til april blir Voss forvandla til eit snødekt vintereventyrland. Spektakulære skiløyper, frosen fossar, og magiske vinterlandskap ventar på deg.',
      activities: [
        {
          icon: '⛷️',
          title: 'Alpin Skiing',
          location: 'Voss Resort',
          time: '5 min',
          description: 'Eit av Noregs beste alpinsenter med 40km med løyper, moderne heiser, og fantastisk utsikt over Vangsvatnet.',
          highlights: ['26 løyper', 'Verdsklasse snowpark', 'Kveldskjøring', 'Ski-in/ski-out']
        },
        {
          icon: '🏂',
          title: 'Snowboard & Freestyle',
          location: 'Voss Resort Snowpark',
          time: '5 min',
          description: 'Skandinavias beste snowpark med rails, jumps og features for alle nivå. Perfekt for freestyleentusiastar.',
          highlights: ['Pro-line', 'Beginner-park', 'Halfpipe', 'Rail garden']
        },
        {
          icon: '❄️',
          title: 'Bordalsgjelet',
          location: 'Bordalen',
          time: '15 min',
          description: 'Spektakulær issøyler og frosne fossar. Eit av Noregs mest fotograferte vinterlandskap. Absolutt must-see!',
          highlights: ['Magiske issøylar', 'Lett tilgjengeleg', 'Fantastisk foto', 'Guide tilgjengeleg']
        },
        {
          icon: '🎿',
          title: 'Langrenn & Skitur',
          location: 'Diverse stader',
          time: '10-30 min',
          description: 'Over 200km med preparerte løyper rundt Voss. Frå lette turløyper til krevjande fjelløyper.',
          highlights: ['200km+ løyper', 'Variert terreng', 'Flombelyst', 'Utleige av utstyr']
        },
        {
          icon: '🧗',
          title: 'Isfjelklatring',
          description: 'Klatre opp frosne fossar med erfarne guider. Eitt av dei mest spektakulære vinteropplevingane.',
          location: 'Diverse fossar',
          time: '15-40 min',
          highlights: ['Alle nivå', 'Erfarne guider', 'Utstyr inkludert', 'Unik oppleving']
        },
        {
          icon: '🛷',
          title: 'Hundeslede & Vintereventur',
          location: 'Voss omegn',
          time: '20 min',
          description: 'Klasisk norsk vinteroppleving. Gli gjennom vinterlandskapet med sibirsk husky.',
          highlights: ['Halvdag/heldag', 'Familievennleg', 'Husky-farm besøk', 'Tradisjonell lunch']
        }
      ],
      cta: 'Bestill Transport',
      viewDestinations: 'Sjå Alle Destinasjonar'
    },
    en: {
      title: 'Winter in Voss',
      subtitle: 'Winter adventures in the heart of Western Norway',
      intro: 'From November to April, Voss transforms into a snow-covered winter wonderland. Spectacular ski slopes, frozen waterfalls, and magical winter landscapes await you.',
      activities: [
        {
          icon: '⛷️',
          title: 'Alpine Skiing',
          location: 'Voss Resort',
          time: '5 min',
          description: 'One of Norway\'s best alpine centers with 40km of slopes, modern lifts, and fantastic views over Lake Vangsvatnet.',
          highlights: ['26 slopes', 'World-class snowpark', 'Evening skiing', 'Ski-in/ski-out']
        },
        {
          icon: '🏂',
          title: 'Snowboard & Freestyle',
          location: 'Voss Resort Snowpark',
          time: '5 min',
          description: 'Scandinavia\'s best snowpark with rails, jumps and features for all levels. Perfect for freestyle enthusiasts.',
          highlights: ['Pro-line', 'Beginner-park', 'Halfpipe', 'Rail garden']
        },
        {
          icon: '❄️',
          title: 'Bordalsgjelet',
          location: 'Bordalen',
          time: '15 min',
          description: 'Spectacular ice pillars and frozen waterfalls. One of Norway\'s most photographed winter landscapes. Absolute must-see!',
          highlights: ['Magic ice pillars', 'Easy access', 'Amazing photos', 'Guide available']
        },
        {
          icon: '🎿',
          title: 'Cross-country & Ski Touring',
          location: 'Various locations',
          time: '10-30 min',
          description: 'Over 200km of groomed trails around Voss. From easy touring trails to challenging mountain routes.',
          highlights: ['200km+ trails', 'Varied terrain', 'Lit trails', 'Equipment rental']
        },
        {
          icon: '🧗',
          title: 'Ice Climbing',
          location: 'Various waterfalls',
          time: '15-40 min',
          description: 'Climb frozen waterfalls with experienced guides. One of the most spectacular winter experiences.',
          highlights: ['All levels', 'Expert guides', 'Equipment included', 'Unique experience']
        },
        {
          icon: '🛷',
          title: 'Dog Sledding & Winter Adventure',
          location: 'Voss area',
          time: '20 min',
          description: 'Classic Norwegian winter experience. Glide through winter landscapes with Siberian huskies.',
          highlights: ['Half/full day', 'Family friendly', 'Husky farm visit', 'Traditional lunch']
        }
      ],
      cta: 'Book Transport',
      viewDestinations: 'See All Destinations'
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Animated Snow Effect Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl float" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-blue-300/5 rounded-full blur-3xl" style={{ animation: 'float 10s ease-in-out infinite reverse' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white/5 rounded-full blur-3xl float" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass-dark backdrop-blur-xl px-8 py-3 rounded-full mb-6 depth-2">
            <span className="text-blue-300 font-bold">❄️ {locale === 'no' ? 'November - April' : 'November - April'}</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white">
              {t.title}
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-blue-100 mb-6 font-semibold">
            {t.subtitle}
          </p>
          <p className="text-lg text-blue-200/90 max-w-4xl mx-auto leading-relaxed">
            {t.intro}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {t.activities.map((activity, index) => (
            <div
              key={index}
              className="glass-dark backdrop-blur-xl rounded-3xl p-8 depth-3 hover-lift smooth-transition border border-white/10 group"
            >
              {/* Icon & Time */}
              <div className="flex justify-between items-start mb-6">
                <div className="text-6xl group-hover:scale-110 smooth-transition">
                  {activity.icon}
                </div>
                <div className="glass-strong px-4 py-2 rounded-full text-sm font-bold text-blue-200">
                  🚗 {activity.time}
                </div>
              </div>

              {/* Title & Location */}
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-300 smooth-transition">
                {activity.title}
              </h3>
              <p className="text-sm text-blue-300 mb-4">📍 {activity.location}</p>

              {/* Description */}
              <p className="text-blue-100/90 mb-6 leading-relaxed">
                {activity.description}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-2">
                {activity.highlights.map((highlight, hIndex) => (
                  <div
                    key={hIndex}
                    className="glass-strong px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 text-center"
                  >
                    ✓ {highlight}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="glass-dark backdrop-blur-xl rounded-3xl p-12 depth-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'no' ? 'Klar for vintereventyret?' : 'Ready for Winter Adventure?'}
          </h3>
          <p className="text-xl text-blue-100/90 mb-8 max-w-3xl mx-auto">
            {locale === 'no'
              ? 'Lat oss ta deg til dei beste vinteropplevingane. Erfarne sjåførar, trygge vinterbilar, lokalkunnskap.'
              : 'Let us take you to the best winter experiences. Experienced drivers, safe winter cars, local expertise.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href={`/${locale}/book`}>
              <Button size="lg" variant="primary" className="w-full sm:w-auto px-12">
                {t.cta}
              </Button>
            </Link>
            <Link href={`/${locale}/destinations`}>
              <Button size="lg" variant="glass" className="w-full sm:w-auto px-12">
                {t.viewDestinations}
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-white to-blue-500" />
    </section>
  );
}
