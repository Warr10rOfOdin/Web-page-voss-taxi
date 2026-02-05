'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations();
  const locale = useLocale();

  const navigation = [
    { name: t('nav.home'), href: `/${locale}` },
    { name: t('nav.services'), href: `/${locale}/services` },
    { name: t('nav.tourist'), href: `/${locale}/tourist` },
    { name: t('nav.calculator'), href: `/${locale}/calculator` },
    { name: t('nav.contact'), href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-taxi-black text-white shadow-lg">
      <Container>
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="text-2xl md:text-3xl font-display font-bold">
              <span className="text-taxi-yellow">VOSS</span>
              <span className="text-white"> TAXI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:text-taxi-yellow transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Phone, Language, CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Phone */}
            <a
              href="tel:+4756511340"
              className="text-sm font-medium hover:text-taxi-yellow transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+47 56 51 13 40</span>
            </a>

            {/* Language Toggle */}
            <div className="flex items-center space-x-1 border border-taxi-yellow rounded-lg overflow-hidden">
              <Link
                href={`/no`}
                className={cn(
                  'px-3 py-1 text-sm font-medium transition-colors',
                  locale === 'no'
                    ? 'bg-taxi-yellow text-taxi-black'
                    : 'text-taxi-yellow hover:bg-taxi-yellow/10'
                )}
              >
                NO
              </Link>
              <Link
                href={`/en`}
                className={cn(
                  'px-3 py-1 text-sm font-medium transition-colors',
                  locale === 'en'
                    ? 'bg-taxi-yellow text-taxi-black'
                    : 'text-taxi-yellow hover:bg-taxi-yellow/10'
                )}
              >
                EN
              </Link>
            </div>

            {/* CTA Button */}
            <Link href={`/${locale}/book`}>
              <Button size="sm">
                {t('hero.ctaPrimary')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-white hover:text-taxi-yellow"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-taxi-yellow/20 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium hover:text-taxi-yellow transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Phone */}
              <a
                href="tel:+4756511340"
                className="text-base font-medium text-taxi-yellow flex items-center space-x-2"
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+47 56 51 13 40</span>
              </a>

              {/* Mobile Language Toggle */}
              <div className="flex items-center space-x-2">
                <Link
                  href={`/no`}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    locale === 'no'
                      ? 'bg-taxi-yellow text-taxi-black'
                      : 'border border-taxi-yellow text-taxi-yellow'
                  )}
                >
                  NO
                </Link>
                <Link
                  href={`/en`}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    locale === 'en'
                      ? 'bg-taxi-yellow text-taxi-black'
                      : 'border border-taxi-yellow text-taxi-yellow'
                  )}
                >
                  EN
                </Link>
              </div>

              {/* Mobile CTA */}
              <Link href={`/${locale}/book`}>
                <Button size="md" className="w-full">
                  {t('hero.ctaPrimary')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
