import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function BergenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Bergen',
      subtitle: 'Porten til fjordane',
      description: 'Bergen er Noregs nest største by og historiske hovedstad. Byen er kjend for Bryggen, det hanseatiske kvartertet frå 1300-talet som er på UNESCOs verdensarvliste, og er eit utmerkt utgangspunkt for fjordturar.',
      history: {
        title: 'Historie',
        content: `Bergen vart grunnlagd av Kong Olav Kyrre omkring år 1070 og var Noregs hovudstad på 1200-talet. Byen har ei rik historie som handelsstad, spesielt gjennom Hansakontoren på Bryggen som var aktive frå 1300-talet til 1754.

Bryggen, med sine karakteristiske trehus, er i dag eit UNESCO Verdensarvområde og ei av dei best bevarte hanseatiske handelsbusetnadene i verda. Området vart bygd opp igjen fleire gonger etter store brannar, men har behalde sin originale struktur.

Bergen har også vore eit viktig kulturelt senter i Norge, med komponisten Edvard Grieg som ein av dei mest kjende innbyggjarane. Byen er i dag Noregs nest største by og er kjend som "porten til fjordane" på grunn av sin geografiske plassering.`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          'Bryggen - UNESCO Verdensarvområde',
          'Fløyen - utsiktspunkt 320 meter over havet',
          'Fisk og sjømat på Fisketorget',
          'Bergenhus festning frå 1200-talet',
          'Hanseatisk museum',
          'Edvard Griegs hjem Troldhaugen',
          'Moderne shoppinggater og restaurantar',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Avstand frå Voss: Ca. 100 km',
          'Køyretid: Ca. 1.5-2 timar',
          'Anbefalt opphald: 4-6 timar',
          'Parking: Fleire parkeringshus i sentrum',
          'Fløybanen: Ta kabelbanen til toppen av Fløyen',
          'Best tid: Mai - september',
        ],
      },
      price: 'Frå 2200 NOK per tur',
      bookTour: 'Bestill tur til Bergen',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Bergen',
      subtitle: 'Gateway to the fjords',
      description: 'Bergen is Norway\'s second largest city and historic capital. The city is known for Bryggen, the Hanseatic quarter from the 1300s which is on UNESCO\'s World Heritage List, and is an excellent starting point for fjord tours.',
      history: {
        title: 'History',
        content: `Bergen was founded by King Olav Kyrre around the year 1070 and was Norway's capital in the 1200s. The city has a rich history as a trading center, especially through the Hanseatic office at Bryggen which was active from the 1300s to 1754.

Bryggen, with its characteristic wooden houses, is today a UNESCO World Heritage Site and one of the best preserved Hanseatic trading settlements in the world. The area was rebuilt several times after major fires, but has retained its original structure.

Bergen has also been an important cultural center in Norway, with composer Edvard Grieg as one of its most famous residents. The city is today Norway's second largest city and is known as "the gateway to the fjords" due to its geographical location.`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          'Bryggen - UNESCO World Heritage Site',
          'Fløyen - viewpoint 320 meters above sea level',
          'Fish and seafood at the Fish Market',
          'Bergenhus Fortress from the 1200s',
          'Hanseatic Museum',
          'Edvard Grieg\'s home Troldhaugen',
          'Modern shopping streets and restaurants',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Distance from Voss: Approx. 100 km',
          'Driving time: Approx. 1.5-2 hours',
          'Recommended stay: 4-6 hours',
          'Parking: Several parking garages in the city center',
          'Fløibanen: Take the cable car to the top of Fløyen',
          'Best time: May - September',
        ],
      },
      price: 'From 2200 NOK per tour',
      bookTour: 'Book tour to Bergen',
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
            src="/images/20230603_114041.jpg"
            alt="Bergen"
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
                  '/images/20230603_114041.jpg',
                  '/images/20230603_113847.jpg',
                  '/images/20230302_135038.jpg',
                  '/images/20240618_074440.jpg'
                ].map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden">
                    <img src={img} alt={`Bergen ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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
