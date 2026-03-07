import { Hono } from "hono";
import { rateLimit, resetRateLimitStores } from "../../src/middleware/rateLimit.js";

const createTestApp = (maxRequests: number, windowMs: number) => {
  const app = new Hono();
  app.use("*", rateLimit({ maxRequests, windowMs }));
  app.get("/test", (c) => c.json({ ok: true }));
  return app;
};

describe("rateLimit", () => {
  beforeEach(() => {
    resetRateLimitStores();
  });

  it("allows requests within limit", async () => {
    const app = createTestApp(3, 60000);
    const res = await app.request("/test", {
      headers: { "x-forwarded-for": "1.2.3.4" },
    });
    expect(res.status).toBe(200);
  });

  it("blocks requests exceeding limit", async () => {
    const app = createTestApp(2, 60000);
    const headers = { "x-forwarded-for": "10.0.0.1" };

    await app.request("/test", { headers });
    await app.request("/test", { headers });
    const res = await app.request("/test", { headers });

    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error.code).toBe("RATE_LIMITED");
  });

  it("includes Retry-After header on 429", async () => {
    const app = createTestApp(1, 60000);
    const headers = { "x-forwarded-for": "10.0.0.2" };

    await app.request("/test", { headers });
    const res = await app.request("/test", { headers });

    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
  });

  it("tracks different IPs independently", async () => {
    const app = createTestApp(1, 60000);

    await app.request("/test", {
      headers: { "x-forwarded-for": "10.0.0.3" },
    });
    const res = await app.request("/test", {
      headers: { "x-forwarded-for": "10.0.0.4" },
    });

    expect(res.status).toBe(200);
  });
});
