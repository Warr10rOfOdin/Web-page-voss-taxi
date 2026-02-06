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
    /*
     * Match all request paths except for the ones starting with:
     * - admin (CMS)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!admin|api|_next/static|_next/image|favicon.ico).*)',
  ],
};
