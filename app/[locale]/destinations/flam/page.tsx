import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function FlamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Flåm',
      subtitle: 'Flåmsbana og Aurlandsfjorden',
      description: 'Flåm er ein liten landsby i Aurland kommune, mest kjend for Flåmsbana - ei av verdas brattaste togstrekningar på normalskinne. Landsbyen ligg ved enden av Aurlandsfjorden, ein arm av Sognefjorden.',
      history: {
        title: 'Historie',
        content: `Flåmsbana vart bygd mellom 1923 og 1940 og er eit teknisk mesterverk. På berre 20 kilometer stig banen 863 høgdemeter, frå Flåm ved fjorden til Myrdal på fjellet. Dette gir ein stigning på 55 promille, noko som gjer det til ei av dei brattaste jernbanelinjene i verda på normalskinne.

Byggjinga av banen var ekstremt utfordrande, med 20 tunellar som utgjer 80% av strekninga. På den tid vart mykje av arbeidet gjort for hand, og banen tok 17 år å fullføre.

I dag er Flåmsbana ei av Noregs mest populære turistattraksjonar, med over ein million passasjerar årleg. Togturen gir spektakulære utsyn over fjell, fossar og dalar, inkludert den imponerande Kjosfossen som tøyet fell 225 meter ned.`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          'Flåmsbana - ei av verdas brattaste jernbaner',
          'Spektakulær togtur med 20 tunnellar',
          'Kjosfossen - 225 meter høg foss',
          'Aurlandsfjorden og Sognefjorden',
          'Flåm Railway Museum',
          'Kayakk og fjordcruise',
          'Stegastein utsiktspunkt (30 min køyring)',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Avstand frå Voss: Ca. 70 km',
          'Køyretid: Ca. 1-1.5 timar',
          'Flåmsbana: Ca. 1 time kvar veg',
          'Anbefalt opphald: 3-5 timar',
          'Billettar: Kjøp på flaamsbana.no',
          'Best tid: Mai - september',
        ],
      },
      price: 'Frå 1800 NOK per tur',
      bookTour: 'Bestill tur til Flåm',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Flåm',
      subtitle: 'Flåm Railway and Aurlandsfjord',
      description: 'Flåm is a small village in Aurland municipality, best known for the Flåm Railway - one of the world\'s steepest railway lines on normal gauge. The village is located at the end of the Aurlandsfjord, an arm of the Sognefjord.',
      history: {
        title: 'History',
        content: `The Flåm Railway was built between 1923 and 1940 and is a technical masterpiece. Over just 20 kilometers, the railway climbs 863 meters in elevation, from Flåm at the fjord to Myrdal on the mountain. This gives a gradient of 55 per mille, making it one of the steepest railway lines in the world on normal gauge.

The construction of the railway was extremely challenging, with 20 tunnels making up 80% of the route. At the time, much of the work was done by hand, and the railway took 17 years to complete.

Today, the Flåm Railway is one of Norway's most popular tourist attractions, with over one million passengers annually. The train journey offers spectacular views of mountains, waterfalls and valleys, including the impressive Kjosfossen where the water drops 225 meters.`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          'Flåm Railway - one of the world\'s steepest railways',
          'Spectacular train journey with 20 tunnels',
          'Kjosfossen - 225 meter waterfall',
          'Aurlandsfjord and Sognefjord',
          'Flåm Railway Museum',
          'Kayaking and fjord cruises',
          'Stegastein viewpoint (30 min drive)',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Distance from Voss: Approx. 70 km',
          'Driving time: Approx. 1-1.5 hours',
          'Flåm Railway: Approx. 1 hour each way',
          'Recommended stay: 3-5 hours',
          'Tickets: Buy at flaamsbana.no',
          'Best time: May - September',
        ],
      },
      price: 'From 1800 NOK per tour',
      bookTour: 'Book tour to Flåm',
      backToDestinations: 'Back to all destinations',
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        {/* Back button */}
        <Link
          href={`/${locale}/tourist`}
          className="inline-flex items-center text-taxi-grey hover:text-taxi-yellow transition-colors mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t.backToDestinations}
        </Link>

        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
          <img
            src="/images/20230502_184245.jpg"
            alt="Flåm"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-taxi-black/80 via-taxi-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-5xl font-display font-bold mb-2 drop-shadow-lg">{t.title}</h1>
              <p className="text-xl opacity-90 drop-shadow-lg">{t.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <p className="text-lg text-taxi-grey leading-relaxed">
                {t.description}
              </p>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">
                {t.history.title}
              </h2>
              <div className="text-taxi-grey leading-relaxed whitespace-pre-line">
                {t.history.content}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">
                {t.highlights.title}
              </h2>
              <ul className="space-y-3">
                {t.highlights.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-taxi-yellow mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-taxi-grey">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">
                {locale === 'no' ? 'Bilete' : 'Photos'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  '/images/20230502_184245.jpg',
                  '/images/20230502_184337.jpg',
                  '/images/20221120_001238.jpg',
                  '/images/20240523_140830.jpg'
                ].map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden">
                    <img src={img} alt={`Flåm ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Practical Info */}
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h3 className="text-2xl font-display font-bold mb-4">
                {t.info.title}
              </h3>
              <ul className="space-y-3 mb-6">
                {t.info.items.map((item, index) => (
                  <li key={index} className="text-sm text-taxi-grey flex items-start">
                    <svg
                      className="w-5 h-5 text-taxi-yellow mt-0.5 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="bg-taxi-yellow/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-taxi-grey font-medium mb-1">
                  {locale === 'no' ? 'Prisestimat' : 'Price estimate'}
                </p>
                <p className="text-2xl font-bold text-taxi-black">{t.price}</p>
                <p className="text-xs text-taxi-grey mt-1">
                  {locale === 'no' ? 'Varierer etter sesong og gruppe' : 'Varies by season and group'}
                </p>
              </div>

              <div className="border-t border-taxi-light-grey pt-6 space-y-3">
                <Link href={`/${locale}/book`}>
                  <Button className="w-full" size="lg">
                    {t.bookTour}
                  </Button>
                </Link>
                <a href="tel:+4756511340">
                  <Button className="w-full" size="lg" variant="secondary">
                    {locale === 'no' ? 'Ring No' : 'Call Now'}: +47 56 51 13 40
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
