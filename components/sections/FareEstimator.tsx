'use client';

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
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl text-taxi-grey mb-8">
            {content.subtitle}
          </p>
          <Button size="lg">
            {content.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
