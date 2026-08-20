interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: unknown) => boolean;
}

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 2,
    initialDelayMs = 300,
    maxDelayMs = 2000,
    shouldRetry = (err) => {
      // Only retry network failures or server 503/504 errors, NEVER retry 4xx auth errors
      if (err && typeof err === 'object' && 'status' in err) {
        const status = (err as { status: number }).status;
        return status === 503 || status === 504;
      }
      return true; // Transient network error
    },
  } = options;

  let attempt = 0;
  let delay = initialDelayMs;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Exponential backoff with small random jitter
      const jitter = Math.random() * 100;
      const nextDelay = Math.min(delay * 2 + jitter, maxDelayMs);
      await new Promise((resolve) => setTimeout(resolve, nextDelay));
      delay = nextDelay;
    }
  }
}
