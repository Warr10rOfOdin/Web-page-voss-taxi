/**
 * Retry logic utilities for handling transient failures
 * Implements exponential backoff for API requests
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  shouldRetry: (error: any) => {
    // Retry on network errors and 5xx server errors
    if (error?.name === 'TypeError' || error?.name === 'NetworkError') {
      return true;
    }
    if (error?.status >= 500 && error?.status < 600) {
      return true;
    }
    // Retry on specific Taxi4U API timeout errors
    if (error?.status === 408 || error?.status === 504) {
      return true;
    }
    return false;
  },
};

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number
): number {
  const delay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
  return Math.min(delay, maxDelayMs);
}

/**
 * Retry a function with exponential backoff
 *
 * @example
 * const result = await retryWithBackoff(
 *   async () => {
 *     const response = await fetch('https://api.example.com/data');
 *     if (!response.ok) throw new Error(`HTTP ${response.status}`);
 *     return response.json();
 *   },
 *   { maxAttempts: 3, initialDelayMs: 1000 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!opts.shouldRetry(error)) {
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt === opts.maxAttempts) {
        throw error;
      }

      // Calculate delay and wait before next attempt
      const delay = calculateDelay(
        attempt,
        opts.initialDelayMs,
        opts.maxDelayMs,
        opts.backoffMultiplier
      );

      console.log(
        `Retry attempt ${attempt}/${opts.maxAttempts} after ${delay}ms delay`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Retry a fetch request with exponential backoff
 *
 * @example
 * const response = await retryFetch('https://api.example.com/data', {
 *   method: 'POST',
 *   body: JSON.stringify(data),
 * });
 */
export async function retryFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return retryWithBackoff(
    async () => {
      const response = await fetch(input, init);

      // Create an error object for retry logic
      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      return response;
    },
    retryOptions
  );
}

/**
 * Wrap an async function with retry logic
 *
 * @example
 * const fetchDataWithRetry = withRetry(
 *   async (id: string) => {
 *     const response = await fetch(`/api/data/${id}`);
 *     return response.json();
 *   },
 *   { maxAttempts: 3 }
 * );
 *
 * const data = await fetchDataWithRetry('123');
 */
export function withRetry<Args extends any[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options: RetryOptions = {}
): (...args: Args) => Promise<Result> {
  return (...args: Args) => retryWithBackoff(() => fn(...args), options);
}

/**
 * Circuit breaker state
 */
enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, reject requests immediately
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

/**
 * Simple circuit breaker implementation
 * Prevents cascading failures by failing fast when a service is down
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttemptTime = 0;

  constructor(
    private options: {
      failureThreshold?: number;
      successThreshold?: number;
      timeout?: number;
    } = {}
  ) {
    this.options.failureThreshold = options.failureThreshold ?? 5;
    this.options.successThreshold = options.successThreshold ?? 2;
    this.options.timeout = options.timeout ?? 60000; // 1 minute
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
      this.state = CircuitState.HALF_OPEN;
      this.successCount = 0;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold!) {
        this.state = CircuitState.CLOSED;
      }
    }
  }

  private onFailure() {
    this.failureCount++;

    if (
      this.state === CircuitState.HALF_OPEN ||
      this.failureCount >= this.options.failureThreshold!
    ) {
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = Date.now() + this.options.timeout!;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  reset() {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttemptTime = 0;
  }
}
