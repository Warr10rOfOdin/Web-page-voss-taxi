import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { DiscoverVoss } from '@/components/sections/DiscoverVoss';
import { Services } from '@/components/sections/Services';
import { PopularDestinations } from '@/components/sections/PopularDestinations';
import { WinterActivities } from '@/components/sections/WinterActivities';
import { SummerActivities } from '@/components/sections/SummerActivities';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { CallToAction } from '@/components/sections/CallToAction';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'hero' });

  const heroContent = {
    title: t('title'),
    subtitle: t('subtitle'),
    ctaPrimary: t('ctaPrimary'),
    ctaSecondary: t('ctaSecondary'),
    backgroundImage: '/images/voss-landscape.jpg',
  };

  return (
    <>
      {/* Hero Section */}
      <Hero content={heroContent} locale={locale} />

      {/* Discover Voss */}
      <DiscoverVoss locale={locale} />

      {/* Services */}
      <Services locale={locale} />

      {/* Popular Destinations */}
      <PopularDestinations locale={locale} />

      {/* Seasonal Activities */}
      <WinterActivities locale={locale} />
      <SummerActivities locale={locale} />

      {/* Why Choose Us */}
      <WhyChooseUs locale={locale} />

      {/* Testimonials */}
      <Testimonials locale={locale} />

      {/* FAQ */}
      <FAQ locale={locale} />

      {/* Call to Action */}
      <CallToAction locale={locale} />
    </>
  );
}
