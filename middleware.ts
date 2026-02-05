import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files (_next/static, images, etc.)
  // - Favicon and other public files
  // - /admin route and files (for CMS)
  matcher: [
    // Skip middleware for these patterns
    '/((?!_next|api|admin|favicon.ico).*)',
  ],
};
