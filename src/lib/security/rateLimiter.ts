/**
 * Hybrid Rate Limiter:
 * - Uses Upstash Redis REST API if UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN are set.
 * - Otherwise falls back to an in-memory sliding window store with a documented warning
 *   noting that serverless instances do not share memory across cold starts.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export async function checkRateLimit(
  key: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Upstash Redis distributed rate-limiting
  if (upstashUrl && upstashToken) {
    try {
      const now = Math.floor(Date.now() / 1000);
      const windowKey = `rl:${key}:${Math.floor(now / windowSeconds)}`;

      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', windowKey],
          ['EXPIRE', windowKey, windowSeconds * 2],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        const currentCount = Number(data[0]?.result || 1);
        const allowed = currentCount <= limit;
        const remaining = Math.max(0, limit - currentCount);

        return {
          allowed,
          limit,
          remaining,
          resetSeconds: windowSeconds - (now % windowSeconds),
        };
      }
    } catch (e) {
      console.warn('[RateLimiter] Upstash error, falling back to memory store:', e);
    }
  }

  // 2. In-Memory fallback (per-instance, development & fallback)
  const nowMs = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = nowMs - windowMs;

  const record = memoryStore.get(key) || { timestamps: [] };
  const validTimestamps = record.timestamps.filter(ts => ts > cutoff);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const resetSeconds = Math.max(1, Math.ceil((oldest + windowMs - nowMs) / 1000));
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetSeconds,
    };
  }

  validTimestamps.push(nowMs);
  memoryStore.set(key, { timestamps: validTimestamps });

  return {
    allowed: true,
    limit,
    remaining: limit - validTimestamps.length,
    resetSeconds: windowSeconds,
  };
}

export function resetRateLimits(): void {
  memoryStore.clear();
}
