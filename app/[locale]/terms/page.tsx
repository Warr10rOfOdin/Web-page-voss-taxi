import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');

  return (
    <div className="py-16 md:py-24">
      <Container size="md">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          {t('title')}
        </h1>
        <p className="text-taxi-grey mb-12">
          {t('lastUpdated')}: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Service Terms</h2>
            <p className="text-taxi-grey mb-4">
              By using Voss Taxi services, you agree to these terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Booking and Cancellation</h2>
            <ul className="list-disc pl-6 text-taxi-grey space-y-2">
              <li>Bookings can be made by phone or through our booking system</li>
              <li>We recommend booking in advance for airport transfers and tours</li>
              <li>Cancellations should be made as early as possible</li>
              <li>Late cancellations may incur charges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Pricing</h2>
            <p className="text-taxi-grey mb-4">
              Our prices are regulated according to Norwegian taxi regulations:
            </p>
            <ul className="list-disc pl-6 text-taxi-grey space-y-2">
              <li>Meter-based pricing for standard rides</li>
              <li>Fixed prices available for airport transfers upon request</li>
              <li>Special rates for sightseeing tours</li>
              <li>Payment accepted: Cash, cards, and invoicing for business customers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Passenger Responsibilities</h2>
            <ul className="list-disc pl-6 text-taxi-grey space-y-2">
              <li>Passengers must treat drivers and vehicles with respect</li>
              <li>Smoking is not permitted in vehicles</li>
              <li>Passengers are responsible for any damage to the vehicle</li>
              <li>Seatbelts must be worn at all times</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Liability</h2>
            <p className="text-taxi-grey">
              Voss Taxi maintains comprehensive insurance coverage. We are not liable
              for delays caused by factors beyond our control (weather, traffic, road
              conditions, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p className="text-taxi-grey">
              For questions about these terms, contact us:
              <br />
              Phone: +47 56 51 13 40
              <br />
              Email: post@vosstaxi.no
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
