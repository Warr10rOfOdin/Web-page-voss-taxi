import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import { validateSimpleBookingRequest } from '@/lib/validation';
import { retryWithBackoff } from '@/lib/retry';
import { strictRateLimiter } from '@/lib/rate-limit';
import { logRequest, logResponse, trackRequestMetrics } from '@/lib/request-logger';
import type { SimpleBookingRequest, BookingResponse } from '@/lib/types/booking';

// Simple booking endpoint (single passenger)
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let requestId: string = '';

  try {
    // Apply rate limiting
    const rateLimitResult = await strictRateLimiter(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const body = await request.json();

    // Log request
    requestId = logRequest(request, { body });

    // Validate request using validation utilities
    const validation = validateSimpleBookingRequest(body);
    if (!validation.isValid) {
      console.error('Validation error:', {
        errors: validation.errors,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors.join('; '),
          errors: validation.errors,
          type: 'validation_error'
        },
        { status: 400 }
      );
    }

    // Get central code from environment or use default
    const centralCode = process.env.TAXI4U_CENTRAL_CODE || 'VS';

    // Build booking payload with flat structure (Taxi4U API format)
    const bookingData: any = {
      centralCode,
      // From location - complete address
      fromStreet: body.fromStreet,
      fromCity: body.fromCity || 'Voss',
      fromPostalCode: body.fromPostalCode || '',
      // To location - optional, with defaults
      toStreet: body.toStreet || '',
      toCity: body.toCity || '',
      toPostalCode: body.toPostalCode || '',
      // Customer information
      customerName: body.customerName,
      tel: body.tel,
      pickupTime: body.pickupTime,
      orderedBy: body.orderedBy || 'Website',
      // Required fields (even if empty)
      messageToCar: body.messageToDriver || body.messageToCar || '',
      messageToBooking: body.messageToBooking || '',
      taxiAccountNo: body.accountNumber || process.env.TAXI4U_DEFAULT_ACCOUNT_NO || '0',
      // attributes expects a comma-separated string, not an array
      attributes: Array.isArray(body.attributes)
        ? body.attributes.join(',')
        : (body.attributes || ''),
    };

    // Call Taxi4U API with authentication and retry logic
    console.log('Sending booking request:', JSON.stringify(bookingData, null, 2));

    const response = await retryWithBackoff(
      () => taxi4uFetch('https://api.taxi4u.cab/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      }),
      {
        maxAttempts: 3,
        initialDelayMs: 1000,
        shouldRetry: (error: any) => {
          // Retry on network errors and 5xx server errors
          if (error?.name === 'TypeError' || error?.name === 'NetworkError') return true;
          if (error?.status >= 500 && error?.status < 600) return true;
          if (error?.status === 408 || error?.status === 504) return true;
          return false;
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails = errorText;

      // Try to parse error as JSON for better error messages
      try {
        const errorJson = JSON.parse(errorText);

        // Extract detailed error information
        let specificErrors: string[] = [];
        if (errorJson.errors) {
          // Handle Taxi4U API error format
          if (errorJson.errors.generalErrors && Array.isArray(errorJson.errors.generalErrors)) {
            specificErrors = errorJson.errors.generalErrors;
          }
          // Handle other error formats
          if (typeof errorJson.errors === 'object') {
            Object.keys(errorJson.errors).forEach(key => {
              const value = errorJson.errors[key];
              if (Array.isArray(value)) {
                specificErrors.push(...value);
              } else {
                specificErrors.push(String(value));
              }
            });
          }
        }

        errorDetails = specificErrors.length > 0
          ? specificErrors.join('; ')
          : (errorJson.message || errorJson.error || errorText);

        // Log detailed error information with all details
        console.error('Simple booking API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorJson,
          specificErrors,
          requestData: bookingData,
          timestamp: new Date().toISOString(),
        });
      } catch {
        console.error('Simple booking API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          requestData: bookingData,
          timestamp: new Date().toISOString(),
        });
      }

      return NextResponse.json(
        {
          error: 'Booking failed',
          details: errorDetails,
          statusCode: response.status,
          type: 'api_error'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check for error in response data
    if (data.errorMessage) {
      console.error('Simple booking response error:', {
        errorMessage: data.errorMessage,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: 'Booking failed', details: data.errorMessage },
        { status: 400 }
      );
    }

    // Log successful booking
    console.log('Simple booking successful:', {
      bookRef: data.bookRef,
      timestamp: new Date().toISOString(),
    });

    const responseData = {
      success: true,
      bookRef: data.bookRef,
      data,
    };

    // Log response
    logResponse(requestId, { status: 200, data: responseData }, startTime);
    trackRequestMetrics(request.nextUrl.pathname, 200, Date.now() - startTime);

    const response = NextResponse.json(responseData);
    response.headers.set('X-Request-Id', requestId);
    return response;
  } catch (error) {
    // Enhanced error logging
    console.error('Simple booking unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        type: 'server_error'
      },
      { status: 500 }
    );
  }
}
