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
    <section className="relative bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black text-white min-h-[650px] md:min-h-[750px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {content.backgroundImage && (
          <Image
            src={content.backgroundImage}
            alt={content.title}
            fill
            className="object-cover opacity-20"
            priority
            quality={90}
            unoptimized
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-taxi-black via-taxi-black/90 to-taxi-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-taxi-black via-transparent to-transparent" />
      </div>

      {/* Subtle accent element */}
      <div className="absolute top-32 right-20 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl" />

      <Container className="relative z-10 py-16">
        <div className="max-w-5xl">
          <div className="space-y-8">
            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              {content.title}
            </h1>

            {/* Accent Line */}
            <div className="w-24 h-1 bg-taxi-yellow" />

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-taxi-light-grey/80 max-w-3xl leading-relaxed">
              {content.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={`/${locale}/book`}>
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold"
                >
                  {content.ctaPrimary}
                </Button>
              </Link>
              <Link href={`/${locale}/calculator`}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold"
                >
                  {content.ctaSecondary}
                </Button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="pt-8 border-t border-white/10 max-w-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div>
                  <p className="text-sm text-taxi-light-grey/60 mb-2 uppercase tracking-wide font-medium">
                    {locale === 'no' ? 'Ring oss direkte' : 'Call us directly'}
                  </p>
                  <a
                    href="tel:+4756511340"
                    className="text-2xl md:text-3xl font-bold text-white hover:text-taxi-yellow transition-colors"
                  >
                    +47 56 51 13 40
                  </a>
                </div>
                <div className="hidden sm:block w-px h-12 bg-white/10" />
                <div className="text-sm text-taxi-light-grey/70">
                  {locale === 'no' ? 'Tilgjengeleg 24/7, alle dagar i året' : 'Available 24/7, every day of the year'}
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-6 text-sm text-taxi-light-grey/70">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-taxi-yellow" />
                <span>{locale === 'no' ? '75+ år erfaring' : '75+ years experience'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-taxi-yellow" />
                <span>{locale === 'no' ? 'Moderne køyretøy' : 'Modern vehicles'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-taxi-yellow" />
                <span>{locale === 'no' ? 'Profesjonelle sjåførar' : 'Professional drivers'}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-taxi-yellow/50 to-transparent" />
    </section>
  );
}
