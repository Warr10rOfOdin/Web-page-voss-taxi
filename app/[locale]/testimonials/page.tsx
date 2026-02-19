'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

type FeedbackCategory = 'driver' | 'trip' | 'general' | 'praise' | null;

const content = {
  no: {
    title: 'Tilbakemeldingar',
    subtitle: 'Her kan du sende formelle klager, eller ros til oss.',
    categoryButtons: [
      { id: 'driver' as const, label: 'Klage på sjåfør', color: 'bg-taxi-grey hover:bg-taxi-black' },
      { id: 'trip' as const, label: 'Klage utført oppdrag', color: 'bg-taxi-grey hover:bg-taxi-black' },
      { id: 'general' as const, label: 'Generelle klager', color: 'bg-taxi-grey hover:bg-taxi-black' },
      { id: 'praise' as const, label: 'Ros', color: 'bg-taxi-yellow hover:bg-yellow-500 text-taxi-black' },
    ],
    complaintTitle: 'Send klage',
    complaintInfo: 'Visst du ynskjer å retta ein formell klage, skal denne framsettast skriftleg på klageskjemaet nedanfor. Me sender deg innan 14 dagar ein skriftleg beskjed på at klagen er motteken, og informasjon om forventa behandlingstid.',
    complaintFormal: 'Formelle klagar vil besvarast skriftleg. Dokumentasjon vedrørande klagen oppbevarast hjå oss i tre år etter at klagebehandlinga er avslutta.',
    praiseTitle: 'Send ros',
    praiseInfo: 'Gje oss ros eller ris. Me ønskjer dine synspunkt, tilbakemeldingar og tips til forbetringar. Det er den beste hjelpen du kan gje oss i arbeidet med å verta endå betre.',
    form: {
      name: 'Ditt namn',
      email: 'E-postadresse',
      phone: 'Telefonnummer (valfritt)',
      date: 'Dato for hendinga',
      driverName: 'Sjåførens namn (om kjent)',
      tripDetails: 'Tur detaljar (frå/til)',
      message: 'Di melding',
      messagePlaceholder: 'Beskriv din oppleving...',
      submit: 'Send tilbakemelding',
      sending: 'Sender...',
      successTitle: 'Takk for di tilbakemelding!',
      successMessage: 'Me har motteke meldinga di og vil behandle ho så snart som mogleg.',
      errorTitle: 'Noko gjekk gale',
      errorMessage: 'Prøv igjen seinare eller kontakt oss direkte på post@vosstaxi.no',
      sendAnother: 'Send ny tilbakemelding',
      generalInfo: 'Generell informasjon',
    },
    categories: {
      driver: 'Klage på sjåfør',
      trip: 'Klage utført oppdrag',
      general: 'Generell klage',
      praise: 'Ros',
    },
  },
  en: {
    title: 'Feedback',
    subtitle: 'Here you can send formal complaints, or praise to us.',
    categoryButtons: [
      { id: 'driver' as const, label: 'Complaint about driver', color: 'bg-taxi-grey hover:bg-taxi-black' },
      { id: 'trip' as const, label: 'Complaint about trip', color: 'bg-taxi-grey hover:bg-taxi-black' },
      { id: 'general' as const, label: 'General complaints', color: 'bg-taxi-grey hover:bg-taxi-black' },
      { id: 'praise' as const, label: 'Praise', color: 'bg-taxi-yellow hover:bg-yellow-500 text-taxi-black' },
    ],
    complaintTitle: 'Send complaint',
    complaintInfo: 'If you wish to file a formal complaint, please submit it in writing using the form below. We will send you written confirmation within 14 days that the complaint has been received, along with information about expected processing time.',
    complaintFormal: 'Formal complaints will be answered in writing. Documentation regarding the complaint is kept by us for three years after the complaint processing is completed.',
    praiseTitle: 'Send praise',
    praiseInfo: 'Give us praise or constructive feedback. We welcome your views, feedback and tips for improvement. It is the best help you can give us in our work to become even better.',
    form: {
      name: 'Your name',
      email: 'Email address',
      phone: 'Phone number (optional)',
      date: 'Date of incident',
      driverName: 'Driver name (if known)',
      tripDetails: 'Trip details (from/to)',
      message: 'Your message',
      messagePlaceholder: 'Describe your experience...',
      submit: 'Send feedback',
      sending: 'Sending...',
      successTitle: 'Thank you for your feedback!',
      successMessage: 'We have received your message and will process it as soon as possible.',
      errorTitle: 'Something went wrong',
      errorMessage: 'Please try again later or contact us directly at post@vosstaxi.no',
      sendAnother: 'Send another feedback',
      generalInfo: 'General information',
    },
    categories: {
      driver: 'Complaint about driver',
      trip: 'Complaint about trip',
      general: 'General complaint',
      praise: 'Praise',
    },
  },
};

