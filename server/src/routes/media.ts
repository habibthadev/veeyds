import { Hono } from "hono";
import { MediaInfoRequestSchema, MediaDownloadQuerySchema } from "../types/media.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getMediaInfo, downloadMedia } from "../controllers/media.controller.js";

const media = new Hono();

media.post(
  "/info",
  rateLimit({ maxRequests: 30, windowMs: 15 * 60 * 1000 }),
  validateBody(MediaInfoRequestSchema),
  getMediaInfo,
);

media.get(
  "/download",
  rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 }),
  validateQuery(MediaDownloadQuerySchema),
  downloadMedia,
);

export { media };
