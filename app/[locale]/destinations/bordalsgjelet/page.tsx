import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function BordalsgjelePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Bordalsgjelet',
      subtitle: 'Dramatisk naturattraksjon i gangavstand',
      description: 'Bordalsgjelet er ein spektakulær naturattraksjon i gangavstand frå Voss sentrum. Det djupe og dramatiske gjelet er tilrettelagt for publikum med utsiktspunkt og benker.',
      history: {
        title: 'Geologi og tilrettelegging',
        content: `Bordalsgjelet er forma av is og elven gjennom årtusen. Det djupe gjelet gir eit fantastisk innblikk i naturkreftene som har forma landskapet vårt.

Når det ikkje er snø og is, er det ein tilrettelagt sti du kan følge innover gjelet. Her får du god utsikt til dei fantastiske jettegrytene som is og elven har formet gjennom tusenvis av år.

Gjelet er tilrettelagt med utsiktspunkt og benker, noko som gjer det til ein populær attraksjon for både lokale og turistar. For di eiga sikkerheit er det viktig å halde seg til dei merkede stiane!`,
      },
      highlights: {
        title: 'Høgdepunkt',
        items: [
          'Dramatisk gjel forma av is og vatn',
          'Spektakulære jettegryter',
          'I gangavstand frå Voss sentrum',
          'Tilrettelagde stiar og utsiktspunkt',
          'Gratis tilgang',
          'Naturopplevelse for heile familien',
          'Geologisk interessant',
        ],
      },
      info: {
        title: 'Praktisk informasjon',
        items: [
          'Avstand frå Voss sentrum: Gangavstand',
          'Tid: 10-15 minutt gåtur',
          'Tilrettelagd sti: Når ikkje snø/is',
          'VIKTIG: Hald deg til merkede stiar',
          'Gratis tilgang',
          'Best tid: Mai - oktober',
        ],
      },
      price: 'Frå 400 NOK per tur',
      bookTour: 'Bestill tur til Bordalsgjelet',
      backToDestinations: 'Tilbake til alle destinasjonar',
    },
    en: {
      title: 'Bordalsgjelet',
      subtitle: 'Dramatic natural attraction within walking distance',
      description: 'Bordalsgjelet is a spectacular natural attraction within walking distance from Voss center. The deep and dramatic gorge is facilitated for the public with viewpoints and benches.',
      history: {
        title: 'Geology and facilitation',
        content: `Bordalsgjelet is formed by ice and the river over thousands of years. The deep gorge provides a fantastic insight into the natural forces that have shaped our landscape.

When there is no snow and ice, there is a facilitated path you can follow into the gorge. Here you get a good view of the fantastic giant's kettles that ice and the river have formed over thousands of years.

The gorge is facilitated with viewpoints and benches, making it a popular attraction for both locals and tourists. For your own safety, it is important to stay on the marked trails!`,
      },
      highlights: {
        title: 'Highlights',
        items: [
          'Dramatic gorge formed by ice and water',
          "Spectacular giant's kettles",
          'Within walking distance from Voss center',
          'Facilitated trails and viewpoints',
          'Free access',
          'Nature experience for the whole family',
          'Geologically interesting',
        ],
      },
      info: {
        title: 'Practical Information',
        items: [
          'Distance from Voss center: Walking distance',
          'Time: 10-15 minute walk',
          'Facilitated path: When no snow/ice',
          'IMPORTANT: Stay on marked trails',
          'Free access',
          'Best time: May - October',
        ],
      },
      price: 'From 400 NOK per tour',
      bookTour: 'Book tour to Bordalsgjelet',
      backToDestinations: 'Back to all destinations',
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white to-taxi-light-grey">
      <Container>
        <Link href={`/${locale}/tourist`} className="inline-flex items-center text-taxi-grey hover:text-taxi-yellow transition-colors mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.backToDestinations}
        </Link>

        <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
          <img
            src="/images/20241014_140924.jpg"
            alt="Bordalsgjelet"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-taxi-black/80 via-taxi-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-5xl font-display font-bold mb-2 drop-shadow-lg">{t.title}</h1>
              <p className="text-xl opacity-90 drop-shadow-lg">{t.subtitle}</p>
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
                {[
                  '/images/20241014_140924.jpg', '/images/20240618_074440.jpg', '/images/20230509_190808.jpg', '/images/20240604_211019.jpg'
                ].map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden">
                    <img src={img} alt={`Bordalsgjelet ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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

              <div className="bg-taxi-yellow/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-taxi-grey font-medium mb-1">{locale === 'no' ? 'Prisestimat' : 'Price estimate'}</p>
                <p className="text-2xl font-bold text-taxi-black">{t.price}</p>
                <p className="text-xs text-taxi-grey mt-1">{locale === 'no' ? 'Varierer etter sesong og gruppe' : 'Varies by season and group'}</p>
              </div>

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
