'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  locale: string;
}

export function FAQ({ locale }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const content = {
    no: {
      title: 'Ofte Stilte Spørsmål',
      subtitle: 'Alt du treng å vita om Voss Taxi sine tenester',
      faqs: [
        {
          question: 'Korleis bestiller eg ein taxi?',
          answer: 'Du kan bestille taxi på tre måtar: Ring oss direkte på +47 56 51 13 40 (tilgjengeleg 24/7), bruk bestillingsskjemaet på nettsida vår, eller via appen vår. Me anbefaler å bestille på førehand for flyplasstransport og lengre turar, men me tek også imot akutt-bestillingar.',
        },
        {
          question: 'Kva område dekker Voss Taxi?',
          answer: 'Me dekker heile Voss kommune og omegn. Me tilbyr også transport til Bergen Flesland lufthamn, Flåm, Sognefjorden, og andre destinasjonar i Vestland fylke. Kontakt oss gjerne for ein prissituasjon på lengre turar.',
        },
        {
          question: 'Har de rullestolvennlege køyretøy?',
          answer: 'Ja! Me har spesialtilpassa køyretøy med rampe eller lift for rullestolbrukarar. Bestill gjerne på førehand slik at me kan sikre at rett køyretøy er tilgjengeleg når du treng det.',
        },
        {
          question: 'Kva betalingsmetodar aksepterer de?',
          answer: 'Me tek imot kontant betaling, alle typar bankkort (Visa, Mastercard, Amex), Vipps, og fakturaavtalar for bedrifter. All betaling skjer direkte med sjåføren eller via app.',
        },
        {
          question: 'Kor lang tid tek det frå Voss til Bergen lufthamn?',
          answer: 'Køyretida frå Voss sentrum til Bergen Flesland lufthamn er om lag 1 time og 20 minutt under normale vêrforhold. Me følgjer alltid opp trafikk og vêrforhold for å sikre at du kjem fram i tide.',
        },
        {
          question: 'Kan eg avbestille ein taxi?',
          answer: 'Ja, du kan avbestille via "Sjekk din bestilling"-funksjonen på nettsida, så lenge taxien ikkje har akseptert turen enno. Når ein sjåfør har akseptert, må du ringe oss direkte på +47 56 51 13 40 for å avbestille.',
        },
        {
          question: 'Er taxiane reine og trygge?',
          answer: 'Absolutt! Alle køyretøya våre blir reingjort dagleg og får omfattande service og kontroll. Alle sjåførane har politiattest og lang røynsle. Tryggleiken til kundar og sjåførar er vår høgaste prioritet.',
        },
        {
          question: 'Tilbyr de sightseeing-turar?',
          answer: 'Ja! Me tilbyr skreddarsydde sightseeing-turar til Stalheimskleiva, Tvindefossen, Bordalsgjelet, og andre spennande destinasjonar. Sjåførane våre har lokal kunnskap og kan gje deg tips og informasjon undervegs.',
        },
        {
          question: 'Kan eg bestille maxi-taxi for større grupper?',
          answer: 'Ja, me har maxi-taxiar med plass til opp til 8 passasjerar pluss bagasje. Perfekt for familiar, vener, eller mindre grupper. Bestill gjerne på førehand for å sikre tilgjenge.',
        },
        {
          question: 'Snakkar sjåførane engelsk?',
          answer: 'Ja! Alle sjåførane våre snakkar både norsk og engelsk. Mange snakkar også andre språk som tysk, nederlandsk og polsk. Me er vande med internasjonale gjestar.',
        },
        {
          question: 'Kva er prisane for dei mest populære turane?',
          answer: 'Prisar varierer avhengig av distanse og køyretøy. Bergen lufthamn: ca. 1.800-2.200 kr, Stalheimskleiva tur-retur: ca. 800-1.000 kr, Flåm: ca. 2.500-3.000 kr. Kontakt oss for eksakt prissituasjon.',
        },
        {
          question: 'Er Voss Taxi open 24/7?',
          answer: 'Ja! Me er tilgjengelege heile døgnet, alle dagar i året - også julaften og nyttårsaften. Uansett når du treng transport, er me klare til å hjelpe deg.',
        },
      ],
    },
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about Voss Taxi services',
      faqs: [
        {
          question: 'How do I book a taxi?',
          answer: 'You can book a taxi in three ways: Call us directly at +47 56 51 13 40 (available 24/7), use the booking form on our website, or via our app. We recommend booking in advance for airport transfers and longer trips, but we also accept immediate bookings.',
        },
        {
          question: 'What areas does Voss Taxi cover?',
          answer: 'We cover the entire Voss municipality and surrounding areas. We also offer transport to Bergen Flesland Airport, Flåm, Sognefjord, and other destinations in Vestland county. Feel free to contact us for a price quote on longer trips.',
        },
        {
          question: 'Do you have wheelchair accessible vehicles?',
          answer: 'Yes! We have specially adapted vehicles with ramps or lifts for wheelchair users. Please book in advance so we can ensure the right vehicle is available when you need it.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept cash payments, all types of bank cards (Visa, Mastercard, Amex), Vipps, and invoice agreements for businesses. All payments are made directly with the driver or via the app.',
        },
        {
          question: 'How long does it take from Voss to Bergen Airport?',
          answer: 'The drive from Voss center to Bergen Flesland Airport takes approximately 1 hour and 20 minutes under normal weather conditions. We always monitor traffic and weather conditions to ensure you arrive on time.',
        },
        {
          question: 'Can I cancel a taxi booking?',
          answer: 'Yes, you can cancel via the "Check your booking" function on the website, as long as the taxi hasn\'t accepted the trip yet. Once a driver has accepted, you must call us directly at +47 56 51 13 40 to cancel.',
        },
        {
          question: 'Are the taxis clean and safe?',
          answer: 'Absolutely! All our vehicles are cleaned daily and receive comprehensive service and inspections. All drivers have police clearance and extensive experience. The safety of customers and drivers is our highest priority.',
        },
        {
          question: 'Do you offer sightseeing tours?',
          answer: 'Yes! We offer customized sightseeing tours to Stalheimskleiva, Tvindefossen, Bordalsgjelet, and other exciting destinations. Our drivers have local knowledge and can give you tips and information along the way.',
        },
        {
          question: 'Can I book a maxi-taxi for larger groups?',
          answer: 'Yes, we have maxi-taxis with space for up to 8 passengers plus luggage. Perfect for families, friends, or small groups. Please book in advance to ensure availability.',
        },
        {
          question: 'Do the drivers speak English?',
          answer: 'Yes! All our drivers speak both Norwegian and English. Many also speak other languages such as German, Dutch, and Polish. We are used to international guests.',
        },
        {
          question: 'What are the prices for the most popular trips?',
          answer: 'Prices vary depending on distance and vehicle. Bergen Airport: approx. 1,800-2,200 NOK, Stalheimskleiva round trip: approx. 800-1,000 NOK, Flåm: approx. 2,500-3,000 NOK. Contact us for exact pricing.',
        },
        {
          question: 'Is Voss Taxi open 24/7?',
          answer: 'Yes! We are available around the clock, every day of the year - including Christmas Eve and New Year\'s Eve. Whenever you need transport, we are ready to help you.',
        },
      ],
    },
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-b from-taxi-light-grey/30 via-white to-taxi-light-grey/30 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-taxi-yellow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass-dark backdrop-blur-xl px-8 py-3 rounded-full mb-6 depth-2">
            <span className="text-taxi-yellow font-bold">❓ FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-taxi-grey max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {t.faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-strong backdrop-blur-xl rounded-2xl overflow-hidden depth-2 hover-lift smooth-transition"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between group"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg md:text-xl font-bold text-taxi-black group-hover:text-taxi-yellow smooth-transition pr-8">
                    {faq.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full glass-dark flex items-center justify-center text-taxi-yellow smooth-transition ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden smooth-transition ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-taxi-grey leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="glass-dark backdrop-blur-xl rounded-3xl p-8 md:p-12 depth-3 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {locale === 'no' ? 'Har du fleire spørsmål?' : 'Have more questions?'}
            </h3>
            <p className="text-taxi-light-grey/90 mb-6">
              {locale === 'no'
                ? 'Me er alltid klare til å hjelpe deg. Ring oss eller send ein e-post.'
                : 'We\'re always ready to help you. Give us a call or send an email.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+4756511340"
                className="glass-yellow rounded-full px-8 py-4 font-bold text-taxi-black hover-scale smooth-transition depth-2 inline-flex items-center justify-center"
              >
                <span className="mr-2">📞</span>
                +47 56 51 13 40
              </a>
              <a
                href="mailto:post@vosstaxi.no"
                className="glass-strong backdrop-blur-xl rounded-full px-8 py-4 font-bold text-white hover:text-taxi-yellow hover-lift smooth-transition depth-2 inline-flex items-center justify-center"
              >
                <span className="mr-2">✉️</span>
                post@vosstaxi.no
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
