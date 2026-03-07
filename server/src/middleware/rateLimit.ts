import type { Context, Next } from "hono";

interface RateLimitEntry {
  count: number;
  resetAt: number;
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
    } else {
      store.set(ip, {
        count: 1,
        resetAt: now + config.windowMs,
      });
    }

    await next();
  };
};

export const resetRateLimitStores = (): void => {
  stores.forEach((store) => store.clear());
};
