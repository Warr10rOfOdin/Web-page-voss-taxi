import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getPageContent } from '@/lib/content';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load content from CMS
  const content = await getPageContent('services');
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
            <p className="text-xl md:text-2xl text-taxi-light-grey">
              {pageContent.hero.subtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="space-y-24">
            {pageContent.services.map((service: any, index: number) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 lg:gap-12 items-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-taxi-grey mb-6">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-taxi-yellow flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-taxi-grey">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href={`/${locale}${service.ctaLink}`}>
                    <Button size="lg" variant="primary">
                      {service.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-taxi-light-grey">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {locale === 'no' ? 'Treng du meir informasjon?' : 'Need more information?'}
            </h2>
            <p className="text-lg text-taxi-grey mb-8">
              {locale === 'no'
                ? 'Kontakt oss gjerne for spørsmål eller spesialtilpassa løysingar.'
                : 'Feel free to contact us for questions or customized solutions.'}
            </p>
            <Link href={`/${locale}/contact`}>
              <Button size="lg" variant="primary">
                {locale === 'no' ? 'Kontakt Oss' : 'Contact Us'}
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
