import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function TouristPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tourist');
  const tCta = await getTranslations('cta');

  const destinations = [
    {
      slug: 'stalheimskleiva',
      name: 'Stalheimskleiva',
      description: locale === 'no' 
        ? 'Scenisk fjellveg med fossar' 
        : 'Scenic mountain road with waterfalls',
      image: '/images/destinations/stalheimskleiva.jpg',
    },
    {
      slug: 'tvindefossen',
      name: 'Tvindefossen',
      description: locale === 'no' 
        ? 'Vakker foss' 
        : 'Beautiful waterfall',
      image: '/images/destinations/tvindefossen.jpg',
    },
    {
      slug: 'naeroyfjorden',
      name: 'Nærøyfjorden',
      description: locale === 'no' 
        ? 'UNESCO Verdensarvfjord' 
        : 'UNESCO World Heritage fjord',
      image: '/images/destinations/naeroyfjorden.jpg',
    },
    {
      slug: 'bergen',
      name: 'Bergen',
      description: locale === 'no' 
        ? 'Historisk by og port til fjordane' 
        : 'Historic city and gateway to the fjords',
      image: '/images/destinations/bergen.jpg',
    },
    {
      slug: 'flam',
      name: 'Flåm',
      description: locale === 'no' 
        ? 'Berømt jernbane og fjordlandskap' 
        : 'Famous railway and fjord scenery',
      image: '/images/destinations/flam.jpg',
    },
    {
      slug: 'gudvangen',
      name: 'Gudvangen',
      description: locale === 'no' 
        ? 'Vikinglandsby og fjorddestinasjon' 
        : 'Viking village and fjord destination',
      image: '/images/destinations/gudvangen.jpg',
    },
  ];

  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-taxi-grey max-w-2xl mx-auto mb-8">
            {t('subtitle')}
          </p>
          <p className="text-lg text-taxi-grey max-w-3xl mx-auto">
            {t('intro')}
          </p>
        </div>

        {/* Popular Destinations */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
            {t('popular')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Link
                key={destination.slug}
                href={`/${locale}/destinations/${destination.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-br from-taxi-grey to-taxi-black overflow-hidden">
                    <div className="absolute inset-0 bg-taxi-yellow/10 group-hover:bg-taxi-yellow/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center p-6">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 opacity-50"
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
                        <p className="text-sm opacity-75">
                          {locale === 'no' ? 'Bilete kjem snart' : 'Image coming soon'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-taxi-yellow transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-taxi-grey mb-4">
                      {destination.description}
                    </p>
                    <div className="flex items-center text-taxi-yellow font-medium">
                      <span className="mr-2">
                        {locale === 'no' ? 'Les meir' : 'Read more'}
                      </span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Custom Tours */}
        <div className="bg-taxi-light-grey rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t('customTours')}
            </h2>
            <p className="text-lg text-taxi-grey mb-8">
              {t('customToursDescription')}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-xl mb-2">{t('capacity')}</h3>
                <p className="text-taxi-grey">{t('capacityDescription')}</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-xl mb-2">24/7</h3>
                <p className="text-taxi-grey">
                  {locale === 'no' 
                    ? 'Tilgjengeleg kvar dag, heile året' 
                    : 'Available every day, all year round'}
                </p>
              </div>
            </div>

            <Button size="lg">
              {tCta('callNow')}: +47 56 51 13 40
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
