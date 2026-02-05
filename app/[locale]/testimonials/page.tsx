import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = {
    no: {
      title: 'Tilbakemeldingar',
      subtitle: 'Kva våre kundar seier',
      intro: 'Me er stolte av tilbakemeldingane me får frå både lokale og turistar. Her er nokre av dei me har motteke den siste tida.',
      shareTitle: 'Del di oppleving',
      shareText: 'Har du reist med Voss Taxi? Me set stor pris på om du vil dele di oppleving med oss og andre.',
      shareButton: 'Send tilbakemelding',
      reviewPrompt: 'Du kan også gje oss ein anmeldelse på Google eller Facebook.',
      testimonials: [
        {
          name: 'Anne Kristin S.',
          location: 'Oslo',
          date: 'Januar 2026',
          rating: 5,
          text: 'Fantastisk service frå Voss Taxi! Sjåføren var punktleg, hyggelig og køyrde trygt. Han gav oss også gode tips om kva me kunne oppleve i området. Me kjem definitivt til å bruke dei igjen!',
        },
        {
          name: 'John M.',
          location: 'London, UK',
          date: 'Desember 2025',
          rating: 5,
          text: 'Professional and friendly service. The driver spoke excellent English and made our journey to Flåm comfortable and interesting. Highly recommended for tourists!',
        },
        {
          name: 'Lars P.',
          location: 'Voss',
          date: 'Desember 2025',
          rating: 5,
          text: 'Brukar Voss Taxi regelmessig til flyplasstransport. Alltid pålitelege, høflige og prisane er rimeleg. Kan ikkje seie anna enn positivt!',
        },
        {
          name: 'Maria G.',
          location: 'Bergen',
          date: 'November 2025',
          rating: 5,
          text: 'Bestilte maxi taxi til familietreff i Voss. Stor, rein bil og ein veldig hyggeleg sjåfør som var fleksibel med stopp undervegs. Topp service!',
        },
        {
          name: 'Robert S.',
          location: 'Germany',
          date: 'Oktober 2025',
          rating: 5,
          text: 'Wir haben eine Sightseeing-Tour zu den schönsten Orten rund um Voss gebucht. Der Fahrer war sehr kenntnisreich und freundlich. Absolut empfehlenswert!',
        },
        {
          name: 'Ingrid H.',
          location: 'Voss',
          date: 'Oktober 2025',
          rating: 5,
          text: 'Treng rullestoltaxi til regelmessige lækjebesøk. Alltid god hjelp, trygge og profesjonelle. Me set veldig pris på tenesta dykkar!',
        },
        {
          name: 'David L.',
          location: 'USA',
          date: 'September 2025',
          rating: 5,
          text: 'Amazing experience! Our driver took us to Stalheimskleiva and other beautiful spots. Very knowledgeable about the area and great conversation. Best part of our Norway trip!',
        },
        {
          name: 'Kari J.',
          location: 'Oslo',
          date: 'September 2025',
          rating: 5,
          text: 'Utmerka service til bryllaup i Voss. Sjåføren var punktleg, elegant kledd og køyrde mjukt og trygt. Perfekt for ein spesiell dag!',
        },
        {
          name: 'Thomas B.',
          location: 'Nederland',
          date: 'August 2025',
          rating: 5,
          text: 'Very good service for airport transfer from Bergen to Voss. Clean car, safe driving, and the driver helped with our luggage. Great value for money!',
        },
      ],
    },
    en: {
      title: 'Testimonials',
      subtitle: 'What our customers say',
      intro: 'We are proud of the feedback we receive from both locals and tourists. Here are some of the reviews we have received recently.',
      shareTitle: 'Share your experience',
      shareText: 'Have you traveled with Voss Taxi? We would greatly appreciate if you would share your experience with us and others.',
      shareButton: 'Send feedback',
      reviewPrompt: 'You can also give us a review on Google or Facebook.',
      testimonials: [
        {
          name: 'Anne Kristin S.',
          location: 'Oslo',
          date: 'January 2026',
          rating: 5,
          text: 'Fantastic service from Voss Taxi! The driver was punctual, friendly and drove safely. He also gave us good tips about what we could experience in the area. We will definitely use them again!',
        },
        {
          name: 'John M.',
          location: 'London, UK',
          date: 'December 2025',
          rating: 5,
          text: 'Professional and friendly service. The driver spoke excellent English and made our journey to Flåm comfortable and interesting. Highly recommended for tourists!',
        },
        {
          name: 'Lars P.',
          location: 'Voss',
          date: 'December 2025',
          rating: 5,
          text: 'Use Voss Taxi regularly for airport transport. Always reliable, polite and the prices are reasonable. Can only say positive things!',
        },
        {
          name: 'Maria G.',
          location: 'Bergen',
          date: 'November 2025',
          rating: 5,
          text: 'Ordered maxi taxi for family gathering in Voss. Large, clean car and a very nice driver who was flexible with stops along the way. Top service!',
        },
        {
          name: 'Robert S.',
          location: 'Germany',
          date: 'October 2025',
          rating: 5,
          text: 'We booked a sightseeing tour to the most beautiful places around Voss. The driver was very knowledgeable and friendly. Absolutely recommended!',
        },
        {
          name: 'Ingrid H.',
          location: 'Voss',
          date: 'October 2025',
          rating: 5,
          text: 'Need wheelchair accessible taxi for regular medical appointments. Always good help, safe and professional. We really appreciate your service!',
        },
        {
          name: 'David L.',
          location: 'USA',
          date: 'September 2025',
          rating: 5,
          text: 'Amazing experience! Our driver took us to Stalheimskleiva and other beautiful spots. Very knowledgeable about the area and great conversation. Best part of our Norway trip!',
        },
        {
          name: 'Kari J.',
          location: 'Oslo',
          date: 'September 2025',
          rating: 5,
          text: 'Excellent service for wedding in Voss. The driver was punctual, elegantly dressed and drove smoothly and safely. Perfect for a special day!',
        },
        {
          name: 'Thomas B.',
          location: 'Netherlands',
          date: 'August 2025',
          rating: 5,
          text: 'Very good service for airport transfer from Bergen to Voss. Clean car, safe driving, and the driver helped with our luggage. Great value for money!',
        },
      ],
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

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {t.testimonials.map((testimonial, index) => (
            <Card key={index} variant="hover" className="flex flex-col">
              <CardHeader>
                {/* Rating */}
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-taxi-yellow"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Name and Location */}
                <div>
                  <h3 className="font-bold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-taxi-grey">
                    {testimonial.location} • {testimonial.date}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-taxi-grey italic leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-taxi-yellow/10 to-white border-taxi-yellow/20">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t.shareTitle}
            </h2>
            <p className="text-xl text-taxi-grey mb-6 max-w-2xl mx-auto">
              {t.shareText}
            </p>
            <p className="text-taxi-grey mb-8">{t.reviewPrompt}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`}>
                <Button size="lg" variant="primary">
                  {t.shareButton}
                </Button>
              </Link>
              <a href="tel:+4756511340">
                <Button size="lg" variant="secondary">
                  {locale === 'no' ? 'Ring oss' : 'Call us'}: +47 56 51 13 40
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
