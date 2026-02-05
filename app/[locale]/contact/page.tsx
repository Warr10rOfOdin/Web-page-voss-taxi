import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { getPageContent } from '@/lib/content';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load content from CMS
  const content = await getPageContent('contact');
  if (!content) {
    return <div>Content not found</div>;
  }

  const pageContent = content[locale as 'no' | 'en'];

  const contactMethods = [
    {
      key: 'phone',
      data: pageContent.contactInfo.phone,
      href: `tel:${pageContent.contactInfo.phone.value.replace(/\s/g, '')}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      key: 'email',
      data: pageContent.contactInfo.email,
      href: `mailto:${pageContent.contactInfo.email.value}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      key: 'address',
      data: pageContent.contactInfo.address,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      key: 'hours',
      data: pageContent.contactInfo.hours,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

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

      {/* Contact Info Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {contactMethods.map((method) => (
              <Card key={method.key} variant="hover">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="text-taxi-yellow flex-shrink-0">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{method.data.label}</CardTitle>
                      {method.href ? (
                        <a
                          href={method.href}
                          className="text-taxi-yellow hover:text-taxi-black transition-colors text-lg font-semibold block mb-2"
                        >
                          {method.data.value}
                        </a>
                      ) : (
                        <p className="text-taxi-yellow text-lg font-semibold mb-2">{method.data.value}</p>
                      )}
                      <p className="text-taxi-grey text-sm">{method.data.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
              {pageContent.faq.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pageContent.faq.items.map((item: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{item.answer}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-taxi-black text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {locale === 'no' ? 'Klar til å bestille?' : 'Ready to book?'}
            </h2>
            <p className="text-taxi-light-grey text-lg mb-8">
              {locale === 'no'
                ? 'Ring oss no eller send oss ein e-post'
                : 'Call us now or send us an email'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${pageContent.contactInfo.phone.value.replace(/\s/g, '')}`}>
                <button className="bg-taxi-yellow text-taxi-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-lg">
                  {locale === 'no' ? 'Ring Oss' : 'Call Us'}: {pageContent.contactInfo.phone.value}
                </button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
