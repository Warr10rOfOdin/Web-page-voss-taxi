import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function TvindefossenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Tvindefossen',
      subtitle: 'Legendarisk foss med foryngelseskrefter',
      description: 'Tvindefossen er den 98. høyeste fossen i Norge regnet ut frå totalt fall, med eit fall på 110 meter. Fossen er ein kjent turistattraksjon like ved E-16, og er berømt for det legendariske vannet med foryngande krefter.',
      history: {
        title: 'Historie og legende',
        content: \`Tvindefossen ligg ved Tvinde i Voss kommune, 12 km nord for Voss sentrum. Vannet frå fossen kjem frå Kroelva og renn ut i Strandaelva. Det lengste fallet er 85 meter, noko som gjer fossen til eit spektakulært syn.

På slutten av 1990-talet skapte vatnet i Tvindefossen eit rykte for foryngelse og gjenoppliving av seksuell styrke. Dette gjorde det til ein av dei viktigaste naturlege turistattraksjonane i Vest-Norge, med så mange som 200 000 menneske i året frå USA, Japan og Russland som besøkte og fylte containere med vannet.

På eit tidspunkt var det Norges niende mest besøkte naturlige attraksjon, med 272 000 besøkende. I dag er fossen framleis populær, både for sin naturlege skjønnheit og den fascinerende historia.\`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          '110 meter totalt fall',
          '85 meter lengste fall',
          'Legendarisk foryngelsesvatn',
          'Like ved E-16, lett tilgjengeleg',
          'Kafé og fasiliteter',
          'Populær fotograferingsplass',
          'Naturskjønn omgjevnad',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Avstand frå Voss: Ca. 12 km nord',
          'Køyretid: Ca. 15-20 minutt',
          'Parkering: Gratis parkering ved fossen',
          'Tilgjengeleg: Heile året',
          'Fasiliteter: Kafé, toalett, souvenirbutikk',
          'Brudepar: Populær brudekjole-tradisjon',
        ],
      },
      price: 'Frå 600 NOK per tur',
      bookTour: 'Bestill tur til Tvindefossen',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Tvindefossen',
      subtitle: 'Legendary waterfall with rejuvenation powers',
      description: 'Tvindefossen is the 98th highest waterfall in Norway by total drop, with a fall of 110 meters. The waterfall is a well-known tourist attraction right by Highway E-16, and is famous for its legendary water with rejuvenating powers.',
      history: {
        title: 'History and legend',
        content: \`Tvindefossen is located at Tvinde in Voss municipality, 12 km north of Voss center. The water from the waterfall comes from the Kroelva river and flows into the Strandaelva. The longest drop is 85 meters, making the waterfall a spectacular sight.

In the late 1990s, the water in Tvindefossen created a reputation for rejuvenation and revival of sexual strength. This made it one of the most important natural tourist attractions in Western Norway, with as many as 200,000 people per year from the USA, Japan and Russia visiting and filling containers with the water.

At one point it was Norway\\'s ninth most visited natural attraction, with 272,000 visitors. Today, the waterfall is still popular, both for its natural beauty and the fascinating history.\`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          '110 meters total drop',
          '85 meters longest drop',
          'Legendary rejuvenation water',
          'Right by Highway E-16, easily accessible',
          'Café and facilities',
          'Popular photography spot',
          'Beautiful natural surroundings',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Distance from Voss: Approx. 12 km north',
          'Driving time: Approx. 15-20 minutes',
          'Parking: Free parking at the waterfall',
          'Available: All year',
          'Facilities: Café, toilet, souvenir shop',
          'Bridal couples: Popular bridal dress tradition',
        ],
      },
      price: 'From 600 NOK per tour',
      bookTour: 'Book tour to Tvindefossen',
      backToDestinations: 'Back to all destinations',
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        <Link
          href={\`/\${locale}/tourist\`}
          className="inline-flex items-center text-taxi-grey hover:text-taxi-yellow transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.backToDestinations}
        </Link>

        <div className="relative h-96 bg-gradient-to-br from-taxi-grey to-taxi-black rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-taxi-yellow/10" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h1 className="text-5xl font-display font-bold mb-2">{t.title}</h1>
              <p className="text-xl opacity-90">{t.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <p className="text-lg text-taxi-grey leading-relaxed">{t.description}</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">{t.history.title}</h2>
              <div className="text-taxi-grey leading-relaxed whitespace-pre-line">{t.history.content}</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">{t.highlights.title}</h2>
              <ul className="space-y-3">
                {t.highlights.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-taxi-yellow mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-taxi-grey">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">{locale === 'no' ? 'Bilete' : 'Photos'}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-gradient-to-br from-taxi-grey to-taxi-black rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h3 className="text-2xl font-display font-bold mb-4">{t.info.title}</h3>
              <ul className="space-y-3 mb-6">
                {t.info.items.map((item, index) => (
                  <li key={index} className="text-sm text-taxi-grey flex items-start">
                    <svg className="w-5 h-5 text-taxi-yellow mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="bg-taxi-yellow/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-taxi-grey font-medium mb-1">{locale === 'no' ? 'Prisestimat' : 'Price estimate'}</p>
                <p className="text-2xl font-bold text-taxi-black">{t.price}</p>
                <p className="text-xs text-taxi-grey mt-1">{locale === 'no' ? 'Varierer etter sesong og gruppe' : 'Varies by season and group'}</p>
              </div>

              <div className="border-t border-taxi-light-grey pt-6 space-y-3">
                <Link href={\`/\${locale}/book\`}>
                  <Button className="w-full" size="lg">{t.bookTour}</Button>
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
