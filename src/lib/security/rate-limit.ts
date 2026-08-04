export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * NOTE: this state is per Node process and is cleared on restart / not shared
 * across multiple instances. Suitable for dev/monolith; swap for a persisted
 * store (Redis) when scaling horizontally.
 */
const store = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
