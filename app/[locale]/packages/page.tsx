import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Pakker & Turar',
      subtitle: 'Populære turar og prisar',
      intro: 'Me tilbyr fleire faste turar og pakkar til populære destinasjonar. Alle prisar er rettleiande og kan variere etter årstid og etterspørsel.',
      customTitle: 'Tilpassa turar',
      customDescription: 'Me lagar også turar etter dine ønskje. Kontakt oss for pris og bestilling.',
      bookNow: 'Bestill no',
      fromPrice: 'Frå',
      perTrip: 'per tur',
      includes: 'Inkluderer',
      duration: 'Varigheit',
      passengers: 'Passasjerar',
      note: 'Merk',
      noteText: 'Alle prisar er rettleiande. Endeleg pris avheng av konkrete forhold som tid på døgeret, vekedag, og nøyaktig rute.',
    },
    en: {
      title: 'Packages & Tours',
      subtitle: 'Popular tours and pricing',
      intro: 'We offer several fixed tours and packages to popular destinations. All prices are indicative and may vary depending on season and demand.',
      customTitle: 'Custom Tours',
      customDescription: 'We also create tours according to your wishes. Contact us for price and booking.',
      bookNow: 'Book now',
      fromPrice: 'From',
      perTrip: 'per trip',
      includes: 'Includes',
      duration: 'Duration',
      passengers: 'Passengers',
      note: 'Note',
      noteText: 'All prices are indicative. Final price depends on specific circumstances such as time of day, weekday, and exact route.',
    },
  };

  const t = content[locale as 'no' | 'en'];

  const packages = [
    {
      id: 'airport-bergen',
      name: locale === 'no' ? 'Flyplasstransport Bergen' : 'Airport Transfer Bergen',
      destination: 'Voss ↔ Bergen Flesland',
      price: '1800',
      duration: locale === 'no' ? '1-1.5 timar' : '1-1.5 hours',
      passengers: '1-4',
      includes: [
        locale === 'no' ? 'Døgnopen service' : '24/7 service',
        locale === 'no' ? 'Hjelp med bagasje' : 'Help with luggage',
        locale === 'no' ? 'Møter på flyplassen' : 'Meet at airport',
      ],
      description: locale === 'no'
        ? 'Trygg og komfortabel transport mellom Voss og Bergen Lufthamn Flesland.'
        : 'Safe and comfortable transport between Voss and Bergen Airport Flesland.',
    },
    {
      id: 'stalheimskleiva-tour',
      name: 'Stalheimskleiva-tur',
      destination: 'Voss → Stalheimskleiva → Voss',
      price: '1200',
      duration: locale === 'no' ? '2-3 timar' : '2-3 hours',
      passengers: '1-4',
      includes: [
        locale === 'no' ? 'Erfaren lokal sjåfør' : 'Experienced local driver',
        locale === 'no' ? 'Stopp for foto' : 'Photo stops',
        locale === 'no' ? 'Informasjon om området' : 'Area information',
      ],
      description: locale === 'no'
        ? 'Opplev Norges brattaste veg med spektakulær utsikt over Nærøydalen.'
        : 'Experience Norway\'s steepest road with spectacular views over Nærøydalen valley.',
    },
    {
      id: 'fjord-tour',
      name: locale === 'no' ? 'Fjordtur til Nærøyfjorden' : 'Fjord Tour to Nærøyfjorden',
      destination: 'Voss → Gudvangen → Voss',
      price: '1500',
      duration: locale === 'no' ? '3-4 timar' : '3-4 hours',
      passengers: '1-4',
      includes: [
        locale === 'no' ? 'Køyring til Gudvangen' : 'Drive to Gudvangen',
        locale === 'no' ? 'Tid til fjordcruise (ikkje inkludert)' : 'Time for fjord cruise (not included)',
        locale === 'no' ? 'Retur til Voss' : 'Return to Voss',
      ],
      description: locale === 'no'
        ? 'Komplett tur til UNESCO-fjorden Nærøyfjorden. Perfekt for cruise-passasjerar.'
        : 'Complete tour to UNESCO fjord Nærøyfjorden. Perfect for cruise passengers.',
    },
    {
      id: 'flam-railway',
      name: locale === 'no' ? 'Flåmsbana-pakke' : 'Flåm Railway Package',
      destination: 'Voss → Flåm → Voss',
      price: '1800',
      duration: locale === 'no' ? '4-5 timar' : '4-5 hours',
      passengers: '1-4',
      includes: [
        locale === 'no' ? 'Transport til Flåm' : 'Transport to Flåm',
        locale === 'no' ? 'Tid til togtur' : 'Time for train ride',
        locale === 'no' ? 'Lokal guide' : 'Local guide',
      ],
      description: locale === 'no'
        ? 'Besøk den berømte Flåmsbana. Me køyrer deg dit og ventar medan du nyt togturen.'
        : 'Visit the famous Flåm Railway. We drive you there and wait while you enjoy the train ride.',
    },
    {
      id: 'bergen-city',
      name: locale === 'no' ? 'Bergen bytur' : 'Bergen City Tour',
      destination: 'Voss → Bergen → Voss',
      price: '2200',
      duration: locale === 'no' ? 'Heildagstur' : 'Full day tour',
      passengers: '1-4',
      includes: [
        locale === 'no' ? 'Transport til Bergen' : 'Transport to Bergen',
        locale === 'no' ? 'Tid til shopping og sightseeing' : 'Time for shopping and sightseeing',
        locale === 'no' ? 'Tips om severdheiter' : 'Tips on attractions',
      ],
      description: locale === 'no'
        ? 'Heildagstur til Bergen. Opplev Bryggen, Fløyen og byens mange butikkar.'
        : 'Full day tour to Bergen. Experience Bryggen, Fløyen and the city\'s many shops.',
    },
    {
      id: 'custom-group',
      name: locale === 'no' ? 'Gruppeturar (5-16 pers)' : 'Group Tours (5-16 people)',
      destination: locale === 'no' ? 'Etter avtale' : 'By arrangement',
      price: locale === 'no' ? 'På førespurnad' : 'On request',
      duration: locale === 'no' ? 'Fleksibel' : 'Flexible',
      passengers: '5-16',
      includes: [
        locale === 'no' ? 'Maxi taxi' : 'Maxi taxi',
        locale === 'no' ? 'Erfaren sjåfør' : 'Experienced driver',
        locale === 'no' ? 'Tilpassa rute' : 'Customized route',
      ],
      description: locale === 'no'
        ? 'For større grupper tilbyr me maxi taxi med plass til opptil 16 personar.'
        : 'For larger groups we offer maxi taxi with room for up to 16 people.',
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-taxi-grey max-w-3xl mx-auto mb-8">
            {t.subtitle}
          </p>
          <p className="text-lg text-taxi-grey max-w-4xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => (
            <Card key={pkg.id} variant="hover" className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                <CardDescription className="text-lg font-medium text-taxi-yellow">
                  {pkg.destination}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-taxi-grey mb-4 flex-1">{pkg.description}</p>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-taxi-light-grey">
                  {pkg.price === (locale === 'no' ? 'På førespurnad' : 'On request') ? (
                    <p className="text-2xl font-bold">{pkg.price}</p>
                  ) : (
                    <div>
                      <p className="text-sm text-taxi-grey">{t.fromPrice}</p>
                      <p className="text-3xl font-bold text-taxi-yellow">
                        {pkg.price} NOK
                      </p>
                      <p className="text-sm text-taxi-grey">{t.perTrip}</p>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-taxi-grey">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t.duration}: {pkg.duration}</span>
                  </div>
                  <div className="flex items-center text-taxi-grey">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{t.passengers}: {pkg.passengers}</span>
                  </div>
                </div>

                {/* Includes */}
                <div className="mb-6">
                  <p className="font-bold text-sm mb-2">{t.includes}:</p>
                  <ul className="space-y-1">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-taxi-grey">
                        <svg className="w-4 h-4 text-taxi-yellow mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link href={`/${locale}/book`}>
                  <Button className="w-full">
                    {t.bookNow}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Tours Section */}
        <div className="bg-taxi-black text-white rounded-2xl p-8 md:p-12 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {t.customTitle}
          </h2>
          <p className="text-taxi-light-grey text-lg mb-8 max-w-2xl mx-auto">
            {t.customDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/book`}>
              <Button size="lg" variant="primary">
                {t.bookNow}
              </Button>
            </Link>
            <a href="tel:+4756511340">
              <Button size="lg" variant="secondary">
                {locale === 'no' ? 'Ring oss' : 'Call us'}: +47 56 51 13 40
              </Button>
            </a>
          </div>
        </div>

        {/* Note */}
        <div className="bg-yellow-50 border-l-4 border-taxi-yellow p-6 rounded-r-lg">
          <div className="flex">
            <svg className="w-6 h-6 text-taxi-yellow mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold mb-1">{t.note}</p>
              <p className="text-sm text-taxi-grey">{t.noteText}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
