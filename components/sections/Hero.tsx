import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative bg-taxi-black text-white min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-taxi-black via-taxi-black/80 to-transparent z-0">
        {/* Placeholder for hero image - can be replaced with actual image */}
        <div className="absolute inset-0 bg-gradient-to-br from-taxi-grey to-taxi-black opacity-50" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-balance">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-taxi-light-grey mb-8 text-balance">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="primary">
              {t('ctaPrimary')}
            </Button>
            <Button size="lg" variant="secondary">
              {t('ctaSecondary')}
            </Button>
          </div>
        </div>
      </Container>

      {/* Decorative yellow accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-taxi-yellow via-yellow-400 to-taxi-yellow" />
    </section>
  );
}
