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
      title: 'Sommar i Voss',
      subtitle: 'Naturens vakraste sesong',
      intro: 'Frå mai til september blomstrar Voss med grøne fjell, klårt vatn og midnattsol. Opplev spektakulær natur, ekstremsport og roleg naturliv.',
      activities: [
        {
          icon: '🪂',
          title: 'Fallskjermhopping',
          location: 'Voss',
          time: '0 min',
          description: 'Voss er verdskjent for fallskjermhopping! Opplev det ultimate adrenalin-rushet med spektakulær utsikt over fjordar og fjell.',
          highlights: ['Tandem-hopp', 'Instruktørar', 'Video inkludert', '3000m høgde']
        },
        {
          icon: '🚣',
          title: 'Rafting & Kajakk',
          location: 'Stranda/Raundalen',
          time: '15 min',
          description: 'Spektakulær rafting i verdskjente elvar. Frå roleg familierafting til ekstrem whitewater for ekspertar.',
          highlights: ['Nivå 1-5 fossar', 'Guide & utstyr', 'Alle nivå', 'Mai-September']
        },
        {
          icon: '🥾',
          title: 'Fjellvandring',
          location: 'Diverse fjellområde',
          time: '5-60 min',
          description: 'Hundrevis av merka stiar frå lette turar til krevjande toppturar. Spektakulær utsikt garantert!',
          highlights: ['Alle nivå', 'Spektakulær utsikt', 'Midnight sun', 'Guide tilgjengeleg']
        },
        {
          icon: '🚴',
          title: 'Sykling & Mountain Bike',
          location: 'Voss Bike Park & stiar',
          time: '5 min',
          description: 'Skandinavias lengste downhill-løype og hundrevis av kilometer med mountain bike-stiar.',
          highlights: ['Bike park', 'Utleige', 'Guidea turar', 'E-bike tilgjengeleg']
        },
        {
          icon: '💧',
          title: 'Fossebesøk',
          location: 'Tvindefossen m.fl.',
          time: '10-30 min',
          description: 'Besøk dei mest spektakulære fossane i området. Tvindefossen (152m) er ein av dei finaste i Noreg.',
          highlights: ['Lett tilgjengeleg', 'Foto-paradise', 'Kort gå-tur', 'Familievennleg']
        },
        {
          icon: '⛵',
          title: 'Fjord-Cruise',
          location: 'Sognefjorden',
          time: '60 min',
          description: 'Dagstur til verdas djupaste og lengste fjord. Opplev majestiske fjell som reiser seg rett frå havet.',
          highlights: ['UNESCO område', 'Flåmsbana', 'Lunch inkludert', 'Heildag-tur']
        },
        {
          icon: '🎣',
          title: 'Fiske',
          location: 'Vangsvatnet & elvar',
          time: '2 min',
          description: 'Verdskjent laksefiske og fantastisk ørretfiske i kristallklare fjellvatn og elvar.',
          highlights: ['Laks & ørret', 'Fiskekort', 'Guide tilgjengeleg', 'Båtutleige']
        },
        {
          icon: '🧗',
          title: 'Klatring',
          location: 'Diverse klatrefelt',
          time: '10-40 min',
          description: 'Spektakulære klatrefelt med ruter for alle nivå. Via ferrata for familiane.',
          highlights: ['Sport climbing', 'Via ferrata', 'Kurs', 'Utstyr-utleige']
        }
      ],
      cta: 'Bestill Transport',
      viewDestinations: 'Sjå Alle Destinasjonar'
    },
    en: {
      title: 'Summer in Voss',
      subtitle: 'Nature\'s Most Beautiful Season',
      intro: 'From May to September, Voss blooms with green mountains, crystal-clear water and midnight sun. Experience spectacular nature, extreme sports and peaceful wilderness.',
      activities: [
        {
          icon: '🪂',
          title: 'Skydiving',
          location: 'Voss',
          time: '0 min',
          description: 'Voss is world-famous for skydiving! Experience the ultimate adrenaline rush with spectacular views over fjords and mountains.',
          highlights: ['Tandem jumps', 'Instructors', 'Video included', '3000m altitude']
        },
        {
          icon: '🚣',
          title: 'Rafting & Kayak',
          location: 'Stranda/Raundalen',
          time: '15 min',
          description: 'Spectacular rafting in world-famous rivers. From gentle family rafting to extreme whitewater for experts.',
          highlights: ['Level 1-5 rapids', 'Guide & equipment', 'All levels', 'May-September']
        },
        {
          icon: '🥾',
          title: 'Mountain Hiking',
          location: 'Various mountain areas',
          time: '5-60 min',
          description: 'Hundreds of marked trails from easy walks to challenging summit hikes. Spectacular views guaranteed!',
          highlights: ['All levels', 'Spectacular views', 'Midnight sun', 'Guide available']
        },
        {
          icon: '🚴',
          title: 'Cycling & Mountain Bike',
          location: 'Voss Bike Park & trails',
          time: '5 min',
          description: 'Scandinavia\'s longest downhill track and hundreds of kilometers of mountain bike trails.',
          highlights: ['Bike park', 'Rental', 'Guided tours', 'E-bike available']
        },
        {
          icon: '💧',
          title: 'Waterfall Visits',
          location: 'Tvindefossen etc.',
          time: '10-30 min',
          description: 'Visit the most spectacular waterfalls in the area. Tvindefossen (152m) is one of Norway\'s finest.',
          highlights: ['Easy access', 'Photo paradise', 'Short walk', 'Family friendly']
        },
        {
          icon: '⛵',
          title: 'Fjord Cruise',
          location: 'Sognefjord',
          time: '60 min',
          description: 'Day trip to the world\'s deepest and longest fjord. Experience majestic mountains rising straight from the sea.',
          highlights: ['UNESCO area', 'Flåm Railway', 'Lunch included', 'Full-day tour']
        },
        {
          icon: '🎣',
          title: 'Fishing',
          location: 'Lake Vangsvatnet & rivers',
          time: '2 min',
          description: 'World-famous salmon fishing and fantastic trout fishing in crystal-clear mountain lakes and rivers.',
          highlights: ['Salmon & trout', 'Fishing permit', 'Guide available', 'Boat rental']
        },
        {
          icon: '🧗',
          title: 'Climbing',
          location: 'Various climbing areas',
          time: '10-40 min',
          description: 'Spectacular climbing areas with routes for all levels. Via ferrata for families.',
          highlights: ['Sport climbing', 'Via ferrata', 'Courses', 'Equipment rental']
        }
      ],
      cta: 'Book Transport',
      viewDestinations: 'See All Destinations'
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-96 h-96 bg-green-300/10 rounded-full blur-3xl float" />
        <div className="absolute top-40 left-20 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl" style={{ animation: 'float 10s ease-in-out infinite reverse' }} />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl float" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass-dark backdrop-blur-xl px-8 py-3 rounded-full mb-6 depth-2">
            <span className="text-green-300 font-bold">☀️ {locale === 'no' ? 'Mai - September' : 'May - September'}</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-green-200 to-white">
              {t.title}
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-green-100 mb-6 font-semibold">
            {t.subtitle}
          </p>
          <p className="text-lg text-green-200/90 max-w-4xl mx-auto leading-relaxed">
            {t.intro}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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
                <div className="glass-strong px-4 py-2 rounded-full text-sm font-bold text-green-200">
                  🚗 {activity.time}
                </div>
              </div>

              {/* Title & Location */}
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-green-300 smooth-transition">
                {activity.title}
              </h3>
              <p className="text-sm text-green-300 mb-4">📍 {activity.location}</p>

              {/* Description */}
              <p className="text-green-100/90 mb-6 leading-relaxed text-sm">
                {activity.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                {activity.highlights.map((highlight, hIndex) => (
                  <div
                    key={hIndex}
                    className="glass-strong px-3 py-1.5 rounded-lg text-xs font-semibold text-green-200"
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
            {locale === 'no' ? 'Klar for sommareventyret?' : 'Ready for Summer Adventure?'}
          </h3>
          <p className="text-xl text-green-100/90 mb-8 max-w-3xl mx-auto">
            {locale === 'no'
              ? 'Lat oss ta deg til dei beste sommaropplevingane. Erfarne sjåførar, komfortable bilar, lokalkunnskap.'
              : 'Let us take you to the best summer experiences. Experienced drivers, comfortable cars, local expertise.'}
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
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-yellow-400 to-green-500" />
    </section>
  );
}
