'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface FareEstimatorContent {
  title: string;
  subtitle: string;
  cta: string;
}

interface FareEstimatorProps {
  content: FareEstimatorContent;
}

export function FareEstimator({ content }: FareEstimatorProps) {

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/20240604_211019.jpg"
              alt="Voss Taxi"
              fill
              className="object-cover"
              quality={85}
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-taxi-yellow/90 via-taxi-yellow/85 to-yellow-500/80" />
          </div>

          <div className="relative z-10 text-center px-8 py-16 md:py-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 text-taxi-black">
              {content.title}
            </h2>
            <p className="text-lg md:text-xl text-taxi-black/90 mb-8 max-w-2xl mx-auto">
              {content.subtitle}
            </p>
            <Button size="lg" variant="secondary" className="bg-taxi-black hover:bg-taxi-grey text-white">
              {content.cta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
