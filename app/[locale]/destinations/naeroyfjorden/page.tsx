import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function NaeroyfjordenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Nærøyfjorden',
      subtitle: 'UNESCO Verdensarvfjord',
      description: 'Nærøyfjorden er ein av verdas vakreste og mest dramatiske fjordarmar. Fjorden er ein del av UNESCO Verdensarven Vestnorsk fjordlandskap og strekker seg 17 km frå Gudvangen til Styvi.',
      history: {
        title: 'Historie og verdensarv',
        content: `Nærøyfjorden vart kåra til UNESCO Verdensarv i 2005, saman med Geirangerfjorden. Fjorden er omgitt av høge, bratte fjell som når opptil 1400 meter, med spektakulære fossar som rasar ned fjellsidene.

Namnet kjem frå det norrøne "Njörvasund", som tyder "den smale sundet". På det smalaste er fjorden berre 250 meter brei, noko som gir ein dramatisk kjensle av å vere omslutta av naturen.

Området har vore busett sidan vikingtida, og det er fleire gamle gardar langs fjorden. Den historiske postvegen mellom Oslo og Bergen gjekk også gjennom dette området.`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          'UNESCO Verdensarv sidan 2005',
          'Fjell opptil 1400 meter på kvar side',
          'Spektakulære fossar',
          'På det smalaste berre 250 meter brei',
          'Fjordcruise frå Gudvangen eller Flåm',
          'Fantastiske kayakkmoglegheiter',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Lengde: 17 km',
          'Djupne: Opptil 500 meter',
          'Båtturar: Heile året',
          'Kayakk: Mai - september',
          'Køyretid frå Voss: Ca. 45 minutt til Gudvangen',
          'Best utsiktspunkt: Stegastein',
        ],
      },
      bookTour: 'Bestill tur til Nærøyfjorden',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Nærøyfjorden',
      subtitle: 'UNESCO World Heritage Fjord',
      description: 'Nærøyfjorden is one of the world\'s most beautiful and dramatic fjord arms. The fjord is part of the UNESCO World Heritage West Norwegian Fjord Landscape and stretches 17 km from Gudvangen to Styvi.',
      history: {
        title: 'History and World Heritage',
        content: `Nærøyfjorden was designated as a UNESCO World Heritage Site in 2005, together with Geirangerfjorden. The fjord is surrounded by high, steep mountains reaching up to 1400 meters, with spectacular waterfalls cascading down the mountainsides.

The name comes from the Old Norse "Njörvasund", meaning "the narrow strait". At its narrowest, the fjord is only 250 meters wide, giving a dramatic feeling of being embraced by nature.

The area has been inhabited since Viking times, and there are several old farms along the fjord. The historic postal route between Oslo and Bergen also passed through this area.`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          'UNESCO World Heritage since 2005',
          'Mountains up to 1400 meters on each side',
          'Spectacular waterfalls',
          'Only 250 meters wide at its narrowest',
          'Fjord cruise from Gudvangen or Flåm',
          'Fantastic kayaking opportunities',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Length: 17 km',
          'Depth: Up to 500 meters',
          'Boat tours: All year',
          'Kayaking: May - September',
          'Driving time from Voss: Approx. 45 minutes to Gudvangen',
          'Best viewpoint: Stegastein',
        ],
      },
      bookTour: 'Book tour to Nærøyfjorden',
      backToDestinations: 'Back to all destinations',
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        <Link href={`/${locale}/tourist`} className="inline-flex items-center text-taxi-grey hover:text-taxi-yellow transition-colors mb-8">
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

              <div className="border-t border-taxi-light-grey pt-6 space-y-3">
                <Link href={`/${locale}/book`}>
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
