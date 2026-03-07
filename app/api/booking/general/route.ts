import { NextRequest, NextResponse } from 'next/server';
import { taxi4uFetch } from '@/lib/taxi4u-auth';
import { validateGeneralBookingRequest } from '@/lib/validation';
import { retryWithBackoff } from '@/lib/retry';
import { strictRateLimiter } from '@/lib/rate-limit';
import { logRequest, logResponse, trackRequestMetrics } from '@/lib/request-logger';
import type { GeneralBookingRequest, BookingResponse } from '@/lib/types/booking';

// General booking endpoint (multi-passenger, detailed)
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let requestId: string = '';

  try {
    // Apply rate limiting
    const rateLimitResult = await strictRateLimiter(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Parse request body
    const body = await request.json();

    // Log request
    requestId = logRequest(request, { body });

    // Validate request using validation utilities
    const validation = validateGeneralBookingRequest(body);
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

    // Build enhanced booking payload - send addresses as-is
    const bookingData = {
      ...body,
      // Add required dispatch fields
      carGroupId: body.carGroupId || 1, // Default to standard taxi (group 1)
      numberOfCars: body.numberOfCars || 1, // Default to 1 car
    };

    console.log('Sending general booking request:', JSON.stringify(bookingData, null, 2));

    // Call Taxi4U API with authentication and retry logic
    const response = await retryWithBackoff(
      () => taxi4uFetch(
        `https://api.taxi4u.cab/api/book/general?centralCode=${centralCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        }
      ),
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
        console.error('General booking API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorJson,
          specificErrors,
          requestData: bookingData,
          timestamp: new Date().toISOString(),
        });
      } catch {
        console.error('General booking API error:', {
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
      console.error('General booking response error:', {
        errorMessage: data.errorMessage,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: 'Booking failed', details: data.errorMessage },
        { status: 400 }
      );
    }

    // Log successful booking
    console.log('General booking successful:', {
      internalNo: data.internalNo,
      bookRef: data.bookRef,
      timestamp: new Date().toISOString(),
    });

    const responseData = {
      success: true,
      internalNo: data.internalNo,
      bookRef: data.bookRef,
      data,
    };

    // Log response
    logResponse(requestId, { status: 200, data: responseData }, startTime);
    trackRequestMetrics(request.nextUrl.pathname, 200, Date.now() - startTime);

    const finalResponse = NextResponse.json(responseData);
    finalResponse.headers.set('X-Request-Id', requestId);
    return finalResponse;
  } catch (error) {
    // Enhanced error logging
    console.error('General booking unexpected error:', {
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
