import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface DestinationContent {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  history: {
    title: string;
    content: string;
  };
  highlights: {
    title: string;
    items: string[];
  };
  info: {
    title: string;
    items: string[];
  };
  gallery: string[];
  bookTour: string;
  backToDestinations: string;
  price?: string;
}

interface DestinationTemplateProps {
  content: DestinationContent;
  locale: string;
}

export function DestinationTemplate({ content, locale }: DestinationTemplateProps) {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        {/* Back button */}
        <Link
          href={`/${locale}/tourist`}
          className="inline-flex items-center text-taxi-grey hover:text-taxi-yellow transition-colors mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {content.backToDestinations}
        </Link>

        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
          <img
            src={content.heroImage}
            alt={content.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-taxi-black/80 via-taxi-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-5xl font-display font-bold mb-2 drop-shadow-lg">{content.title}</h1>
              <p className="text-xl opacity-90 drop-shadow-lg">{content.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <p className="text-lg text-taxi-grey leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">
                {content.history.title}
              </h2>
              <div className="text-taxi-grey leading-relaxed whitespace-pre-line">
                {content.history.content}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">
                {content.highlights.title}
              </h2>
              <ul className="space-y-3">
                {content.highlights.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-taxi-yellow mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-taxi-grey">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">
                {locale === 'no' ? 'Bilete' : 'Photos'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {content.gallery.map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`${content.title} ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Practical Info */}
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h3 className="text-2xl font-display font-bold mb-4">
                {content.info.title}
              </h3>
              <ul className="space-y-3 mb-6">
                {content.info.items.map((item, index) => (
                  <li key={index} className="text-sm text-taxi-grey flex items-start">
                    <svg
                      className="w-5 h-5 text-taxi-yellow mt-0.5 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              {content.price && (
                <div className="mb-6 p-4 bg-taxi-yellow/10 rounded-lg">
                  <p className="text-sm font-semibold text-taxi-black">{content.price}</p>
                </div>
              )}

              <div className="border-t border-taxi-light-grey pt-6 space-y-3">
                <Link href={`/${locale}/book`}>
                  <Button className="w-full" size="lg">
                    {content.bookTour}
                  </Button>
                </Link>
                <a href="tel:+4756511340">
                  <Button className="w-full" size="lg" variant="secondary">
                    {locale === 'no' ? 'Ring No' : 'Call Now'}: +47 56 51 13 40
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
