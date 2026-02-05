import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getPageContent } from '@/lib/content';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load content from CMS
  const content = await getPageContent('about');
  if (!content) {
    return <div>Content not found</div>;
  }

  const pageContent = content[locale as 'no' | 'en'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-taxi-black text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-taxi-black via-taxi-black/80 to-transparent z-0">
          {pageContent.hero.backgroundImage && (
            <Image
              src={pageContent.hero.backgroundImage}
              alt={pageContent.hero.title}
              fill
              className="object-cover opacity-30"
              priority
            />
          )}
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              {pageContent.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-taxi-yellow">
              {pageContent.hero.subtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{pageContent.story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-taxi-grey leading-relaxed whitespace-pre-line text-lg">
                {pageContent.story.content}
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-taxi-light-grey">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
            {pageContent.values.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pageContent.values.items.map((value: any, index: number) => (
              <Card key={index} variant="hover">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <svg className="w-8 h-8 text-taxi-yellow mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-taxi-grey">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <Card className="bg-gradient-to-br from-taxi-light-grey to-white">
            <CardHeader>
              <CardTitle className="text-3xl">{pageContent.team.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-taxi-grey leading-relaxed">
                {pageContent.team.description}
              </p>
            </CardContent>
          </Card>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-taxi-black text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {pageContent.cta.title}
            </h2>
            <p className="text-taxi-light-grey text-lg mb-8">
              {pageContent.cta.subtitle}
            </p>
            <Link href={`/${locale}${pageContent.cta.buttonLink}`}>
              <Button size="lg" variant="primary">
                {pageContent.cta.buttonText}
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
