import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tCta = await getTranslations('cta');

  const contactMethods = [
    {
      title: t('phone'),
      value: '+47 56 51 13 40',
      href: 'tel:+4756511340',
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
      title: t('email'),
      value: 'post@vosstaxi.no',
      href: 'mailto:post@vosstaxi.no',
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
      title: t('address'),
      value: 'Uttrågata 19, 5700 Voss',
      href: 'https://maps.google.com/?q=Uttrågata+19,+5700+Voss',
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
      title: t('hours'),
      value: t('hoursValue'),
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
    <div className="py-16 md:py-24">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-taxi-grey">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactMethods.map((method) => (
            <Card key={method.title} variant="hover">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="text-taxi-yellow">
                    {method.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{method.title}</CardTitle>
                    {method.href ? (
                      <a
                        href={method.href}
                        className="text-taxi-grey hover:text-taxi-yellow transition-colors text-lg"
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="text-taxi-grey text-lg">{method.value}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="bg-taxi-black text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">
            {tCta('bookNow')}
          </h2>
          <p className="text-taxi-light-grey mb-8 text-lg">
            Call us now or send us an email
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="primary">
              {tCta('callNow')}: +47 56 51 13 40
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
