'use client';

import { Container } from '@/components/ui/Container';

interface TestimonialsProps {
  locale: string;
}

export function Testimonials({ locale }: TestimonialsProps) {
  const content = {
    no: {
      title: 'Kva Seier Kundane Våre',
      subtitle: 'Tusenvis av fornøgde kundar kvart år',
      testimonials: [
        {
          name: 'Sarah Johnson',
          location: 'London, UK',
          rating: 5,
          text: 'Fantastisk service! Sjåføren møtte oss på flyplassen med namnskilt og hjalp med all bagasjen. Bilen var ren og komfortabel. Absolutt å anbefale!',
          date: 'Januar 2026',
          service: 'Flyplasstransport'
        },
        {
          name: 'Erik Andersen',
          location: 'Oslo, Norge',
          rating: 5,
          text: 'Har brukt Voss Taxi i fleire år no. Alltid punktlege, hyggelige sjåførar med god lokalkunnskap. Perfekt for turistar og lokalbefolkning!',
          date: 'Desember 2025',
          service: 'Lokal transport'
        },
        {
          name: 'Maria Schmidt',
          location: 'Hamburg, Tyskland',
          rating: 5,
          text: 'Vårt beste val! Turen til Stalheimskleiva var spektakulær. Sjåføren var kunnig og stoppa på dei beste fotostadene. Uforglemeleg oppleving!',
          date: 'November 2025',
          service: 'Sightseeing'
        },
        {
          name: 'James O\'Connor',
          location: 'Dublin, Irland',
          rating: 5,
          text: 'Excellent service from start to finish. Booked online easily, driver was professional, and the journey was smooth. Will definitely use again when visiting Voss!',
          date: 'Oktober 2025',
          service: 'Airport Transfer'
        },
        {
          name: 'Anna Larsen',
          location: 'Bergen, Norge',
          rating: 5,
          text: 'Brukte maxi-taxi for ein familie-tur. Romsleg plass, moderne bil, og sjåføren var veldig hjelpsom med både barn og utstyr. Takk!',
          date: 'September 2025',
          service: 'Maxi Taxi'
        },
        {
          name: 'Thomas Weber',
          location: 'München, Tyskland',
          rating: 5,
          text: 'Professional and reliable. Our group of 12 was transported comfortably in their minibus. Perfect for our skiing trip to Voss Resort. Highly recommended!',
          date: 'Februar 2026',
          service: 'Minibus'
        }
      ],
      stats: {
        customers: '50,000+',
        customersLabel: 'Fornøgde kundar',
        rating: '4.9/5',
        ratingLabel: 'Gjennomsnittleg vurdering',
        years: '75+',
        yearsLabel: 'År med erfaring',
        fleet: '25+',
        fleetLabel: 'Bilar i flåten'
      }
    },
    en: {
      title: 'What Our Customers Say',
      subtitle: 'Thousands of satisfied customers every year',
      testimonials: [
        {
          name: 'Sarah Johnson',
          location: 'London, UK',
          rating: 5,
          text: 'Amazing service! The driver met us at the airport with a name sign and helped with all luggage. The car was clean and comfortable. Absolutely recommend!',
          date: 'January 2026',
          service: 'Airport Transfer'
        },
        {
          name: 'Erik Andersen',
          location: 'Oslo, Norway',
          rating: 5,
          text: 'Have been using Voss Taxi for several years now. Always punctual, friendly drivers with good local knowledge. Perfect for tourists and locals!',
          date: 'December 2025',
          service: 'Local Transport'
        },
        {
          name: 'Maria Schmidt',
          location: 'Hamburg, Germany',
          rating: 5,
          text: 'Our best choice! The trip to Stalheimskleiva was spectacular. The driver was knowledgeable and stopped at the best photo spots. Unforgettable experience!',
          date: 'November 2025',
          service: 'Sightseeing'
        },
        {
          name: 'James O\'Connor',
          location: 'Dublin, Ireland',
          rating: 5,
          text: 'Excellent service from start to finish. Booked online easily, driver was professional, and the journey was smooth. Will definitely use again when visiting Voss!',
          date: 'October 2025',
          service: 'Airport Transfer'
        },
        {
          name: 'Anna Larsen',
          location: 'Bergen, Norway',
          rating: 5,
          text: 'Used maxi-taxi for a family trip. Spacious, modern car, and the driver was very helpful with both children and equipment. Thank you!',
          date: 'September 2025',
          service: 'Maxi Taxi'
        },
        {
          name: 'Thomas Weber',
          location: 'Munich, Germany',
          rating: 5,
          text: 'Professional and reliable. Our group of 12 was transported comfortably in their minibus. Perfect for our skiing trip to Voss Resort. Highly recommended!',
          date: 'February 2026',
          service: 'Minibus'
        }
      ],
      stats: {
        customers: '50,000+',
        customersLabel: 'Happy Customers',
        rating: '4.9/5',
        ratingLabel: 'Average Rating',
        years: '75+',
        yearsLabel: 'Years of Experience',
        fleet: '25+',
        fleetLabel: 'Vehicles in Fleet'
      }
    }
  };

  const t = content[locale as 'no' | 'en'];

  return (
    <section className="relative py-24 bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-taxi-yellow/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-taxi-yellow to-white">
              {t.title}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-taxi-light-grey/90 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="glass-dark backdrop-blur-xl rounded-3xl p-8 text-center depth-3 hover-lift smooth-transition">
            <div className="text-5xl font-bold text-taxi-yellow mb-2">{t.stats.customers}</div>
            <div className="text-sm text-taxi-light-grey/90">{t.stats.customersLabel}</div>
          </div>
          <div className="glass-dark backdrop-blur-xl rounded-3xl p-8 text-center depth-3 hover-lift smooth-transition">
            <div className="text-5xl font-bold text-taxi-yellow mb-2">{t.stats.rating}</div>
            <div className="text-sm text-taxi-light-grey/90">{t.stats.ratingLabel}</div>
          </div>
          <div className="glass-dark backdrop-blur-xl rounded-3xl p-8 text-center depth-3 hover-lift smooth-transition">
            <div className="text-5xl font-bold text-taxi-yellow mb-2">{t.stats.years}</div>
            <div className="text-sm text-taxi-light-grey/90">{t.stats.yearsLabel}</div>
          </div>
          <div className="glass-dark backdrop-blur-xl rounded-3xl p-8 text-center depth-3 hover-lift smooth-transition">
            <div className="text-5xl font-bold text-taxi-yellow mb-2">{t.stats.fleet}</div>
            <div className="text-sm text-taxi-light-grey/90">{t.stats.fleetLabel}</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-dark backdrop-blur-xl rounded-3xl p-8 depth-3 hover-lift smooth-transition border border-white/10"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-taxi-yellow text-2xl">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-taxi-light-grey/90 mb-6 leading-relaxed italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Service Badge */}
              <div className="mb-6">
                <span className="glass-yellow px-4 py-2 rounded-full text-xs font-bold text-taxi-black">
                  {testimonial.service}
                </span>
              </div>

              {/* Author */}
              <div className="border-t border-white/10 pt-6">
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-sm text-taxi-light-grey/70">{testimonial.location}</div>
                <div className="text-xs text-taxi-yellow mt-2">{testimonial.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-2xl text-taxi-light-grey/90 mb-2">
            {locale === 'no' ? '⭐⭐⭐⭐⭐' : '⭐⭐⭐⭐⭐'}
          </p>
          <p className="text-xl text-taxi-yellow font-semibold">
            {locale === 'no' 
              ? 'Bli ein av tusenvis av fornøgde kundar!' 
              : 'Join thousands of happy customers!'}
          </p>
        </div>
      </Container>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 animated-gradient" />
    </section>
  );
}
