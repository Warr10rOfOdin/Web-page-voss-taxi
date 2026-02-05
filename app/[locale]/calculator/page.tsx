import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { CalculatorEmbed } from '@/components/calculator/CalculatorEmbed';

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey min-h-screen">
      <Container>
        <CalculatorEmbed locale={locale} />
      </Container>
    </div>
  );
}
