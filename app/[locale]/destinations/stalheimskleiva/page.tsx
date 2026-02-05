import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function StalheimskleivalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Stalheimskleiva',
      subtitle: 'Norges brattaste vegstrekke',
      description: 'Stalheimskleiva er ei spektakulær fjellveg med 13 hårnålssvingar og ein gjennomsnittleg stigning på 20%. Dette er Norges brattaste ordinære vegstrekke.',
      history: {
        title: 'Historie',
        content: `Stalheimskleiva vart bygd i 1842-1846 og var den første vegen over Stalheimskleiva. Vegen var i bruk fram til 1980, då den nye tunnelen gjennom fjellet vart opna.

I dag er Stalheimskleiva ei populær turistattraksjon og er open for trafikk om sommare. Vegen er smal og krokete, og har framleis dei originale steinbroene frå 1846.

Frå toppen av klevå har ein spektakulær utsikt over Nærøydalen og dei to fossane Stalheimsfossen og Sivlefossen.`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          'Norges brattaste veg med 20% stigning',
          '13 hårnålssvingar',
          'Utsikt over Stalheimsfossen og Sivlefossen',
          'Historisk veg frå 1846',
          'Fantastisk utsikt over Nærøydalen',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Lengde: Ca. 1,5 km',
          'Høgdeforskjell: 300 meter',
          'Open: Mai - oktober (vêravhengig)',
          'Parkering: Ved Stalheim Hotell',
          'Køyretid frå Voss: Ca. 30 minutt',
        ],
      },
      bookTour: 'Bestill tur til Stalheimskleiva',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Stalheimskleiva',
      subtitle: "Norway's steepest road stretch",
      description: 'Stalheimskleiva is a spectacular mountain road with 13 hairpin bends and an average gradient of 20%. This is Norway\'s steepest regular road section.',
      history: {
        title: 'History',
        content: `Stalheimskleiva was built in 1842-1846 and was the first road over Stalheimskleiva. The road was in use until 1980, when the new tunnel through the mountain was opened.

Today, Stalheimskleiva is a popular tourist attraction and is open to traffic in summer. The road is narrow and winding, and still has the original stone bridges from 1846.

From the top of the road you have a spectacular view over Nærøydalen valley and the two waterfalls Stalheimsfossen and Sivlefossen.`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          'Norway\'s steepest road with 20% gradient',
          '13 hairpin bends',
          'View of Stalheimsfossen and Sivlefossen waterfalls',
          'Historic road from 1846',
          'Fantastic view over Nærøydalen valley',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Length: Approx. 1.5 km',
          'Height difference: 300 meters',
          'Open: May - October (weather dependent)',
          'Parking: At Stalheim Hotel',
          'Driving time from Voss: Approx. 30 minutes',
        ],
      },
      bookTour: 'Book tour to Stalheimskleiva',
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
