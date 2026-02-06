import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for admin paths entirely
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Apply next-intl middleware for all other paths
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - admin (CMS)
  // - API routes
  // - Static files (_next/static, images, etc.)
  // - Favicon and other public files
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
