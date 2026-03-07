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
      season: 'November - April',
      title: 'Vinter i Voss',
      subtitle: 'Opplev Vest-Noreg sitt beste for vinteraktivitetar',
      intro: 'Frå november til april blir Voss forvandla til eit snødekt vinterlandskap. Me tilbyr trygg og komfortabel transport til alle vinterdestinasjonar.',
      activities: [
        {
          title: 'Alpin Skiing',
          location: 'Voss Resort',
          time: '5 minutt frå sentrum',
          description: 'Eit av Noregs beste alpinsenter med 40 kilometer løyper, moderne heiser, og spektakulær utsikt.',
          highlights: ['26 løyper', 'Moderne anlegg', 'Kveldskjøring', 'Ski-in/ski-out']
        },
        {
          title: 'Snowboard & Freestyle',
          location: 'Voss Resort Snowpark',
          time: '5 minutt frå sentrum',
          description: 'Skandinav ias beste snowpark med rails, jumps og features for alle nivå.',
          highlights: ['Pro-line', 'Beginner-park', 'Halfpipe', 'Rail garden']
        },
        {
          title: 'Bordalsgjelet',
          location: 'Bordalen',
          time: '15 minutt frå sentrum',
          description: 'Spektakulære issøyler og frosne fossar. Eit av Noregs mest fotograferte vinterlandskap.',
          highlights: ['Issøylar', 'Lett tilgjengeleg', 'Fotografering', 'Guide tilgjengeleg']
        },
        {
          title: 'Langrenn & Skitur',
          location: 'Diverse stader',
          time: '10-30 minutt frå sentrum',
          description: 'Over 200 kilometer med preparerte løyper rundt Voss. Frå lette turløyper til krevjande fjelløyper.',
          highlights: ['200+ km løyper', 'Variert terreng', 'Flombelyst', 'Utleige tilgjengeleg']
        },
        {
          title: 'Isfjelklatring',
          location: 'Diverse fossar',
          time: '15-40 minutt frå sentrum',
          description: 'Klatre opp frosne fossar med erfarne guider. Spektakulær vinteroppleving.',
          highlights: ['Alle nivå', 'Erfarne guider', 'Utstyr inkludert', 'Trygt']
        },
        {
          title: 'Hundeslede',
          location: 'Voss omegn',
          time: '20 minutt frå sentrum',
          description: 'Klasisk norsk vinteroppleving. Gli gjennom vinterlandskapet med sibirsk husky.',
          highlights: ['Halvdag/heldag', 'Familievennleg', 'Husky-farm besøk', 'Lunch inkludert']
        }
      ],
      cta: 'Bestill Transport',
      viewMore: 'Sjå Fleire Aktivitetar'
    },
    en: {
      season: 'November - April',
      title: 'Winter in Voss',
      subtitle: 'Experience Western Norway\'s best winter activities',
      intro: 'From November to April, Voss transforms into a snow-covered winter landscape. We offer safe and comfortable transport to all winter destinations.',
      activities: [
        {
          title: 'Alpine Skiing',
          location: 'Voss Resort',
          time: '5 minutes from center',
          description: 'One of Norway\'s best alpine centers with 40 kilometers of slopes, modern lifts, and spectacular views.',
          highlights: ['26 slopes', 'Modern facilities', 'Evening skiing', 'Ski-in/ski-out']
        },
        {
          title: 'Snowboard & Freestyle',
          location: 'Voss Resort Snowpark',
          time: '5 minutes from center',
          description: 'Scandinavia\'s best snowpark with rails, jumps and features for all levels.',
          highlights: ['Pro-line', 'Beginner-park', 'Halfpipe', 'Rail garden']
        },
        {
          title: 'Bordalsgjelet',
          location: 'Bordalen',
          time: '15 minutes from center',
          description: 'Spectacular ice pillars and frozen waterfalls. One of Norway\'s most photographed winter landscapes.',
          highlights: ['Ice pillars', 'Easy access', 'Photography', 'Guide available']
        },
        {
          title: 'Cross-country Skiing',
          location: 'Various locations',
          time: '10-30 minutes from center',
          description: 'Over 200 kilometers of groomed trails around Voss. From easy touring trails to challenging mountain routes.',
          highlights: ['200+ km trails', 'Varied terrain', 'Lit trails', 'Rental available']
        },
        {
          title: 'Ice Climbing',
          location: 'Various waterfalls',
          time: '15-40 minutes from center',
          description: 'Climb frozen waterfalls with experienced guides. Spectacular winter experience.',
          highlights: ['All levels', 'Expert guides', 'Equipment included', 'Safe']
        },
        {
          title: 'Dog Sledding',
          location: 'Voss area',
          time: '20 minutes from center',
          description: 'Classic Norwegian winter experience. Glide through winter landscapes with Siberian huskies.',
          highlights: ['Half/full day', 'Family friendly', 'Husky farm visit', 'Lunch included']
        }
      ],
      cta: 'Book Transport',
      viewMore: 'See More Activities'
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white overflow-hidden">
      {/* Subtle Background Element */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-wider text-blue-300/80 mb-4 font-semibold">
            {t.season}
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-6" />
          <p className="text-lg md:text-xl text-blue-100/80 max-w-3xl mx-auto mb-4">
            {t.subtitle}
          </p>
          <p className="text-base text-blue-200/70 max-w-2xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {t.activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
            >
              {/* Title & Location */}
              <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
              <div className="text-sm text-blue-200/70 mb-1">{activity.location}</div>
              <div className="text-xs text-blue-300/60 mb-4">{activity.time}</div>

              {/* Description */}
              <p className="text-sm text-blue-100/80 mb-4 leading-relaxed">
                {activity.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {activity.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/10 border border-white/20 rounded-full px-3 py-1 text-blue-100/90"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href={`/${locale}/book`}>
            <Button size="lg" variant="primary" className="px-8 py-4">
              {t.cta}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
