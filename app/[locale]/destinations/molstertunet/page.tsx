import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function MolstertunetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Mølstertunet',
      subtitle: 'Voss Folkemuseum - autentisk kulturhistorie',
      description: 'Voss Folkemuseum på Mølster vart grunnlagt i 1917 og er ein av tre autentiske gårdstun som museet eig og konserverer. Her står alle bygningane framleis akkurat der dei var då folk budde der.',
      history: {
        title: 'Historie',
        content: `Voss Folkemuseum si første oppgåve var å kjøpe gårdstun på Mølster. I dag er dette ein av tre autentiske gårdstun som eies og konservert av museet, der alle bygningane framleis er plassert akkurat der dei var då folk bodde der.

På Mølster gård, som lett kan sjåast i åssiden ovanfor Vossevangen, er det ein nyare museumsbygning. Her finn du permanente og midlertidige utstillingar som gir den besøkande større kunnskap om den lokale kulturen.

Det er også ein museumsbutikk, og om sommaren har dei vanlegvis høner og sauer på gården. Dette gir særleg born ein heilskapleg oppleving av korleis livet på ein gard var før i tida.`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          'Autentisk gårdstun frå 1917',
          'Originale bygningar på opprinnelig plass',
          'Permanente og midlertidige utstillingar',
          'Museumsbutikk',
          'Levande gård med dyr om sommaren',
          'Flott utsikt over Vossevangen',
          'Lett tilgjengeleg til fots eller med bil',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Avstand frå Voss sentrum: 2-3 km',
          'Køyretid: 5-10 minutt',
          'Kan også nås til fots',
          'Opningstider: Varierer etter sesong',
          'Best tid: Mai - september',
          'Eigna for familiar og grupper',
        ],
      },
      price: 'Frå 500 NOK per tur',
      bookTour: 'Bestill tur til Mølstertunet',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Mølstertunet',
      subtitle: 'Voss Folk Museum - authentic cultural history',
      description: 'The Voss Folk Museum at Mølster was founded in 1917 and is one of three authentic farmsteads that the museum owns and preserves. Here, all the buildings still stand exactly where they were when people lived there.',
      history: {
        title: 'History',
        content: `The first task of the Voss Folk Museum was to purchase the farmstead at Mølster. Today, this is one of three authentic farmsteads owned and preserved by the museum, where all the buildings are still located exactly where they were when people lived there.

At Mølster farm, which can easily be seen on the hillside above Vossevangen, there is a newer museum building. Here you will find permanent and temporary exhibitions that give visitors greater knowledge about the local culture.

There is also a museum shop, and in summer they usually have chickens and sheep on the farm. This gives children in particular a holistic experience of what life on a farm was like in the past.`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          'Authentic farmstead from 1917',
          'Original buildings in original location',
          'Permanent and temporary exhibitions',
          'Museum shop',
          'Living farm with animals in summer',
          'Great view over Vossevangen',
          'Easily accessible on foot or by car',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Distance from Voss center: 2-3 km',
          'Driving time: 5-10 minutes',
          'Can also be reached on foot',
          'Opening hours: Varies by season',
          'Best time: May - September',
          'Suitable for families and groups',
        ],
      },
      price: 'From 500 NOK per tour',
      bookTour: 'Book tour to Mølstertunet',
      backToDestinations: 'Back to all destinations',
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        <Link href={\`/\${locale}/tourist\`} className="inline-flex items-center text-taxi-grey hover:text-taxi-yellow transition-colors mb-8">
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
