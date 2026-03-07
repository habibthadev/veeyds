import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import pino from "pino";
import { corsMiddleware } from "./middleware/cors.js";
import { media } from "./routes/media.js";
import type { ErrorCode } from "./types/media.js";

const logger = pino(
  process.env.NODE_ENV === "production"
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      },
);

const app = new Hono();

app.use("*", corsMiddleware);

app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  logger.info({
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration: `${duration}ms`,
  });
});

app.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));

app.get("/api/openapi.json", (c) => {
  return c.json({
    openapi: "3.0.0",
    info: {
      title: "Veeyds API",
      version: "1.0.0",
      description: "Media downloader API powered by yt-dlp",
    },
    servers: [{ url: process.env.API_BASE_URL ?? "http://localhost:3001" }],
    paths: {
      "/api/media/info": {
        post: {
          summary: "Extract media information",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["url"],
                  properties: {
                    url: { type: "string", format: "uri" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Media information extracted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      thumbnail: { type: "string", nullable: true },
                      duration: { type: "number", nullable: true },
                      platform: { type: "string" },
                      formats: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            ext: { type: "string" },
                            resolution: { type: "string", nullable: true },
                            filesize: { type: "number", nullable: true },
                            hasAudio: { type: "boolean" },
                            hasVideo: { type: "boolean" },
                            label: { type: "string" },
                          },
                        },
                      },
                      originalUrl: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": { description: "Invalid input or unsupported URL" },
            "422": { description: "Extraction failed" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
      "/api/media/download": {
        get: {
          summary: "Download media file",
          parameters: [
            {
              name: "url",
              in: "query",
              required: true,
              schema: { type: "string", format: "uri" },
            },
            {
              name: "formatId",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Media file stream",
              content: { "application/octet-stream": { schema: { type: "string", format: "binary" } } },
            },
            "400": { description: "Invalid input" },
            "422": { description: "Download failed" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
    },
  });
});

app.route("/api/media", media);

app.get("/health", (c) => c.json({ status: "ok" }));

app.onError((err, c) => {
  logger.error({ err: err.message, stack: err.stack });
  return c.json(
    {
      error: {
        code: "INTERNAL" as ErrorCode,
        message: "An unexpected error occurred",
      },
    },
    500,
  );
});

app.notFound((c) => {
  return c.json(
    {
      error: {
        code: "INTERNAL" as ErrorCode,
        message: `Route not found: ${c.req.method} ${c.req.path}`,
      },
    },
    404,
  );
});

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, () => {
  logger.info(`Veeyds server running on port ${port}`);
});

export { app };

export default app;
