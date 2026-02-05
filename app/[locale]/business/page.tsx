import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('business');
  const tCta = await getTranslations('cta');

  const features = [
    {
      key: 'invoicing',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      key: 'priority',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      key: 'accounts',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-taxi-grey max-w-2xl mx-auto mb-8">
            {t('subtitle')}
          </p>
          <p className="text-lg text-taxi-grey max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => (
            <Card key={feature.key} variant="hover" className="text-center">
              <CardHeader>
                <div className="flex justify-center text-taxi-yellow mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{t(`${feature.key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t(`${feature.key}.description`)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-taxi-light-grey rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            {tCta('learnMore')}
          </h2>
          <p className="text-taxi-grey mb-8 text-lg">
            Contact us to discuss your business transport needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              {tCta('callNow')}: +47 56 51 13 40
            </Button>
            <Button size="lg" variant="secondary">
              Email: post@vosstaxi.no
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
