import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function SkjervsfossenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Skjervsfossen',
      subtitle: 'Tvillingfoss langs Norges vakreste turistveg',
      description: 'Skjervsfossen er ein spektakulær tvillingfoss i Granvin kommune med ein total høgde på 125 meter. Fossen ligg ved riksvei 13, ein av Norges viktigaste turistvegar, og er lett tilgjengeleg frå vegen.',
      history: {
        title: 'Historie',
        content: `Skjervsfossen ligg ved Skjervet, omtrent midt mellom Granvin og Voss. Riksvei 13 passerer på avsatsen mellom fossens øvre og nedre fall, noko som gjer fossen unik og lett tilgjengeleg.

Fossen er ein tvillingfoss i elva Storelvi med den øvre delen som den mest imponerende, med eit vertikal fall på 60 meter. Vatnet kaskar ned fjellsida i to parallelle straumar, noko som gjer dette til eit spektakulært syn.

Riksvei 13 er ein nasjonal turistveg og er kjend for si natur og landskapsopplevingar. Fossen er 15 kilometer frå Voss sentrum, men det er viktig å hugse på å ta gamle veien og ikkje tunnelen for å sjå fossen!`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          'Tvillingfoss med 125 meter totalt fall',
          '60 meter vertikal fall på øvre del',
          'Nasjonal turistveg R13',
          'Lett tilgjengeleg frå vegen',
          'Spektakulær utsikt',
          'Populær fotostopp',
          'Midtpunkt mellom Voss og Granvin',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Avstand frå Voss: 15 km',
          'Køyretid: Ca. 20 minutt',
          'VIKTIG: Ta gamle vegen, IKKJE tunnelen',
          'Parkering: Ved vegen',
          'Tilgjengeleg: Heile året',
          'Best tid: Mai - september',
        ],
      },
      price: 'Frå 700 NOK per tur',
      bookTour: 'Bestill tur til Skjervsfossen',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Skjervsfossen',
      subtitle: 'Twin waterfall along Norway\'s most beautiful tourist route',
      description: 'Skjervsfossen is a spectacular twin waterfall in Granvin municipality with a total height of 125 meters. The waterfall is located by Highway 13, one of Norway\'s most important tourist routes, and is easily accessible from the road.',
      history: {
        title: 'History',
        content: `Skjervsfossen is located at Skjervet, approximately halfway between Granvin and Voss. Highway 13 passes on the ledge between the waterfall's upper and lower falls, making the waterfall unique and easily accessible.

The waterfall is a twin waterfall in the Storelvi river with the upper part being the most impressive, with a vertical drop of 60 meters. The water cascades down the mountainside in two parallel streams, making this a spectacular sight.

Highway 13 is a national tourist route and is known for its nature and landscape experiences. The waterfall is 15 kilometers from Voss center, but it is important to remember to take the old road and not the tunnel to see the waterfall!`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          'Twin waterfall with 125 meters total drop',
          '60 meter vertical drop on upper part',
          'National tourist route R13',
          'Easily accessible from the road',
          'Spectacular views',
          'Popular photo stop',
          'Midpoint between Voss and Granvin',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Distance from Voss: 15 km',
          'Driving time: Approx. 20 minutes',
          'IMPORTANT: Take old road, NOT the tunnel',
          'Parking: By the road',
          'Available: All year',
          'Best time: May - September',
        ],
      },
      price: 'From 700 NOK per tour',
      bookTour: 'Book tour to Skjervsfossen',
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

              <div className="bg-taxi-yellow/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-taxi-grey font-medium mb-1">{locale === 'no' ? 'Prisestimat' : 'Price estimate'}</p>
                <p className="text-2xl font-bold text-taxi-black">{t.price}</p>
                <p className="text-xs text-taxi-grey mt-1">{locale === 'no' ? 'Varierer etter sesong og gruppe' : 'Varies by season and group'}</p>
              </div>

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
