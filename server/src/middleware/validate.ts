import type { Context, Next } from "hono";
import type { z } from "zod";

export const validateBody = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json(
        {
          error: {
            code: "INVALID_INPUT" as const,
            message: "Request body must be valid JSON",
          },
        },
        400,
      );
    }

    const result = schema.safeParse(body);
    if (!result.success) {
      return c.json(
        {
          error: {
            code: "INVALID_INPUT" as const,
            message: result.error.issues
              .map((i) => `${String(i.path.join("."))}: ${i.message}`)
              .join("; "),
          },
        },
        400,
      );
    }

    c.set("validatedBody", result.data);
    await next();
  };
};

export const validateQuery = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    const query = c.req.query();
    const result = schema.safeParse(query);
    if (!result.success) {
      return c.json(
        {
          error: {
            code: "INVALID_INPUT" as const,
            message: result.error.issues
              .map((i) => `${String(i.path.join("."))}: ${i.message}`)
              .join("; "),
          },
        },
        400,
      );
    }

    c.set("validatedQuery", result.data);
    await next();
  };
};
