import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ServiceHighlights } from '@/components/sections/ServiceHighlights';
import { FareEstimator } from '@/components/sections/FareEstimator';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { TouristSpotlight } from '@/components/sections/TouristSpotlight';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
