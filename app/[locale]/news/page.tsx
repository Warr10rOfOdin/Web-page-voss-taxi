import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Nyheter og praktisk informasjon',
      subtitle: 'Hald deg oppdatert',
      intro: 'Her finn du dei siste nyheitene frå Voss Taxi, samt praktisk informasjon som kan vere nyttig når du reiser med oss.',
      newsTitle: 'Siste nyheter',
      practicalTitle: 'Praktisk informasjon',
      news: [
        {
          date: '15. januar 2026',
          category: 'Nyheter',
          title: 'Nye elbiler i flåten',
          summary: 'Me er stolte av å presentere våre nye elektriske taxibilar. Som ein del av vårt miljøengasjement har me no fleire elbiler i flåten.',
          content: 'Voss Taxi tek miljøansvar på alvor. I januar 2026 har me teke i bruk fleire nye elektriske taxibilar som er både miljøvenlege og komfortable. Desse moderne bilane gir ei stille og behageleg køyreoppleving, samtidig som me reduserer utslepp og miljøavtrykket vårt. Me vil fortsette å investere i grøne løysingar framover.',
        },
        {
          date: '10. januar 2026',
          category: 'Sesonginfo',
          title: 'Vinterskisesongen 2026',
          summary: 'Voss Vinter Resort er open! Me tilbyr transport til skisenteret og alle andre vinterdestinasjonar i området.',
          content: 'Vintersesongen er her og Voss er klar for skiglade turistar! Me tilbyr transport til Voss Vinter Resort, Myrkdalen og andre populære skidestinasjonar. Treng du skyss til alpinbakkane, langrennsspor eller andre vinteropplevingar? Ring oss på +47 56 51 13 40 eller bestill online. Me har plass til ski, snowboard og anna utstyr.',
        },
        {
          date: '20. desember 2025',
          category: 'Juleinfo',
          title: 'Jule- og nyttårsopningstider',
          summary: 'Voss Taxi held ope heile julen og nyttår. Me er her for deg 24/7, året rundt.',
          content: 'Gode nyheter for alle som skal reise i jula! Voss Taxi er ope alle dagar, inkludert julaften, 1. og 2. juledag, nyttårsaften og nyttårsdag. Me er tilgjengeleg 24 timar i døgeret, 365 dagar i året. Anten du skal til familie, venner eller flyplassen - me er her for deg.',
        },
        {
          date: '1. desember 2025',
          category: 'Tjenester',
          title: 'Bedriftsavtalar for vinteren',
          summary: 'Gode betingelser for bedrifter som treng regelmessig transport. Kontakt oss for tilbod.',
          content: 'Er din bedrift i behov av transport til tilsette eller kundar? Me tilbyr skreddarsydde bedriftsavtalar med gode betingelser. Dette inkluderer fakturering, prioritert booking og faste prisar. Perfekt for bedrifter som treng påliteleg transport til flyplassen, møter eller kundebesøk. Kontakt oss for eit uforpliktande tilbod.',
        },
        {
          date: '15. november 2025',
          category: 'Turist',
          title: 'Vinterturar til Nærøyfjorden',
          summary: 'Opplev den UNESCO-lista fjorden i vinterskrud. Magiske turar med snødekte fjell og stille fjordar.',
          content: 'Nærøyfjorden er spektakulær året rundt, men vinteren gir fjorden ein heilt spesiell magi. Me tilbyr guidede turar til dette fantastiske naturområdet, som er på UNESCOs verdensarvliste. Sjå snødekte fjelltopper spegle seg i den stille fjorden, og opplev den rå naturen i vinterskrud. Perfekt for fotografar og naturelskare.',
        },
        {
          date: '1. november 2025',
          category: 'Praktisk info',
          title: 'Bagasje og utstyr',
          summary: 'Informasjon om bagasje, skiturstyr og anna utstyr i taxien vår.',
          content: 'Me har god plass til bagasje og utstyr i alle våre bilar. Standardtaxien tek lett 3-4 store koffertar, medan maxitaxien har plass til mykje meir. Ski, snowboard, syklar og anna stort utstyr kan normalt takast med utan problem. Har du ekstra mykje bagasje eller overstorlast? Gi oss beskjed ved bestilling, så sikrar me at du får ein bil med nok plass.',
        },
      ],
      practical: [
        {
          icon: 'phone',
          title: 'Bestilling og betaling',
          items: [
            'Ring +47 56 51 13 40 for direkte bestilling',
            'Bestill online via vårt bookingsystem',
            'Me tek imot kontant, kort (Visa/Mastercard) og Vipps',
            'Fakturering tilgjengeleg for bedrifter',
            'Pris blir avtalt ved bestilling',
          ],
        },
        {
          icon: 'clock',
          title: 'Opningstider',
          items: [
            '24 timar i døgeret, 7 dagar i veka',
            'Alltid ope - også høgtidsdagar',
            'Best å bestille i god tid ved spesielle behov',
            'Rask respons på telefonbestillingar',
          ],
        },
        {
          icon: 'car',
          title: 'Våre bilar',
          items: [
            'Standardtaxi: 1-4 passasjerar',
            'Maxitaxi: Opptil 16 passasjerar',
            'Rullestoltaxi: Tilgjengeleg på bestilling',
            'Alle bilar er godt vedlikehaldne og reine',
            'Vinterdekk og fullstendig utstyr',
          ],
        },
        {
          icon: 'map',
          title: 'Vårt område',
          items: [
            'Lokale køyreturar i Voss og omegn',
            'Flyplasstransport til Bergen og Oslo',
            'Langturar etter avtale',
            'Turne heile Vestlandet',
            'Erfaring med fjelloverganger',
          ],
        },
        {
          icon: 'info',
          title: 'Nyttig å vite',
          items: [
            'Alle sjåførar snakkar norsk og engelsk',
            'Lokal kunnskap om vegar og område',
            'Barnesete tilgjengeleg ved bestilling',
            'Hjelp med bagasje inkludert',
            'Dyrevenlege bilar (gi beskjed ved bestilling)',
          ],
        },
        {
          icon: 'weather',
          title: 'Vêr og køyretilhøve',
          items: [
            'Me køyrer i alle vêrforhold',
            'Erfarne sjåførar med lokal kunnskap',
            'Oppdatert informasjon om vêr og vegar',
            'Kontakt oss ved spørsmål om køyretilhøve',
            'Sikkerheit er alltid første prioritet',
          ],
        },
      ],
    },
    en: {
      title: 'News and practical information',
      subtitle: 'Stay updated',
      intro: 'Here you will find the latest news from Voss Taxi, as well as practical information that may be useful when traveling with us.',
      newsTitle: 'Latest news',
      practicalTitle: 'Practical information',
      news: [
        {
          date: 'January 15, 2026',
          category: 'News',
          title: 'New electric vehicles in the fleet',
          summary: 'We are proud to present our new electric taxis. As part of our environmental commitment, we now have several electric vehicles in the fleet.',
          content: 'Voss Taxi takes environmental responsibility seriously. In January 2026, we have put several new electric taxis into use that are both environmentally friendly and comfortable. These modern cars provide a quiet and pleasant driving experience, while reducing our emissions and environmental footprint. We will continue to invest in green solutions going forward.',
        },
        {
          date: 'January 10, 2026',
          category: 'Season info',
          title: 'Winter ski season 2026',
          summary: 'Voss Vinter Resort is open! We offer transport to the ski center and all other winter destinations in the area.',
          content: 'The winter season is here and Voss is ready for ski enthusiasts! We offer transport to Voss Vinter Resort, Myrkdalen and other popular ski destinations. Need a ride to the alpine slopes, cross-country trails or other winter experiences? Call us at +47 56 51 13 40 or book online. We have space for skis, snowboards and other equipment.',
        },
        {
          date: 'December 20, 2025',
          category: 'Holiday info',
          title: 'Christmas and New Year opening hours',
          summary: 'Voss Taxi is open throughout Christmas and New Year. We are here for you 24/7, all year round.',
          content: 'Good news for everyone traveling during Christmas! Voss Taxi is open every day, including Christmas Eve, Christmas Day, Boxing Day, New Year\'s Eve and New Year\'s Day. We are available 24 hours a day, 365 days a year. Whether you are going to family, friends or the airport - we are here for you.',
        },
        {
          date: 'December 1, 2025',
          category: 'Services',
          title: 'Business agreements for winter',
          summary: 'Good terms for businesses that need regular transport. Contact us for a quote.',
          content: 'Does your business need transport for employees or customers? We offer customized business agreements with good terms. This includes invoicing, priority booking and fixed prices. Perfect for businesses that need reliable transport to the airport, meetings or customer visits. Contact us for a non-binding quote.',
        },
        {
          date: 'November 15, 2025',
          category: 'Tourist',
          title: 'Winter tours to Nærøyfjorden',
          summary: 'Experience the UNESCO-listed fjord in winter attire. Magical tours with snow-covered mountains and quiet fjords.',
          content: 'Nærøyfjorden is spectacular all year round, but winter gives the fjord a very special magic. We offer guided tours to this fantastic natural area, which is on UNESCO\'s World Heritage List. See snow-covered mountain peaks reflected in the quiet fjord, and experience the raw nature in winter attire. Perfect for photographers and nature lovers.',
        },
        {
          date: 'November 1, 2025',
          category: 'Practical info',
          title: 'Luggage and equipment',
          summary: 'Information about luggage, ski equipment and other equipment in our taxis.',
          content: 'We have good space for luggage and equipment in all our cars. The standard taxi easily takes 3-4 large suitcases, while the maxi taxi has room for much more. Skis, snowboards, bicycles and other large equipment can normally be brought along without problems. Do you have extra luggage or oversized items? Let us know when booking, so we ensure you get a car with enough space.',
        },
      ],
      practical: [
        {
          icon: 'phone',
          title: 'Booking and payment',
          items: [
            'Call +47 56 51 13 40 for direct booking',
            'Book online via our booking system',
            'We accept cash, card (Visa/Mastercard) and Vipps',
            'Invoicing available for businesses',
            'Price is agreed upon booking',
          ],
        },
        {
          icon: 'clock',
          title: 'Opening hours',
          items: [
            '24 hours a day, 7 days a week',
            'Always open - also on holidays',
            'Best to book well in advance for special needs',
            'Quick response to phone bookings',
          ],
        },
        {
          icon: 'car',
          title: 'Our vehicles',
          items: [
            'Standard taxi: 1-4 passengers',
            'Maxi taxi: Up to 16 passengers',
            'Wheelchair accessible taxi: Available on request',
            'All vehicles are well-maintained and clean',
            'Winter tires and complete equipment',
          ],
        },
        {
          icon: 'map',
          title: 'Our area',
          items: [
            'Local rides in Voss and surrounding areas',
            'Airport transfers to Bergen and Oslo',
            'Long trips by arrangement',
            'Tour all of Western Norway',
            'Experience with mountain passes',
          ],
        },
        {
          icon: 'info',
          title: 'Good to know',
          items: [
            'All drivers speak Norwegian and English',
            'Local knowledge of roads and area',
            'Child seats available on request',
            'Help with luggage included',
            'Pet-friendly vehicles (inform when booking)',
          ],
        },
        {
          icon: 'weather',
          title: 'Weather and driving conditions',
          items: [
            'We drive in all weather conditions',
            'Experienced drivers with local knowledge',
            'Updated information about weather and roads',
            'Contact us with questions about driving conditions',
            'Safety is always the first priority',
          ],
        },
      ],
    },
  };

  const t = content[locale as 'no' | 'en'];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'phone':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'car':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
          </svg>
        );
      case 'map':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'weather':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
        );
      default:
        return null;
    }
  };

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

        {/* News Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
            {t.newsTitle}
          </h2>
          <div className="space-y-6">
            {t.news.map((item, index) => (
              <Card key={index} variant="hover">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-sm font-medium px-3 py-1 bg-taxi-yellow/10 text-taxi-black rounded-full">
                      {item.category}
                    </span>
                    <span className="text-sm text-taxi-grey">{item.date}</span>
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-taxi-grey font-medium mb-3">
                    {item.summary}
                  </p>
                  <p className="text-taxi-grey leading-relaxed">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Practical Information Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
            {t.practicalTitle}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.practical.map((section, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="text-taxi-yellow mb-3">{getIcon(section.icon)}</div>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-taxi-yellow mr-2 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-taxi-grey text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-taxi-black text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {locale === 'no' ? 'Klar for å bestille?' : 'Ready to book?'}
          </h2>
          <p className="text-taxi-light-grey text-lg mb-8">
            {locale === 'no'
              ? 'Me er her for deg 24/7. Ring oss eller bestill online.'
              : 'We are here for you 24/7. Call us or book online.'}
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
          </div>
        </div>
      </Container>
    </div>
  );
}
