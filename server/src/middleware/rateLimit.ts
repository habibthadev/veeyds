import type { Context, Next } from "hono";

interface RateLimitEntry {
  count: number;
  resetAt: number;
  remaining: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

const getClientIp = (c: Context): string => {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    c.req.header("x-real-ip") ??
    c.req.header("fly-client-ip") ??
    "unknown"
  );
};

export const rateLimit = (config: RateLimitConfig) => {
  const storeKey = `${config.maxRequests}-${config.windowMs}`;
  if (!stores.has(storeKey)) {
    stores.set(storeKey, new Map());
  }
  const store = stores.get(storeKey) as Map<string, RateLimitEntry>;

  return async (c: Context, next: Next) => {
    const ip = getClientIp(c);
    const now = Date.now();
    const entry = store.get(ip);

    if (entry && now < entry.resetAt) {
      const remaining = Math.max(0, config.maxRequests - entry.count);

      c.header("X-RateLimit-Limit", String(config.maxRequests));
      c.header("X-RateLimit-Remaining", String(remaining));
      c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

      if (entry.count >= config.maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        c.header("Retry-After", String(retryAfter));
        return c.json(
          {
            error: {
              code: "RATE_LIMITED" as const,
              message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
            },
          },
          429,
        );
      }
      entry.count++;
      entry.remaining = remaining - 1;
    } else {
      store.set(ip, {
        count: 1,
        resetAt: now + config.windowMs,
        remaining: config.maxRequests - 1,
      });

      c.header("X-RateLimit-Limit", String(config.maxRequests));
      c.header("X-RateLimit-Remaining", String(config.maxRequests - 1));
      c.header("X-RateLimit-Reset", String(Math.ceil((now + config.windowMs) / 1000)));
    }

    await next();
  };
};

export const resetRateLimitStores = (): void => {
  stores.forEach((store) => store.clear());
};
