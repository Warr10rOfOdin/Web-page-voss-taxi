import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getPageContent } from '@/lib/content';

// Function to load all destinations
async function getAllDestinations() {
  const destinationsPath = path.join(process.cwd(), 'content', 'destinations');
  const files = await fs.readdir(destinationsPath);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  const destinations = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(destinationsPath, file);
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    })
  );

  return destinations;
}

export default async function TouristPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load content from CMS
  const content = await getPageContent('tourist');
  if (!content) {
    return <div>Content not found</div>;
  }

  const pageContent = content[locale as 'no' | 'en'];

  // Load all destinations
  const destinations = await getAllDestinations();

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
              unoptimized
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

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {pageContent.intro.title}
            </h2>
            <p className="text-lg text-taxi-grey leading-relaxed whitespace-pre-line">
              {pageContent.intro.content}
            </p>
          </div>
        </Container>
      </section>

      {/* Destinations Section */}
      <section className="py-16 md:py-24 bg-taxi-light-grey">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {pageContent.destinations.title}
            </h2>
            <p className="text-lg text-taxi-grey">
              {pageContent.destinations.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination: any) => {
              const destContent = destination[locale as 'no' | 'en'];
              return (
                <Link
                  key={destination.slug}
                  href={`/${locale}/destinations/${destination.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={destContent.heroImage}
                        alt={destContent.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                      {/* Price badge */}
                      {destContent.price && (
                        <div className="absolute top-4 right-4 bg-taxi-yellow text-taxi-black px-3 py-1 rounded-full font-bold text-sm">
                          {locale === 'no' ? 'Frå' : 'From'} {destContent.price}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-taxi-yellow transition-colors">
                        {destContent.title}
                      </h3>
                      <p className="text-taxi-grey mb-4 flex-grow line-clamp-3">
                        {destContent.subtitle}
                      </p>

                      <div className="flex items-center text-taxi-yellow font-medium">
                        <span className="mr-2">
                          {destContent.bookTour}
                        </span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Custom Tours Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="bg-gradient-to-br from-taxi-yellow/10 to-white rounded-2xl p-8 md:p-12 border border-taxi-yellow/20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {pageContent.customTours.title}
              </h2>
              <p className="text-lg text-taxi-grey mb-8">
                {pageContent.customTours.description}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {pageContent.customTours.features.map((feature: string, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-6">
                    <div className="flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-taxi-yellow" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="font-semibold">{feature}</p>
                  </div>
                ))}
              </div>

              <Link href={`/${locale}${pageContent.customTours.ctaLink}`}>
                <Button size="lg" variant="primary">
                  {pageContent.customTours.ctaText}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-taxi-light-grey">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {pageContent.pricing.title}
            </h2>
            <p className="text-lg text-taxi-grey mb-4">
              {pageContent.pricing.description}
            </p>
            <p className="text-sm text-taxi-grey italic">
              {pageContent.pricing.note}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
