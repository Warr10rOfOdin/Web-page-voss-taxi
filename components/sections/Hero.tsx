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
    <section className="relative bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black text-white min-h-[700px] md:min-h-[800px] flex items-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-taxi-yellow/10 via-transparent to-yellow-500/10 animate-pulse opacity-30" />
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {content.backgroundImage && (
          <Image
            src={content.backgroundImage}
            alt={content.title}
            fill
            className="object-cover opacity-40"
            priority
            quality={90}
            unoptimized
          />
        )}
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-taxi-black via-taxi-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-taxi-black/80 via-transparent to-transparent" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-taxi-yellow/20 rounded-full blur-3xl float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />

      <Container className="relative z-10">
        <div className="max-w-4xl">
          {/* Glass Card Container */}
          <div className="glass-dark rounded-3xl p-8 md:p-12 depth-4 hover-lift smooth-transition">
            {/* Title with Shimmer Effect */}
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold mb-6 text-balance relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-taxi-yellow to-white">
                {content.title}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
            </h1>

            <p className="text-xl md:text-3xl text-taxi-light-grey/90 mb-10 text-balance leading-relaxed">
              {content.subtitle}
            </p>

            {/* CTA Buttons with Enhanced Styling */}
            <div className="flex flex-col sm:flex-row gap-6 mb-10">
              <Link href={`/${locale}/book`} className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto text-lg px-10 py-6 depth-glow hover-scale smooth-transition font-bold"
                >
                  {content.ctaPrimary}
                </Button>
              </Link>
              <Link href={`/${locale}/calculator`} className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto text-lg px-10 py-6 hover-lift smooth-transition glass-strong backdrop-blur-lg"
                >
                  {content.ctaSecondary}
                </Button>
              </Link>
            </div>

            {/* Quick phone contact with Glass Effect */}
            <div className="mt-10 pt-8 border-t border-taxi-yellow/30">
              <div className="glass-yellow rounded-2xl p-6 depth-2 hover-glow smooth-transition">
                <p className="text-taxi-light-grey mb-3 text-lg font-medium">
                  {locale === 'no' ? '📞 Ring direkte - Døgnopen Service' : '📞 Call directly - 24/7 Service'}
                </p>
                <a
                  href="tel:+4756511340"
                  className="text-3xl md:text-4xl font-bold text-taxi-yellow hover:text-white transition-all duration-300 inline-block hover:scale-105"
                >
                  +47 56 51 13 40
                </a>
                <p className="text-sm text-taxi-light-grey/70 mt-2">
                  {locale === 'no' ? 'Tilgjengeleg 24/7 - 365 dagar i året' : 'Available 24/7 - 365 days a year'}
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="glass-strong rounded-full px-6 py-3 depth-1 text-sm font-semibold backdrop-blur-xl">
              ⭐ 24/7 Service
            </div>
            <div className="glass-strong rounded-full px-6 py-3 depth-1 text-sm font-semibold backdrop-blur-xl">
              🚗 Erfarne Sjåførar
            </div>
            <div className="glass-strong rounded-full px-6 py-3 depth-1 text-sm font-semibold backdrop-blur-xl">
              ✓ {locale === 'no' ? 'Trygg Transport' : 'Safe Transport'}
            </div>
          </div>
        </div>
      </Container>

      {/* Animated Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-3 animated-gradient depth-glow-strong" />
    </section>
  );
}
