'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 text-white transition-all duration-300',
        scrolled
          ? 'glass-dark backdrop-blur-xl border-b border-white/10 depth-3'
          : 'bg-gradient-to-b from-taxi-black/90 to-transparent'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between py-4">
          {/* Logo with Glow Effect */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-2 group"
          >
            <div className="text-2xl md:text-3xl font-display font-bold smooth-transition">
              <span className="text-taxi-yellow group-hover:drop-shadow-[0_0_15px_rgba(255,197,0,0.7)] transition-all duration-300">
                VOSS
              </span>
              <span className="text-white group-hover:text-taxi-yellow transition-colors duration-300">
                {' '}
                TAXI
              </span>
            </div>
          </Link>

          {/* Right Side - Phone and Language */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Phone with Glass Effect */}
            <a
              href="tel:+4756511340"
              className="glass-yellow px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 smooth-transition flex items-center space-x-2 depth-2 hover-glow"
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

            {/* Language Toggle with Glass Effect */}
            <div className="glass-strong flex items-center space-x-1 rounded-full overflow-hidden p-1 depth-1 backdrop-blur-xl">
              <Link
                href={`/no`}
                className={cn(
                  'px-4 py-1.5 text-sm font-bold rounded-full smooth-transition',
                  locale === 'no'
                    ? 'bg-taxi-yellow text-taxi-black depth-glow'
                    : 'text-white hover:bg-white/10'
                )}
              >
                NO
              </Link>
              <Link
                href={`/en`}
                className={cn(
                  'px-4 py-1.5 text-sm font-bold rounded-full smooth-transition',
                  locale === 'en'
                    ? 'bg-taxi-yellow text-taxi-black depth-glow'
                    : 'text-white hover:bg-white/10'
                )}
              >
                EN
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button with Glass Effect */}
          <button
            type="button"
            className="md:hidden p-3 rounded-full glass-strong hover:glass-yellow smooth-transition depth-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">
              {mobileMenuOpen ? 'Close menu' : 'Open menu'}
            </span>
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
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
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
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

        {/* Mobile Menu with Glass Effect */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-6 glass-dark backdrop-blur-xl rounded-b-2xl mt-2 depth-3">
            <div className="flex flex-col space-y-4">
              {/* Mobile Phone */}
              <a
                href="tel:+4756511340"
                className="glass-yellow px-6 py-4 rounded-2xl text-base font-bold flex items-center space-x-3 hover-scale smooth-transition depth-2"
              >
                <svg
                  className="w-6 h-6"
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
              <div className="flex items-center gap-3">
                <Link
                  href={`/no`}
                  className={cn(
                    'flex-1 px-6 py-4 rounded-2xl text-base font-bold smooth-transition text-center',
                    locale === 'no'
                      ? 'bg-taxi-yellow text-taxi-black depth-glow'
                      : 'glass-strong text-white border border-white/20'
                  )}
                >
                  Norsk
                </Link>
                <Link
                  href={`/en`}
                  className={cn(
                    'flex-1 px-6 py-4 rounded-2xl text-base font-bold smooth-transition text-center',
                    locale === 'en'
                      ? 'bg-taxi-yellow text-taxi-black depth-glow'
                      : 'glass-strong text-white border border-white/20'
                  )}
                >
                  English
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* Animated Bottom Border */}
      <div className={cn(
        'h-0.5 bg-gradient-to-r from-transparent via-taxi-yellow to-transparent transition-opacity duration-300',
        scrolled ? 'opacity-100' : 'opacity-0'
      )} />
    </header>
  );
}
