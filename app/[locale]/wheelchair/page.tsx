import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function WheelchairPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('wheelchair');
  const tCta = await getTranslations('cta');

  const features = [
    'Specially adapted vehicles',
    'Trained drivers',
    'Safe and comfortable transport',
    'Available 24/7',
    'Airport transfers',
    'Local rides',
  ];

  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-taxi-grey mb-8">
              {t('subtitle')}
            </p>
            <p className="text-lg text-taxi-grey max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold mb-6 text-center">
              {t('features')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <Card key={feature}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <svg
                        className="w-6 h-6 text-taxi-yellow mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-taxi-black text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">
              {t('booking')}
            </h2>
            <p className="text-taxi-light-grey mb-8 text-lg">
              {t('bookingDescription')}
            </p>
            <Button size="lg" variant="primary">
              {tCta('callNow')}: +47 56 51 13 40
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
