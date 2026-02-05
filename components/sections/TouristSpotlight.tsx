import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function TouristSpotlight() {
  const t = useTranslations('touristSpotlight');
  const locale = useLocale();

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-taxi-grey to-taxi-black text-white min-h-[400px] flex items-center">
          {/* Background pattern/image placeholder */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-taxi-yellow to-transparent" />

          <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              {t('title')}
            </h2>
            <p className="text-lg md:text-xl text-taxi-light-grey mb-8">
              {t('description')}
            </p>
            <Link href={`/${locale}/tourist`}>
              <Button size="lg" variant="primary">
                {t('cta')}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
