import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const content = {
  no: {
    hero: {
      title: 'Er du vår nye sjåfør?',
      subtitle: 'Voss Taxi er i vekst og søkjer sjåførar til oppdrag i Voss Herad og omegn.',
    },
    about: {
      title: 'Arbeidsoppgåver',
      description: 'Persontransport, køyring av skuleborn, pasienttransport m.m.',
      seeking: 'Me ser etter:',
      seekingText: 'Sjåførar som er blide og serviceinnstilte personar som likar å jobba med menneske, og er glad i å køyra bil.',
    },
    offer: {
      title: 'Voss Taxi tilbyr',
      subtitle: 'Gratis sjåførkurs!',
      description: 'Tilbodet betinger at du oppfyller vanlige krav for å bli taxisjåfør, det vil sei at du må vere over 20 år og ha hatt førerkort i minst to år. Du må også ha tilfredsstillande norsk-kunnskapar. Du må som sjåførkandidat betale for obligatorisk teoriprøve hos Statens Vegvesen – men denne kostnaden får du refundert dersom du fullfører kurset og byrjer å jobba for ein av våre taxieigarar.',
    },
    requirements: {
      title: 'Formelle krav til drosjesjåfør i Norge - Kjøreseddel',
      intro: 'For å kunna kjøre drosje i Norge må man ha kjøreseddel i tillegg til førerkort. Kravene for at man skal kunna få kjøreseddel er at ein:',
      items: [
        'Må vere fylt 20 år',
        'Må ha hatt førerkort i minimum 2 år samanhengande',
        'Har bestått teoriprøve hos Statens vegvesen – eller YSK for persontransport',
        'Oppfyller helsekravene for persontransport mot vederlag',
        'Har ein slik vandel at politiet ikkje finn vedkommande ueigna til å føre drosje',
        'Søkere frå land utanfor EØS området må ha minimum fire års butid i Noreg',
      ],
    },
    vossRequirements: {
      title: 'I tillegg kjem Voss Taxi krav',
      items: [
        'Gjennomført sjåfør opplæring hjå oss',
        'Kjenntmannsprøve',
        'Beherske norsk skriftleg og muntleg på B2 nivå eller betre',
        'Pliktar å utføre eventuelle kurs sentralen finn naudsynt. Som t.d. førstehjelp.',
        'Underskreven tausheit og lojalitets avtalar med sentralen',
        'Arbeidskontrakt med prøvetidsbestemmelsar',
        'Bestått pasientreiser E Læring kurs',
      ],
    },
    cta: {
      title: 'Send oss ein førespurnad på',
      email: 'sjoff@vosstaxi.no',
      linkTitle: 'Gå inn på lenka under for meir informasjon',
      linkText: 'Vegvesenet',
      linkUrl: 'https://www.vegvesen.no/forerkort/yrkessjaforkompetanse/kjoreseddel-drosje/',
    },
    benefits: {
      title: 'Kvifor jobba hjå Voss Taxi?',
      items: [
        { title: 'Fleksible arbeidstider', description: 'Vel mellom dag, kveld og nattskift. Fulltid og deltid.' },
        { title: 'Gratis sjåførkurs', description: 'Me tilbyr gratis opplæring for nye sjåførar.' },
        { title: 'Godt arbeidsmiljø', description: 'Bli ein del av eit etablert team med lang erfaring.' },
        { title: 'Varierte oppdrag', description: 'Frå lokale turar til sightseeing og flyplasstransport.' },
      ],
    },
  },
  en: {
    hero: {
      title: 'Are you our new driver?',
      subtitle: 'Voss Taxi is growing and looking for drivers for assignments in Voss Municipality and surrounding areas.',
    },
    about: {
      title: 'Work tasks',
      description: 'Passenger transport, school children transport, patient transport, etc.',
      seeking: 'We are looking for:',
      seekingText: 'Drivers who are friendly and service-minded people who enjoy working with people and love driving.',
    },
    offer: {
      title: 'Voss Taxi offers',
      subtitle: 'Free driver course!',
      description: 'The offer requires that you meet the standard requirements to become a taxi driver, which means you must be over 20 years old and have held a driver\'s license for at least two years. You must also have satisfactory Norwegian language skills. As a driver candidate, you must pay for the mandatory theory exam at the Norwegian Public Roads Administration – but this cost will be refunded if you complete the course and start working for one of our taxi owners.',
    },
    requirements: {
      title: 'Formal requirements for taxi drivers in Norway - Driving permit',
      intro: 'To drive a taxi in Norway you must have a driving permit (kjøreseddel) in addition to a driver\'s license. The requirements are:',
      items: [
        'Must be at least 20 years old',
        'Must have held a driver\'s license for a minimum of 2 consecutive years',
        'Have passed the theory exam at the Norwegian Public Roads Administration – or YSK for passenger transport',
        'Meet the health requirements for paid passenger transport',
        'Have a criminal record that the police do not find unsuitable for driving a taxi',
        'Applicants from countries outside the EEA must have a minimum of four years residency in Norway',
      ],
    },
    vossRequirements: {
      title: 'Additional Voss Taxi requirements',
      items: [
        'Completed driver training with us',
        'Local knowledge test',
        'Norwegian written and oral proficiency at B2 level or higher',
        'Obligation to complete any courses the central deems necessary, e.g. first aid',
        'Signed confidentiality and loyalty agreements with the central',
        'Employment contract with probationary period terms',
        'Passed patient transport E-Learning course',
      ],
    },
    cta: {
      title: 'Send us an inquiry at',
      email: 'sjoff@vosstaxi.no',
      linkTitle: 'Visit the link below for more information',
      linkText: 'Norwegian Public Roads Administration',
      linkUrl: 'https://www.vegvesen.no/forerkort/yrkessjaforkompetanse/kjoreseddel-drosje/',
    },
    benefits: {
      title: 'Why work at Voss Taxi?',
      items: [
        { title: 'Flexible working hours', description: 'Choose between day, evening and night shifts. Full-time and part-time.' },
        { title: 'Free driver course', description: 'We offer free training for new drivers.' },
        { title: 'Great work environment', description: 'Become part of an established team with long experience.' },
        { title: 'Varied assignments', description: 'From local trips to sightseeing and airport transfers.' },
      ],
    },
  },
};

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = content[locale as 'no' | 'en'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-taxi-black text-white py-20 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/images/20240604_211019.jpg"
            alt="Voss Taxi"
            fill
            className="object-cover opacity-25"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-taxi-black/70 to-taxi-black/90" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-taxi-light-grey">
              {t.hero.subtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* About & What we look for */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4 border-b-2 border-taxi-yellow pb-2 inline-block">
                  {t.about.title}
                </h2>
                <p className="text-lg text-taxi-grey mt-4">{t.about.description}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 border-b-2 border-taxi-yellow pb-2 inline-block">
                  {t.about.seeking}
                </h2>
                <p className="text-lg text-taxi-grey mt-4">{t.about.seekingText}</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-16">
              <h2 className="text-3xl font-display font-bold text-center mb-10">
                {t.benefits.title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.benefits.items.map((benefit, i) => (
                  <div key={i} className="bg-taxi-light-grey rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-taxi-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-taxi-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-taxi-grey text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Free driver course offer */}
            <div className="bg-gradient-to-br from-taxi-yellow/10 to-white border border-taxi-yellow/30 rounded-2xl p-8 md:p-12 mb-16 text-center">
              <h2 className="text-3xl font-display font-bold mb-2">{t.offer.title}</h2>
              <p className="text-2xl font-bold text-taxi-yellow mb-6">{t.offer.subtitle}</p>
              <p className="text-taxi-grey leading-relaxed max-w-3xl mx-auto">{t.offer.description}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Requirements Section */}
      <section className="py-16 md:py-24 bg-taxi-light-grey">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* National requirements */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-6">
                {t.requirements.title}
              </h2>
              <p className="text-center text-taxi-grey mb-8">{t.requirements.intro}</p>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <ul className="space-y-4">
                  {t.requirements.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-taxi-black rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-taxi-grey">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Voss Taxi requirements */}
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-6">
                {t.vossRequirements.title}
              </h2>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <ul className="space-y-4">
                  {t.vossRequirements.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-taxi-yellow rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-taxi-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-taxi-grey">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-taxi-black text-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t.cta.title}
            </h2>
            <a
              href={`mailto:${t.cta.email}`}
              className="text-3xl md:text-4xl font-bold text-taxi-yellow hover:underline block mb-12"
            >
              {t.cta.email}
            </a>

            <p className="text-xl text-taxi-light-grey mb-6">{t.cta.linkTitle}</p>
            <a
              href={t.cta.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary">
                {t.cta.linkText}
              </Button>
            </a>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-taxi-light-grey mb-4">
                {locale === 'no' ? 'Eller ring oss direkte' : 'Or call us directly'}
              </p>
              <a href="tel:+4756511340" className="text-2xl font-bold text-taxi-yellow hover:underline">
                +47 56 51 13 40
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
