/**
 * Rate limiting middleware for API endpoints
 * Implements sliding window rate limiting to prevent abuse
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Custom error message
   */
  message?: string;

  /**
   * Skip rate limiting based on request
   */
  skip?: (request: NextRequest) => boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

/**
 * Get client identifier from request
 * Uses IP address or forwarded IP
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to connection IP (may not be available in all environments)
  return request.ip || 'unknown';
}

/**
 * Rate limiting middleware
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await rateLimit(request, {
 *     maxRequests: 10,
 *     windowMs: 60000, // 1 minute
 *   });
 *
 *   if (rateLimitResult) {
 *     return rateLimitResult; // Return 429 response
 *   }
 *
 *   // Continue with normal request handling
 * }
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  // Check if we should skip rate limiting
  if (config.skip && config.skip(request)) {
    return null;
  }

  const identifier = getClientIdentifier(request);
  const key = `${request.nextUrl.pathname}:${identifier}`;
  const now = Date.now();

  // Get existing entry or create new one
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    // Add rate limit headers
    return addRateLimitHeaders(null, config.maxRequests, entry);
  }

  // Increment counter
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    console.warn('Rate limit exceeded:', {
      identifier,
      path: request.nextUrl.pathname,
      count: entry.count,
      limit: config.maxRequests,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: 'Too many requests',
        details: config.message || 'You have exceeded the rate limit. Please try again later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
        },
      }
    );
  }

  // Return null to continue with request
  return addRateLimitHeaders(null, config.maxRequests, entry);
}

/**
 * Add rate limit headers to response
 */
function addRateLimitHeaders(
  response: NextResponse | null,
  maxRequests: number,
  entry: RateLimitEntry
): null {
  // Headers are added in the middleware, not here
  // This is just a placeholder for future implementation
  return null;
}

/**
 * Create a rate limiter function with preset configuration
 *
 * @example
 * const bookingLimiter = createRateLimiter({
 *   maxRequests: 5,
 *   windowMs: 60000, // 5 requests per minute
 * });
 *
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await bookingLimiter(request);
 *   if (rateLimitResult) return rateLimitResult;
 *   // ... handle request
 * }
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (request: NextRequest) => rateLimit(request, config);
}

// Preset rate limiters for common use cases

/**
 * Strict rate limiter for sensitive operations (e.g., bookings)
 * 5 requests per minute per IP
 */
export const strictRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
  message: 'You have made too many booking attempts. Please wait a minute and try again.',
});

/**
 * Moderate rate limiter for API endpoints
 * 20 requests per minute per IP
 */
export const moderateRateLimiter = createRateLimiter({
  maxRequests: 20,
  windowMs: 60 * 1000, // 1 minute
  message: 'You have made too many requests. Please wait a minute and try again.',
});

/**
 * Lenient rate limiter for public endpoints (e.g., address search)
 * 60 requests per minute per IP
 */
export const lenientRateLimiter = createRateLimiter({
  maxRequests: 60,
  windowMs: 60 * 1000, // 1 minute
  message: 'You have made too many requests. Please slow down.',
});

/**
 * Get rate limit stats for monitoring
 */
export function getRateLimitStats() {
  return {
    totalKeys: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
      key,
      count: entry.count,
      resetTime: new Date(entry.resetTime).toISOString(),
    })),
  };
}

/**
 * Clear all rate limit entries (useful for testing)
 */
export function clearRateLimits() {
  rateLimitStore.clear();
}
