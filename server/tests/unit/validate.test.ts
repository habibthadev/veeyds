import { Hono } from "hono";
import { z } from "zod";
import { validateBody, validateQuery } from "../../src/middleware/validate.js";

describe("validateBody", () => {
  const schema = z.object({ url: z.string().url() });
  const app = new Hono();
  app.post("/test", validateBody(schema), (c) => {
    const body = c.get("validatedBody");
    return c.json(body);
  });

  it("passes valid body through", async () => {
    const res = await app.request("/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://example.com" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toBe("https://example.com");
  });

  it("rejects invalid body", async () => {
    const res = await app.request("/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "not-a-url" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe("INVALID_INPUT");
  });

  it("rejects non-JSON body", async () => {
    const res = await app.request("/test", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "not json",
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe("INVALID_INPUT");
  });
});

describe("validateQuery", () => {
  const schema = z.object({ id: z.string() });
  const app = new Hono();
  app.get("/test", validateQuery(schema), (c) => {
    const query = c.get("validatedQuery");
    return c.json(query);
  });

  it("passes valid query through", async () => {
    const res = await app.request("/test?id=abc");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe("abc");
  });

  it("rejects missing required query param", async () => {
    const res = await app.request("/test");
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe("INVALID_INPUT");
  });
});
