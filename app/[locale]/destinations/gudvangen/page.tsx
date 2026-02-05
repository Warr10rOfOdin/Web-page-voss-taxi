import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function GudvangenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Gudvangen',
      subtitle: 'Vikinglandsby og fjorddestinasjon',
      description: 'Gudvangen ligg i enden av Nærøyfjorden, ei av verdas vakreste og smalaste fjordar. Landsbyen har ein autentisk vikinglandsby og er eit populært utgangspunkt for fjordcruise.',
      history: {
        title: 'Historie',
        content: `Gudvangen har ei lang og rik historie som strekker seg tilbake til vikingtida. Namnet kjem frå det norrøne "Guðvangir" som tyder "vengene til gudane" – ein passande beskrivelse av det dramatiske landskapet med bratte fjell som reiser seg på begge sider av fjorden.

I moderne tid har Gudvangen vore ein viktig knutepunkt for transport mellom Aurland og Voss. Ferjesamband gjennom Nærøyfjorden har vore i drift i generasjonar, og i dag er det også ein populær cruise-destinasjon.

Njardarheimr vikinglandsby vart opna i 2017 og tilbyr besøkande ein unik moglegheit til å oppleve korleis vikingane levde. Landsbyen er bygd opp med autentiske vikingbygningar og handverkarar som brukar historiske teknikkar.`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          'UNESCO Verdensarvfjord Nærøyfjorden',
          'Njardarheimr autentisk vikinglandsby',
          'Spektakulært fjordlandskap',
          'Utgangspunkt for fjordcruise',
          'Historisk knutepunkt',
          'Fjellvandring og naturopplevingar',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Avstand frå Voss: Ca. 50 km',
          'Køyretid: Ca. 45-60 minutt',
          'Høgdeforskjell: Ned til fjorden (0 moh)',
          'Tilgjengeleg: Heile året',
          'Vikinglandsby: Mai - september',
          'Fjordcruise: Vår - haust',
        ],
      },
      price: 'Frå 1400 NOK per tur',
      bookTour: 'Bestill tur til Gudvangen',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Gudvangen',
      subtitle: 'Viking village and fjord destination',
      description: 'Gudvangen is located at the end of Nærøyfjorden, one of the world\'s most beautiful and narrow fjords. The village has an authentic Viking village and is a popular starting point for fjord cruises.',
      history: {
        title: 'History',
        content: `Gudvangen has a long and rich history dating back to the Viking Age. The name comes from the Old Norse "Guðvangir" which means "fields of the gods" – a fitting description of the dramatic landscape with steep mountains rising on both sides of the fjord.

In modern times, Gudvangen has been an important hub for transport between Aurland and Voss. Ferry connections through Nærøyfjorden have been in operation for generations, and today it is also a popular cruise destination.

Njardarheimr Viking village was opened in 2017 and offers visitors a unique opportunity to experience how the Vikings lived. The village is built with authentic Viking buildings and craftsmen using historical techniques.`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          'UNESCO World Heritage Fjord Nærøyfjorden',
          'Njardarheimr authentic Viking village',
          'Spectacular fjord landscape',
          'Starting point for fjord cruises',
          'Historic transportation hub',
          'Mountain hiking and nature experiences',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Distance from Voss: Approx. 50 km',
          'Driving time: Approx. 45-60 minutes',
          'Elevation change: Down to fjord (0 m)',
          'Available: All year',
          'Viking village: May - September',
          'Fjord cruise: Spring - autumn',
        ],
      },
      price: 'From 1400 NOK per tour',
      bookTour: 'Book tour to Gudvangen',
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

        {/* Hero Image Placeholder */}
        <div className="relative h-96 bg-gradient-to-br from-taxi-grey to-taxi-black rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-taxi-yellow/10" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h1 className="text-5xl font-display font-bold mb-2">{t.title}</h1>
              <p className="text-xl opacity-90">{t.subtitle}</p>
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

            {/* Image Gallery Placeholder */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">
                {locale === 'no' ? 'Bilete' : 'Photos'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-gradient-to-br from-taxi-grey to-taxi-black rounded-lg flex items-center justify-center"
                  >
                    <svg
                      className="w-12 h-12 text-white opacity-30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
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
