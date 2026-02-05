import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

const services = [
  'local',
  'airport',
  'sightseeing',
  'wheelchair',
  'business',
  'maxi',
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');

  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-taxi-grey max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service} variant="hover">
              <CardHeader>
                <CardTitle>{t(`${service}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t(`${service}.description`)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
