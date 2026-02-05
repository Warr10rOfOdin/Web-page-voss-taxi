import { setRequestLocale } from 'next-intl/server';
import { getDestinationContent } from '@/lib/content';
import { DestinationTemplate } from '@/components/destinations/DestinationTemplate';

export default async function GudvangenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = await getDestinationContent('gudvangen');

  if (!content) {
    return <div>Content not found</div>;
  }

  const t = content[locale as 'no' | 'en'];

  return <DestinationTemplate content={t} locale={locale} />;
}
