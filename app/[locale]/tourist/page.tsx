import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default async function TouristPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tourist');
  const tCta = await getTranslations('cta');

  const destinations = [
    {
      slug: 'stalheimskleiva',
      name: 'Stalheimskleiva',
      description: locale === 'no'
        ? 'Opplev Norges brattaste veg med spektakulær utsikt over Nærøydalen.'
        : 'Experience Norway\'s steepest road with spectacular views over Nærøydalen valley.',
      price: 800,
      duration: locale === 'no' ? '2-3 timar' : '2-3 hours',
      image: '/images/destinations/stalheimskleiva.jpg',
    },
    {
      slug: 'tvindefossen',
      name: 'Tvindefossen',
      description: locale === 'no'
        ? 'Besøk den 152m høge fossen med legendariske foryngelseskrefter.'
        : 'Visit the 152m waterfall with legendary rejuvenation powers.',
      price: 600,
      duration: locale === 'no' ? '1-2 timar' : '1-2 hours',
      image: '/images/destinations/tvindefossen.jpg',
    },
    {
      slug: 'skjervsfossen',
      name: 'Skjervsfossen',
      description: locale === 'no'
        ? 'Ein spektakulær tvillingfoss langs Norges vakreste turistveg.'
        : 'A spectacular twin waterfall along Norway\'s most beautiful tourist route.',
      price: 700,
      duration: locale === 'no' ? '1.5-2 timar' : '1.5-2 hours',
      image: '/images/destinations/skjervsfossen.jpg',
    },
    {
      slug: 'naeroyfjorden',
      name: 'Nærøyfjorden',
      description: locale === 'no'
        ? 'Komplett tur til UNESCO-fjorden Nærøyfjorden. Perfekt for cruise-passasjerar.'
        : 'Complete tour to the UNESCO fjord Nærøyfjorden. Perfect for cruise passengers.',
      price: 1500,
      duration: locale === 'no' ? '3-4 timar' : '3-4 hours',
      image: '/images/destinations/naeroyfjorden.jpg',
    },
    {
      slug: 'gudvangen',
      name: 'Gudvangen',
      description: locale === 'no'
        ? 'Utforsk vikinglandsbyen ved enden av den vakre Nærøyfjorden.'
        : 'Explore the Viking village at the end of the beautiful Nærøyfjorden.',
      price: 1400,
      duration: locale === 'no' ? '3-4 timar' : '3-4 hours',
      image: '/images/destinations/gudvangen.jpg',
    },
    {
      slug: 'bordalsgjelet',
      name: 'Bordalsgjelet',
      description: locale === 'no'
        ? 'Dramatisk naturattraksjon i gangavstand frå Voss sentrum.'
        : 'Dramatic natural attraction within walking distance from Voss center.',
      price: 400,
      duration: locale === 'no' ? '1 time' : '1 hour',
      image: '/images/destinations/bordalsgjelet.jpg',
    },
    {
      slug: 'molstertunet',
      name: 'Mølstertunet',
      description: locale === 'no'
        ? 'Besøk Voss Folkemuseum med autentiske gårdstun frå 1917.'
        : 'Visit Voss Folk Museum with authentic farmsteads from 1917.',
      price: 500,
      duration: locale === 'no' ? '1-2 timar' : '1-2 hours',
      image: '/images/destinations/molstertunet.jpg',
    },
    {
      slug: 'bergen',
      name: 'Bergen',
      description: locale === 'no'
        ? 'Heildagstur til Bergen. Opplev Bryggen, Fløyen og byens mange butikkar.'
        : 'Full day tour to Bergen. Experience Bryggen, Fløyen and the city\'s many shops.',
      price: 2200,
      duration: locale === 'no' ? '6-8 timar' : '6-8 hours',
      image: '/images/destinations/bergen.jpg',
    },
    {
      slug: 'flam',
      name: 'Flåm',
      description: locale === 'no'
        ? 'Besøk den berømte Flåmsbana. Me køyrer deg dit og ventar medan du nyt togtur.'
        : 'Visit the famous Flåm Railway. We drive you there and wait while you enjoy the train ride.',
      price: 1800,
      duration: locale === 'no' ? '5-6 timar' : '5-6 hours',
      image: '/images/destinations/flam.jpg',
    },
  ];

  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {locale === 'no' ? 'Utflukter & Sightseeing' : 'Tours & Sightseeing'}
          </h1>
          <p className="text-2xl text-taxi-yellow font-medium mb-6">
            {locale === 'no' ? 'Opplev det beste av Voss og omegn' : 'Experience the best of Voss and surroundings'}
          </p>
          <p className="text-xl text-taxi-grey max-w-4xl mx-auto mb-8">
            {locale === 'no'
              ? 'Voss er omkransa av fantastisk natur. Lat oss vise deg dei beste stadene!'
              : 'Voss is surrounded by fantastic nature. Let us show you the best places!'}
          </p>
          <div className="max-w-3xl mx-auto bg-taxi-light-grey rounded-xl p-6">
            <p className="text-taxi-grey leading-relaxed">
              {locale === 'no'
                ? 'Våre sjåførar kan vise deg de beste severdighetene her på Voss. Du kan stoppe undervegs for å besøke de ulike destinasjonene, og du bestemmer selv hvor du vil begynne og avslutte reisen. Med Voss Taxi kan du skreddersy din egen sightseeing utflukt og gå akkurat der du vil gå i ditt eget tempo.'
                : 'Our drivers can show you the best sights here in Voss. You can stop along the way to visit the various destinations, and you decide where you want to start and end the journey. With Voss Taxi you can tailor your own sightseeing trip and go exactly where you want at your own pace.'}
            </p>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
            {locale === 'no' ? 'Populære Destinasjonar' : 'Popular Destinations'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Link
                key={destination.slug}
                href={`/${locale}/destinations/${destination.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-taxi-grey to-taxi-black overflow-hidden">
                    <div className="absolute inset-0 bg-taxi-yellow/10 group-hover:bg-taxi-yellow/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center p-6">
                        <svg
                          className="w-12 h-12 mx-auto opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    {/* Price badge */}
                    <div className="absolute top-4 right-4 bg-taxi-yellow text-taxi-black px-3 py-1 rounded-full font-bold text-sm">
                      {locale === 'no' ? 'Frå' : 'From'} {destination.price} NOK
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-taxi-yellow transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-taxi-grey mb-4 flex-grow">
                      {destination.description}
                    </p>

                    {/* Duration */}
                    <div className="flex items-center text-sm text-taxi-grey mb-4">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {locale === 'no' ? 'Varigheit:' : 'Duration:'} {destination.duration}
                    </div>

                    <div className="flex items-center text-taxi-yellow font-medium">
                      <span className="mr-2">
                        {locale === 'no' ? 'Les meir' : 'Read more'}
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
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-16 shadow-md">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">
              {locale === 'no' ? 'Slik fungerer det' : 'How it works'}
            </h2>
            <div className="space-y-4 text-taxi-grey text-lg leading-relaxed">
              <p>
                {locale === 'no'
                  ? 'Me tilbyr sightseeing på Voss for 1-16 passasjerer. Våre kjøretøyer kommer med profesjonelle og erfarne sjåfører med kjennskap til området.'
                  : 'We offer sightseeing in Voss for 1-16 passengers. Our vehicles come with professional and experienced drivers with knowledge of the area.'}
              </p>
              <p>
                {locale === 'no'
                  ? 'Me er glade for å gi forslag til ruter, men vil tilpasse ekskursjon til ønskene og interessene til deg og dine andre medreisende.'
                  : 'We are happy to provide route suggestions, but will tailor the excursion to the wishes and interests of you and your fellow travelers.'}
              </p>
            </div>
          </div>
        </div>

        {/* Custom Tours */}
        <div className="bg-gradient-to-br from-taxi-yellow/10 to-white rounded-2xl p-8 md:p-12 border border-taxi-yellow/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {locale === 'no' ? 'Skreddarsydd Tur?' : 'Custom Tour?'}
            </h2>
            <p className="text-lg text-taxi-grey mb-8">
              {locale === 'no'
                ? 'Vil du kombinere fleire destinasjonar eller har du spesielle ønskje? Me lagar gjerne ein skreddarsydd tur for deg!'
                : 'Want to combine multiple destinations or have special requests? We are happy to create a custom tour for you!'}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-xl mb-2">
                  {locale === 'no' ? 'Kapasitet' : 'Capacity'}
                </h3>
                <p className="text-taxi-grey">
                  {locale === 'no' ? '1-16 passasjerar' : '1-16 passengers'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-xl mb-2">24/7</h3>
                <p className="text-taxi-grey">
                  {locale === 'no'
                    ? 'Tilgjengeleg kvar dag'
                    : 'Available every day'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-xl mb-2">
                  {locale === 'no' ? 'Lokal kunnskap' : 'Local knowledge'}
                </h3>
                <p className="text-taxi-grey">
                  {locale === 'no'
                    ? 'Erfarne lokale sjåførar'
                    : 'Experienced local drivers'}
                </p>
              </div>
            </div>

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
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
