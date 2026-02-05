import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ServiceHighlights } from '@/components/sections/ServiceHighlights';
import { FareEstimator } from '@/components/sections/FareEstimator';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { TouristSpotlight } from '@/components/sections/TouristSpotlight';

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServiceHighlights />
      <FareEstimator />
      <WhyChooseUs />
      <TouristSpotlight />
    </>
  );
}
