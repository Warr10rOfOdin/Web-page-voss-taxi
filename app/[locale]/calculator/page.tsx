import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('calculator');

  return (
    <div className="py-16 md:py-24 min-h-[600px]">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-taxi-grey mb-12">
            {t('subtitle')}
          </p>

          {/* Placeholder for calculator widget/iframe */}
          <div className="bg-taxi-light-grey rounded-2xl p-12 mb-8 border-2 border-dashed border-taxi-grey">
            <p className="text-taxi-grey text-lg">
              Calculator widget will be embedded here
            </p>
            <p className="text-taxi-grey mt-4">
              This can be an iframe, embedded widget, or link to external calculator
            </p>
          </div>

          <Button size="lg">
            {t('cta')}
          </Button>
        </div>
      </Container>
    </div>
  );
}
