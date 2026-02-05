import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ServiceHighlights } from '@/components/sections/ServiceHighlights';
import { FareEstimator } from '@/components/sections/FareEstimator';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { TouristSpotlight } from '@/components/sections/TouristSpotlight';
import { getPageContent } from '@/lib/content';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load content from CMS
  const content = await getPageContent('home');
  if (!content) {
    return <div>Content not found</div>;
  }

  const pageContent = content[locale as 'no' | 'en'];

  return (
    <>
      <Hero content={pageContent.hero} locale={locale} />
      <ServiceHighlights content={pageContent.highlights} />
      <FareEstimator content={pageContent.calculator} />
      <WhyChooseUs content={pageContent.trust} />
      <TouristSpotlight locale={locale} />
    </>
  );
}
