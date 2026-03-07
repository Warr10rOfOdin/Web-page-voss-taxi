'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface SummerActivitiesProps {
  locale: string;
}

export function SummerActivities({ locale }: SummerActivitiesProps) {
  const content = {
    no: {
      season: 'Mai - September',
      title: 'Sommar i Voss',
      subtitle: 'Opplev actionfylt sommar i eventyrhovudstaden',
      intro: 'Frå mai til september er Voss eit paradis for aktivitetselskarar. Me bringer deg trygt til alle sommarens aktivitetar.',
      activities: [
        {
          title: 'Fallskjermhopping',
          location: 'Voss Airport',
          time: '10 minutt frå sentrum',
          description: 'Spektakulær tandemhopping med utsikt over fjordar og fjell. Eitt av verdens beste dropzone.',
          highlights: ['Tandem', 'AFF-kurs', 'Fantastisk utsikt', 'Erfarne instruktørar']
        },
        {
          title: 'Rafting & Kajak',
          location: 'Stranda/Raundalen',
          time: '15 minutt frå sentrum',
          description: 'Padling i verdsklasse elvane Stranda og Vosso. Frå familievennleg til ekstrem rafting.',
          highlights: ['Alle nivå', 'Familie-rafting', 'Utstyr inkludert', 'Trygt']
        },
        {
          title: 'Fjellvandring',
          location: 'Diverse fjell',
          time: '10-30 minutt frå sentrum',
          description: 'Spektakulære toppturar med panoramautsikt. Frå enkle familieturar til krevjande fjelltoppar.',
          highlights: ['Mange alternativ', 'Guide tilgjengeleg', 'Flott utsikt', 'Alle nivå']
        },
        {
          title: 'Sykling',
          location: 'Rallarvegen m.fl.',
          time: '10-60 minutt frå sentrum',
          description: 'Verdsberømte sykkelvegar gjennom spektakulær natur. Frå flate sykkelvegar til krevjande terrengsykling.',
          highlights: ['Rallarvegen', 'MTB-stigar', 'Sykkelutleige', 'Guide tilgjengeleg']
        },
        {
          title: 'Fossbesøk',
          location: 'Tvindefossen m.fl.',
          time: '15-30 minutt frå sentrum',
          description: 'Besøk nokre av Noregs vakreste fossar. Tvindefossen, Skjervsfossen og fleire spektakulære fossar.',
          highlights: ['Lett tilgjengeleg', 'Fotografering', 'Flotte stiar', 'Naturopplevingar']
        },
        {
          title: 'Fjordcruise',
          location: 'Gudvangen/Flåm',
          time: '45-60 minutt frå sentrum',
          description: 'Opplev UNESCO-lista Nærøyfjorden. Cruise gjennom ein av verdens vakreste fjordar.',
          highlights: ['UNESCO-fjord', 'Heildagstur', 'Fantastisk natur', 'Matservering']
        },
        {
          title: 'Fjelklatring',
          location: 'Diverse klatrefelt',
          time: '10-30 minutt frå sentrum',
          description: 'Klatring i verdskjent kvalitetsfjell. Frå indoor klatreveggar til utfordrande utandørs ruter.',
          highlights: ['Alle nivå', 'Indoor/outdoor', 'Utstyr inkludert', 'Erfarne guider']
        },
        {
          title: 'Fiske',
          location: 'Vangsvatnet m.fl.',
          time: '5-30 minutt frå sentrum',
          description: 'Utmerka fiskemoglegheiter i innsjøar og elvar. Ørret, laks og røye i kristallklart vatn.',
          highlights: ['Lakseelvar', 'Innsjøfiske', 'Fiskekort', 'Guide tilgjengeleg']
        }
      ],
      cta: 'Bestill Transport',
      viewMore: 'Sjå Fleire Aktivitetar'
    },
    en: {
      season: 'May - September',
      title: 'Summer in Voss',
      subtitle: 'Experience action-packed summer in the adventure capital',
      intro: 'From May to September, Voss is a paradise for activity lovers. We bring you safely to all summer activities.',
      activities: [
        {
          title: 'Skydiving',
          location: 'Voss Airport',
          time: '10 minutes from center',
          description: 'Spectacular tandem skydiving with views over fjords and mountains. One of the world\'s best dropzones.',
          highlights: ['Tandem', 'AFF courses', 'Amazing views', 'Expert instructors']
        },
        {
          title: 'Rafting & Kayak',
          location: 'Stranda/Raundalen',
          time: '15 minutes from center',
          description: 'Paddling in world-class rivers Stranda and Vosso. From family-friendly to extreme rafting.',
          highlights: ['All levels', 'Family rafting', 'Equipment included', 'Safe']
        },
        {
          title: 'Mountain Hiking',
          location: 'Various mountains',
          time: '10-30 minutes from center',
          description: 'Spectacular summit hikes with panoramic views. From easy family hikes to challenging mountain peaks.',
          highlights: ['Many options', 'Guide available', 'Great views', 'All levels']
        },
        {
          title: 'Cycling',
          location: 'Rallarvegen & more',
          time: '10-60 minutes from center',
          description: 'World-famous cycling routes through spectacular nature. From flat bike paths to challenging mountain biking.',
          highlights: ['Rallarvegen', 'MTB trails', 'Bike rental', 'Guide available']
        },
        {
          title: 'Waterfall Visits',
          location: 'Tvindefossen & more',
          time: '15-30 minutes from center',
          description: 'Visit some of Norway\'s most beautiful waterfalls. Tvindefossen, Skjervsfossen and more spectacular falls.',
          highlights: ['Easy access', 'Photography', 'Great trails', 'Nature experiences']
        },
        {
          title: 'Fjord Cruise',
          location: 'Gudvangen/Flåm',
          time: '45-60 minutes from center',
          description: 'Experience UNESCO-listed Nærøyfjorden. Cruise through one of the world\'s most beautiful fjords.',
          highlights: ['UNESCO fjord', 'Full day trip', 'Amazing nature', 'Food service']
        },
        {
          title: 'Rock Climbing',
          location: 'Various climbing sites',
          time: '10-30 minutes from center',
          description: 'Climbing in world-renowned quality rock. From indoor climbing walls to challenging outdoor routes.',
          highlights: ['All levels', 'Indoor/outdoor', 'Equipment included', 'Expert guides']
        },
        {
          title: 'Fishing',
          location: 'Lake Vangsvatnet & more',
          time: '5-30 minutes from center',
          description: 'Excellent fishing opportunities in lakes and rivers. Trout, salmon and char in crystal-clear water.',
          highlights: ['Salmon rivers', 'Lake fishing', 'Fishing license', 'Guide available']
        }
      ],
      cta: 'Book Transport',
      viewMore: 'See More Activities'
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden">
      {/* Subtle Background Element */}
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-wider text-emerald-300/80 mb-4 font-semibold">
            {t.season}
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto mb-6" />
          <p className="text-lg md:text-xl text-emerald-100/80 max-w-3xl mx-auto mb-4">
            {t.subtitle}
          </p>
          <p className="text-base text-emerald-200/70 max-w-2xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
            >
              {/* Title & Location */}
              <h3 className="text-lg font-bold mb-2">{activity.title}</h3>
              <div className="text-xs text-emerald-200/70 mb-1">{activity.location}</div>
              <div className="text-xs text-emerald-300/60 mb-4">{activity.time}</div>

              {/* Description */}
              <p className="text-sm text-emerald-100/80 mb-4 leading-relaxed">
                {activity.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {activity.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/10 border border-white/20 rounded-full px-2 py-1 text-emerald-100/90"
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
