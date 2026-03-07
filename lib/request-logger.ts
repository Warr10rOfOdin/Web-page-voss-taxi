/**
 * Request logging middleware for API endpoints
 * Provides detailed logging of requests and responses
 */

import { NextRequest, NextResponse } from 'next/server';

export interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  query: string;
  ip: string;
  userAgent: string;
  statusCode?: number;
  duration?: number;
  error?: string;
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get client IP address
 */
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return request.ip || 'unknown';
}

/**
 * Sanitize request body for logging (remove sensitive data)
 */
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '***REDACTED***';
    }
  }

  // Recursively sanitize nested objects
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeBody(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Log request with detailed information
 */
export function logRequest(
  request: NextRequest,
  options: {
    body?: any;
    includeHeaders?: boolean;
  } = {}
): string {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();
  const method = request.method;
  const path = request.nextUrl.pathname;
  const query = request.nextUrl.search;
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const log: any = {
    requestId,
    timestamp,
    method,
    path,
    query,
    ip,
    userAgent,
  };

  // Add body if provided
  if (options.body) {
    log.body = sanitizeBody(options.body);
  }

  // Add headers if requested
  if (options.includeHeaders) {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      // Exclude sensitive headers
      if (!['authorization', 'cookie', 'x-api-key'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });
    log.headers = headers;
  }

  console.log('API Request:', JSON.stringify(log, null, 2));

  return requestId;
}

/**
 * Log response with detailed information
 */
export function logResponse(
  requestId: string,
  response: {
    status: number;
    data?: any;
    error?: string;
  },
  startTime: number
): void {
  const duration = Date.now() - startTime;
  const timestamp = new Date().toISOString();

  const log: any = {
    requestId,
    timestamp,
    statusCode: response.status,
    duration: `${duration}ms`,
  };

  // Add response data or error
  if (response.error) {
    log.error = response.error;
  } else if (response.data) {
    log.data = sanitizeBody(response.data);
  }

  // Log at appropriate level
  if (response.status >= 500) {
    console.error('API Response (Server Error):', JSON.stringify(log, null, 2));
  } else if (response.status >= 400) {
    console.warn('API Response (Client Error):', JSON.stringify(log, null, 2));
  } else {
    console.log('API Response (Success):', JSON.stringify(log, null, 2));
  }
}

/**
 * Wrapper function to automatically log request and response
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   return await withRequestLogging(request, async (body) => {
 *     // Your handler logic here
 *     return NextResponse.json({ success: true });
 *   });
 * }
 */
export async function withRequestLogging<T = any>(
  request: NextRequest,
  handler: (body: T) => Promise<NextResponse>,
  options: {
    includeHeaders?: boolean;
  } = {}
): Promise<NextResponse> {
  const startTime = Date.now();
  let body: T | undefined;
  let requestId: string;

  try {
    // Parse body if present
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        body = await request.json();
      } catch {
        // Body might not be JSON or might be empty
        body = undefined;
      }
    }

    // Log request
    requestId = logRequest(request, {
      body,
      includeHeaders: options.includeHeaders,
    });

    // Execute handler
    const response = await handler(body!);

    // Log response
    const responseData = await response.clone().json().catch(() => null);
    logResponse(
      requestId,
      {
        status: response.status,
        data: responseData,
      },
      startTime
    );

    // Add request ID to response headers
    response.headers.set('X-Request-Id', requestId);

    return response;
  } catch (error) {
    // Log error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logResponse(
      requestId!,
      {
        status: 500,
        error: errorMessage,
      },
      startTime
    );

    throw error;
  }
}

/**
 * Simple request logger that just logs basic info
 * Use this for lightweight logging
 */
export function simpleRequestLogger(request: NextRequest): string {
  const requestId = generateRequestId();
  const method = request.method;
  const path = request.nextUrl.pathname;
  const ip = getClientIp(request);

  console.log(`[${requestId}] ${method} ${path} from ${ip}`);

  return requestId;
}

/**
 * Request metrics for monitoring
 */
const requestMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalDuration: 0,
  pathMetrics: new Map<string, { count: number; totalDuration: number }>(),
};

/**
 * Track request metrics
 */
export function trackRequestMetrics(
  path: string,
  status: number,
  duration: number
): void {
  requestMetrics.totalRequests++;
  requestMetrics.totalDuration += duration;

  if (status >= 200 && status < 400) {
    requestMetrics.successfulRequests++;
  } else {
    requestMetrics.failedRequests++;
  }

  // Track per-path metrics
  const pathMetric = requestMetrics.pathMetrics.get(path) || {
    count: 0,
    totalDuration: 0,
  };
  pathMetric.count++;
  pathMetric.totalDuration += duration;
  requestMetrics.pathMetrics.set(path, pathMetric);
}

/**
 * Get request metrics for monitoring
 */
export function getRequestMetrics() {
  const avgDuration = requestMetrics.totalRequests > 0
    ? requestMetrics.totalDuration / requestMetrics.totalRequests
    : 0;

  const pathStats = Array.from(requestMetrics.pathMetrics.entries()).map(
    ([path, metrics]) => ({
      path,
      count: metrics.count,
      avgDuration: metrics.count > 0 ? metrics.totalDuration / metrics.count : 0,
    })
  );

  return {
    totalRequests: requestMetrics.totalRequests,
    successfulRequests: requestMetrics.successfulRequests,
    failedRequests: requestMetrics.failedRequests,
    avgDuration: Math.round(avgDuration),
    successRate:
      requestMetrics.totalRequests > 0
        ? (requestMetrics.successfulRequests / requestMetrics.totalRequests) * 100
        : 0,
    paths: pathStats,
  };
}

/**
 * Reset request metrics (useful for testing)
 */
export function resetRequestMetrics() {
  requestMetrics.totalRequests = 0;
  requestMetrics.successfulRequests = 0;
  requestMetrics.failedRequests = 0;
  requestMetrics.totalDuration = 0;
  requestMetrics.pathMetrics.clear();
}
