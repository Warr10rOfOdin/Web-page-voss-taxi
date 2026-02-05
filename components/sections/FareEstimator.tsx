import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function FareEstimator() {
  const t = useTranslations('calculator');

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-taxi-grey mb-8">
            {t('subtitle')}
          </p>
          <Button size="lg">
            {t('cta')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
