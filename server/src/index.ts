import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import pino from "pino";
import { corsMiddleware } from "./middleware/cors.js";
import { media } from "./routes/media.js";
import { resolveBinaryPath, resolveFFmpegPath, resolveDenoPath } from "./utils/ytdlp.js";
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
            "200": { description: "Media information extracted successfully" },
            "400": { description: "Invalid input or unsupported URL" },
            "403": { description: "Access forbidden (region-locked or requires auth)" },
            "422": { description: "Extraction failed" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
      "/api/media/download": {
        get: {
          summary: "Download media file",
          parameters: [
            { name: "url", in: "query", required: true, schema: { type: "string", format: "uri" } },
            { name: "formatId", in: "query", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Media file stream" },
            "400": { description: "Invalid input" },
            "403": { description: "Access forbidden" },
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

const start = async () => {
  try {
    const ytdlpPath = await resolveBinaryPath();
    logger.info(`yt-dlp: ${ytdlpPath}`);
  } catch {
    logger.error("yt-dlp binary not found. Install it and ensure it is on PATH.");
    process.exit(1);
  }

  const ffmpegPath = await resolveFFmpegPath();
  if (ffmpegPath) {
    logger.info(`ffmpeg: ${ffmpegPath}`);
  } else {
    logger.warn("ffmpeg not found — muxed downloads will fail. Install ffmpeg.");
  }

  const denoPath = await resolveDenoPath();
  if (denoPath) {
    logger.info(`deno: ${denoPath} (JS runtime for YouTube n-challenge)`);
  } else {
    logger.warn("deno not found — YouTube extraction may fail for some videos.");
  }

  const cookiesPath = process.env.COOKIES_FILE;
  if (cookiesPath) {
    logger.info(`cookies: ${cookiesPath}`);
  }

  serve({ fetch: app.fetch, port }, () => {
    logger.info(`Veeyds server running on port ${port}`);
  });
};

start();

export { app };

export default app;
