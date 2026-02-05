import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function TvindefossenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Tvindefossen',
      subtitle: 'Ein av Vestlandets vakreste fossar',
      description: 'Tvindefossen er ein 152 meter høg foss som ligg like ved Riksveg 7 mellom Voss og Granvin. Fossen er lett tilgjengeleg og ein av dei mest fotograferte fossane på Vestlandet.',
      history: {
        title: 'Historie og mytologi',
        content: `Tvindefossen har lenge vore ein kjend attraksjon langs den gamle vegen mellom Voss og Hardanger. Namnet kjem av det gamle norrøne ordet "tvinna" som tyder å tvinna eller fletta saman, noko som siktar til måten vatnet fløymer nedover fjellet.

I gamle dagar var det tradisjon for at brudepar som køyrde forbi fossen skulle stoppe og drikke av fossevatnet. Det vart sagt at dette skulle bringe lykke i ekteskapet.

I dag er Tvindefossen ein populær stoppeplass for turistar, med kafé, suvenirbutikk og gode fotomoglegheiter. Fossen er særleg imponerande om våren når snøen smeltar, og vatnet er på sitt mest kraftfulle.`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          '152 meter høg foss',
          'Spektakulært om våren med smeltevann',
          'Lett tilgjengeleg frå vegen',
          'Kafé og suvenirbutikk',
          'Populær fotostopplass',
          'Nær Vossevangen (15 min)',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Høgde: 152 meter',
          'Alltid open og gratis adgang',
          'Parkering: Like ved fossen',
          'Fasiliteter: Toalett, kafé, butikk',
          'Køyretid frå Voss: Ca. 15 minutt',
          'Best tidspunkt: Vår/sommar',
        ],
      },
      bookTour: 'Bestill tur til Tvindefossen',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Tvindefossen',
      subtitle: 'One of Western Norway\'s most beautiful waterfalls',
      description: 'Tvindefossen is a 152-meter high waterfall located right by Highway 7 between Voss and Granvin. The waterfall is easily accessible and one of the most photographed waterfalls in Western Norway.',
      history: {
        title: 'History and Mythology',
        content: `Tvindefossen has long been a well-known attraction along the old road between Voss and Hardanger. The name comes from the Old Norse word "tvinna" meaning to twine or braid together, referring to the way the water flows down the mountain.

In the old days, it was tradition for bridal couples passing by the waterfall to stop and drink from the waterfall water. It was said that this would bring happiness to the marriage.

Today, Tvindefossen is a popular stop for tourists, with a café, souvenir shop, and great photo opportunities. The waterfall is particularly impressive in spring when the snow melts and the water is at its most powerful.`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          '152-meter high waterfall',
          'Spectacular in spring with meltwater',
          'Easily accessible from the road',
          'Café and souvenir shop',
          'Popular photo stop',
          'Near Vossevangen (15 min)',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Height: 152 meters',
          'Always open and free admission',
          'Parking: Right by the waterfall',
          'Facilities: Restroom, café, shop',
          'Driving time from Voss: Approx. 15 minutes',
          'Best time: Spring/summer',
        ],
      },
      bookTour: 'Book tour to Tvindefossen',
      backToDestinations: 'Back to all destinations',
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        <Link
          href={`/${locale}/tourist`}
          className="inline-flex items-center text-taxi-grey hover:text-taxi-yellow transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.backToDestinations}
        </Link>

        <div className="relative h-96 bg-gradient-to-br from-taxi-grey to-taxi-black rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-taxi-yellow/10" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h1 className="text-5xl font-display font-bold mb-2">{t.title}</h1>
              <p className="text-xl opacity-90">{t.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <p className="text-lg text-taxi-grey leading-relaxed">{t.description}</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">{t.history.title}</h2>
              <div className="text-taxi-grey leading-relaxed whitespace-pre-line">{t.history.content}</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">{t.highlights.title}</h2>
              <ul className="space-y-3">
                {t.highlights.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-taxi-yellow mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-taxi-grey">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-6">{locale === 'no' ? 'Bilete' : 'Photos'}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-gradient-to-br from-taxi-grey to-taxi-black rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h3 className="text-2xl font-display font-bold mb-4">{t.info.title}</h3>
              <ul className="space-y-3 mb-6">
                {t.info.items.map((item, index) => (
                  <li key={index} className="text-sm text-taxi-grey flex items-start">
                    <svg className="w-5 h-5 text-taxi-yellow mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="border-t border-taxi-light-grey pt-6 space-y-3">
                <Link href={`/${locale}/book`}>
                  <Button className="w-full" size="lg">{t.bookTour}</Button>
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
