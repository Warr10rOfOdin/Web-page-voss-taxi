import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Om Voss Taxi',
      subtitle: 'Lokal kunnskap, trygg køyring',
      intro: 'Voss Taxi har vore ein påliteleg transportpartnar i Voss og omegn i mange år. Me er stolte av å tilby trygg, komfortabel og profesjonell taxiservice til både lokalbefolkning og turistar.',
      historyTitle: 'Vår historie',
      historyText: `Voss Taxi har djupe røter i lokalsamfunnet og lang erfaring med transport i området. Gjennom åra har me bygd opp ein solid rykte for påliteleg service og lokal kunnskap.

Me kjenner området som vår eigen bukselomme - frå dei beste køyrerutene til dei vakreste utsiktspunkta. Dette gjer oss til den perfekte partnaren for både daglege køyreturar og spesielle opplevingar i fjordlandet.`,
      valuesTitle: 'Våre verdiar',
      values: [
        {
          title: 'Tryggleik',
          description: 'Sikkerheit er alltid vår første prioritet. Alle våre bilar er godt vedlikehaldne og sjåførane våre er erfarne profesjonelle.',
        },
        {
          title: 'Påliteleg service',
          description: 'Me er her når du treng oss, 24 timar i døgeret, 365 dagar i året. Du kan stole på at me kjem når me seier det.',
        },
        {
          title: 'Lokal kunnskap',
          description: 'Som lokalbebuarar kjenner me alle vegane, alle stadar og kan gi deg tips om dei beste opplevingane i området.',
        },
        {
          title: 'Kundeservice',
          description: 'Venleg og profesjonell service er viktig for oss. Me vil at du skal ha ei god oppleving frå bestilling til framkomst.',
        },
      ],
      servicesTitle: 'Kva me tilbyr',
      services: [
        'Flyplasstransport til Bergen, Oslo og andre flyplassar',
        'Lokale køyreturar i Voss og omegn',
        'Turist- og sightseeingturar',
        'Rullestoltaxi',
        'Maxi taxi for grupper (opptil 16 personar)',
        'Bedriftstransport og fakturering',
        'Transport til arrangement og feirar',
      ],
      teamTitle: 'Vårt team',
      teamText: 'Me er ei gruppe erfarne sjåførar som er lidenskapleg opptekne av å gi god service. Alle våre sjåførar har lokal kunnskap, er venlege og profesjonelle, og snakkar både norsk og engelsk.',
      contactTitle: 'Ta kontakt',
      contactText: 'Har du spørsmål eller vil du bestille? Ta gjerne kontakt med oss.',
    },
    en: {
      title: 'About Voss Taxi',
      subtitle: 'Local knowledge, safe driving',
      intro: 'Voss Taxi has been a reliable transport partner in Voss and surrounding areas for many years. We are proud to offer safe, comfortable and professional taxi service to both local residents and tourists.',
      historyTitle: 'Our History',
      historyText: `Voss Taxi has deep roots in the local community and long experience with transport in the area. Over the years, we have built a solid reputation for reliable service and local knowledge.

We know the area like the back of our hand - from the best driving routes to the most beautiful viewpoints. This makes us the perfect partner for both daily journeys and special experiences in the fjord country.`,
      valuesTitle: 'Our Values',
      values: [
        {
          title: 'Safety',
          description: 'Safety is always our first priority. All our vehicles are well-maintained and our drivers are experienced professionals.',
        },
        {
          title: 'Reliable Service',
          description: 'We are here when you need us, 24 hours a day, 365 days a year. You can trust that we will arrive when we say we will.',
        },
        {
          title: 'Local Knowledge',
          description: 'As local residents, we know all the roads, all the places, and can give you tips on the best experiences in the area.',
        },
        {
          title: 'Customer Service',
          description: 'Friendly and professional service is important to us. We want you to have a good experience from booking to arrival.',
        },
      ],
      servicesTitle: 'What We Offer',
      services: [
        'Airport transfers to Bergen, Oslo and other airports',
        'Local rides in Voss and surrounding areas',
        'Tourist and sightseeing tours',
        'Wheelchair accessible taxi',
        'Maxi taxi for groups (up to 16 people)',
        'Business transport and invoicing',
        'Transport for events and celebrations',
      ],
      teamTitle: 'Our Team',
      teamText: 'We are a group of experienced drivers who are passionate about providing good service. All our drivers have local knowledge, are friendly and professional, and speak both Norwegian and English.',
      contactTitle: 'Get in Touch',
      contactText: 'Do you have questions or want to book? Please feel free to contact us.',
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Hero */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t.title}
          </h1>
          <p className="text-2xl text-taxi-yellow font-medium mb-6">
            {t.subtitle}
          </p>
          <p className="text-xl text-taxi-grey max-w-4xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* History */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{t.historyTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-taxi-grey leading-relaxed whitespace-pre-line text-lg">
                {t.historyText}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
            {t.valuesTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.values.map((value, index) => (
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
        </div>

        {/* Services */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
            {t.servicesTitle}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="grid md:grid-cols-2 gap-4">
                {t.services.map((service, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-taxi-yellow mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-taxi-grey">{service}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-taxi-light-grey to-white">
            <CardHeader>
              <CardTitle className="text-3xl">{t.teamTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-taxi-grey leading-relaxed">
                {t.teamText}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="bg-taxi-black text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {t.contactTitle}
          </h2>
          <p className="text-taxi-light-grey text-lg mb-8">
            {t.contactText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/book`}>
              <Button size="lg" variant="primary">
                {locale === 'no' ? 'Bestill no' : 'Book now'}
              </Button>
            </Link>
            <a href="tel:+4756511340">
              <Button size="lg" variant="secondary">
                {locale === 'no' ? 'Ring oss' : 'Call us'}: +47 56 51 13 40
              </Button>
            </a>
            <Link href={`/${locale}/contact`}>
              <Button size="lg" variant="secondary">
                {locale === 'no' ? 'Kontaktside' : 'Contact page'}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
