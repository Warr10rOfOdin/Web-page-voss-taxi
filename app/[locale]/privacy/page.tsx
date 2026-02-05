import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';

export default async function PrivacyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('privacy');

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
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p className="text-taxi-grey mb-4">
              When you use our taxi services, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 text-taxi-grey space-y-2">
              <li>Name and contact information (phone number, email)</li>
              <li>Pickup and destination addresses</li>
              <li>Payment information</li>
              <li>Trip history and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-taxi-grey mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-taxi-grey space-y-2">
              <li>Provide taxi services</li>
              <li>Process payments</li>
              <li>Improve our services</li>
              <li>Communicate with you about bookings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Protection</h2>
            <p className="text-taxi-grey">
              We take appropriate security measures to protect your personal information
              in accordance with GDPR and Norwegian privacy laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-taxi-grey mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-taxi-grey space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-taxi-grey">
              If you have questions about our privacy policy, please contact us at:
              <br />
              Email: post@vosstaxi.no
              <br />
              Phone: +47 56 51 13 40
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
