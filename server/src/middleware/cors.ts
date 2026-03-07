import { cors as honoCors } from "hono/cors";

export const corsMiddleware = honoCors({
  origin: (origin) => {
    if (!origin) return "*";
    const raw = process.env.ALLOWED_ORIGINS;
    if (!raw) return origin;
    const allowed = raw.split(",").map((o) => o.trim()).filter(Boolean);
    return allowed.includes(origin) ? origin : null;
  },
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type"],
  maxAge: 86400,
});
