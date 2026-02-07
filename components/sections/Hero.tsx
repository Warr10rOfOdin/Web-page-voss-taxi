'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface HeroContent {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage?: string;
}

interface HeroProps {
  content: HeroContent;
  locale: string;
}

export function Hero({ content, locale }: HeroProps) {

  return (
    <section className="relative bg-taxi-black text-white min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {content.backgroundImage && (
          <Image
            src={content.backgroundImage}
            alt={content.title}
            fill
            className="object-cover"
            priority
            quality={90}
            unoptimized
          />
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-taxi-black via-taxi-black/80 to-taxi-black/60" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-balance">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl text-taxi-light-grey mb-8 text-balance">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/book`}>
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                {content.ctaPrimary}
              </Button>
            </Link>
            <Link href={`/${locale}/calculator`}>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {content.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Quick phone contact */}
          <div className="mt-8 pt-8 border-t border-taxi-grey/30">
            <p className="text-taxi-light-grey mb-2">
              {locale === 'no' ? 'Ring direkte:' : 'Call directly:'}
            </p>
            <a
              href="tel:+4756511340"
              className="text-2xl md:text-3xl font-bold text-taxi-yellow hover:text-white transition-colors"
            >
              +47 56 51 13 40
            </a>
          </div>
        </div>
      </Container>

      {/* Decorative yellow accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-taxi-yellow via-yellow-400 to-taxi-yellow" />
    </section>
  );
}
