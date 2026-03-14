import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['no', 'en'],
  defaultLocale: 'no',
  localePrefix: 'always',
  // Disable cookie-based locale detection to reduce header size
  // and prevent "Request Header Or Cookie Too Large" errors
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
