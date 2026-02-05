import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
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
    { name: 'Stalheimskleiva', description: 'Scenic mountain road with waterfalls' },
    { name: 'Tvindefossen', description: 'Beautiful waterfall' },
    { name: 'Nærøyfjorden', description: 'UNESCO World Heritage fjord' },
    { name: 'Bergen', description: 'Historic city and gateway to the fjords' },
    { name: 'Flåm', description: 'Famous railway and fjord scenery' },
    { name: 'Gudvangen', description: 'Viking village and fjord destination' },
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
              <Card key={destination.name} variant="hover">
                <CardHeader>
                  <CardTitle className="text-xl">{destination.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {destination.description}
                  </CardDescription>
                </CardContent>
              </Card>
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
                <p className="text-taxi-grey">Available every day, all year round</p>
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