export default function FeedbackPage() {
  const locale = useLocale();
  const t = content[locale as 'no' | 'en'];

  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>(null);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    driverName: '',
    tripDetails: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          categoryLabel: t.categories[selectedCategory!],
          ...formData,
        }),
      });

      if (response.ok) {
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setFormState('idle');
    setFormData({ name: '', email: '', phone: '', date: '', driverName: '', tripDetails: '', message: '' });
  };

  const isPraise = selectedCategory === 'praise';
  const isDriverComplaint = selectedCategory === 'driver';
  const isTripComplaint = selectedCategory === 'trip';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-taxi-black text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <Image
            src="/images/20240526_111758.jpg"
            alt="Voss Taxi"
            fill
            className="object-cover opacity-20"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-taxi-black/80 to-taxi-black/90" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-taxi-light-grey">
              {t.subtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Category Buttons */}
      <section className="bg-taxi-black py-8">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            {t.categoryButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => { setSelectedCategory(btn.id); setFormState('idle'); }}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                  selectedCategory === btn.id
                    ? btn.id === 'praise'
                      ? 'bg-taxi-yellow text-taxi-black ring-2 ring-white scale-105'
                      : 'bg-white text-taxi-black ring-2 ring-taxi-yellow scale-105'
                    : `${btn.color} text-white`
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          {/* No category selected - show info */}
          {!selectedCategory && (
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t.complaintTitle}</h2>
                  <p className="text-taxi-grey mb-4 leading-relaxed">{t.complaintInfo}</p>
                  <p className="text-taxi-grey leading-relaxed">{t.complaintFormal}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t.praiseTitle}</h2>
                  <p className="text-taxi-grey leading-relaxed">{t.praiseInfo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success state */}
          {selectedCategory && formState === 'success' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-bold mb-4">{t.form.successTitle}</h2>
                <p className="text-lg text-taxi-grey mb-8">{t.form.successMessage}</p>
                <Button onClick={resetForm} variant="primary" size="lg">
                  {t.form.sendAnother}
                </Button>
              </div>
            </div>
          )}

          {/* Error state */}
          {selectedCategory && formState === 'error' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-12">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-bold mb-4">{t.form.errorTitle}</h2>
                <p className="text-lg text-taxi-grey mb-8">{t.form.errorMessage}</p>
                <Button onClick={() => setFormState('idle')} variant="primary" size="lg">
                  {locale === 'no' ? 'Prøv igjen' : 'Try again'}
                </Button>
              </div>
            </div>
          )}

          {/* Form */}
          {selectedCategory && (formState === 'idle' || formState === 'sending') && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  {isPraise ? t.praiseTitle : t.complaintTitle}
                </h2>
                <p className="text-taxi-grey leading-relaxed">
                  {isPraise ? t.praiseInfo : t.complaintInfo}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    isPraise ? 'bg-taxi-yellow text-taxi-black' : 'bg-taxi-grey text-white'
                  }`}>
                    {t.categories[selectedCategory]}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.name} *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.email} *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.phone}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.date}</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Driver-specific fields */}
                {isDriverComplaint && (
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.driverName}</label>
                    <input
                      type="text"
                      value={formData.driverName}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    />
                  </div>
                )}

                {/* Trip-specific fields */}
                {isTripComplaint && (
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.tripDetails}</label>
                    <input
                      type="text"
                      value={formData.tripDetails}
                      onChange={(e) => setFormData({ ...formData, tripDetails: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.message} *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.form.messagePlaceholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-transparent resize-vertical"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    variant="primary"
                    disabled={formState === 'sending'}
                  >
                    {formState === 'sending' ? t.form.sending : t.form.submit}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    onClick={resetForm}
                  >
                    {t.form.generalInfo}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
