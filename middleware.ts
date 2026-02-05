import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files (_next/static, images, etc.)
  // - Favicon and other public files
  // - /admin route (for CMS)
  matcher: [
    // Match all pathnames except those starting with:
    '/((?!api|_next|_vercel|admin|.*\\..*).*)',
  ],
};
