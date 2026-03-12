import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { getSiteSettings } from '@/lib/content';

export async function Footer() {
  const locale = await getLocale();

  // Load site settings from CMS
  const settings = await getSiteSettings();
  if (!settings) {
    return null;
  }

  const footerContent = settings.footer[locale as 'no' | 'en'];
  const { companyInfo, socialMedia } = settings;

  return (
    <footer className="relative bg-gradient-to-br from-taxi-black via-gray-900 to-taxi-black text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <Container className="relative z-10">
        {/* Top Border Gradient */}
        <div className="h-1 bg-gradient-to-r from-transparent via-taxi-yellow to-transparent mb-12" />

        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info with Glass Effect */}
          <div className="glass-dark p-6 rounded-2xl depth-2 hover-lift smooth-transition backdrop-blur-xl">
            <div className="text-3xl font-display font-bold mb-4">
              <span className="text-taxi-yellow drop-shadow-[0_0_10px_rgba(255,197,0,0.5)]">
                VOSS
              </span>
              <span className="text-white"> TAXI</span>
            </div>
            <p className="text-taxi-light-grey/90 text-sm leading-relaxed">
              {companyInfo.tagline[locale as 'no' | 'en']}
            </p>
            <div className="mt-6 glass-yellow rounded-full px-4 py-2 inline-block text-sm font-bold">
              ⭐ Since 1950
            </div>
          </div>

          {/* Contact Info with Glass Card */}
          <div className="glass-dark p-6 rounded-2xl depth-2 backdrop-blur-xl">
            <h3 className="font-bold text-xl mb-6 text-taxi-yellow">
              {footerContent.contact.title}
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <span className="text-taxi-yellow text-xl">📍</span>
                <p className="text-taxi-light-grey/90">{footerContent.contact.address}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-taxi-yellow text-xl">📞</span>
                <a
                  href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                  className="text-taxi-light-grey/90 hover:text-taxi-yellow smooth-transition font-semibold"
                >
                  {companyInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-taxi-yellow text-xl">✉️</span>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="text-taxi-light-grey/90 hover:text-taxi-yellow smooth-transition"
                >
                  {companyInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Social & Links */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-taxi-yellow">
              {footerContent.followUs}
            </h3>
            <div className="flex space-x-4 mb-8">
              {/* Facebook */}
              {socialMedia.facebook && (
                <a
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-strong p-4 rounded-full hover:glass-yellow hover-scale smooth-transition depth-2 group"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-taxi-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {socialMedia.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-strong p-4 rounded-full hover:glass-yellow hover-scale smooth-transition depth-2 group"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-taxi-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Legal Links */}
            <div className="text-sm space-y-3">
              <Link
                href={`/${locale}/privacy`}
                className="block text-taxi-light-grey/90 hover:text-taxi-yellow hover:translate-x-2 smooth-transition flex items-center group"
              >
                <span className="text-taxi-yellow mr-2">→</span>
                {footerContent.privacy}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="block text-taxi-light-grey/90 hover:text-taxi-yellow hover:translate-x-2 smooth-transition flex items-center group"
              >
                <span className="text-taxi-yellow mr-2">→</span>
                {footerContent.terms}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Glass Effect */}
        <div className="glass-dark backdrop-blur-xl rounded-2xl p-6 depth-2 text-center">
          <p className="text-sm text-taxi-light-grey/90">
            &copy; {new Date().getFullYear()} {companyInfo.name}.{' '}
            {footerContent.copyright}
          </p>
          <p className="text-xs text-taxi-yellow mt-2 font-semibold">
            Made with ❤️ in Voss, Norway
          </p>
        </div>

        {/* Bottom Spacing */}
        <div className="pb-8" />
      </Container>

      {/* Animated Bottom Accent */}
      <div className="h-2 bg-gradient-to-r from-transparent via-taxi-yellow to-transparent animated-gradient" />
    </footer>
  );
}
