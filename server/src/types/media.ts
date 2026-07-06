import { z } from "zod";

export const MediaFormatSchema = z.object({
  id: z.string(),
  ext: z.string(),
  resolution: z.string().nullable(),
  filesize: z.number().nullable(),
  hasAudio: z.boolean(),
  hasVideo: z.boolean(),
  needsMux: z.boolean(),
  label: z.string(),
});

export const MediaInfoSchema = z.object({
  title: z.string(),
  thumbnail: z.string().url().nullable(),
  duration: z.number().nullable(),
  platform: z.string(),
  formats: z.array(MediaFormatSchema),
  originalUrl: z.string().url(),
});

export const MediaInfoRequestSchema = z.object({
  url: z.string().url(),
});

export const MediaDownloadQuerySchema = z.object({
  url: z.string().url(),
  formatId: z.string(),
});

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.enum([
      "UNSUPPORTED_URL",
      "EXTRACTION_FAILED",
      "FORBIDDEN",
      "AGE_RESTRICTED",
      "GEO_RESTRICTED",
      "BOT_DETECTED",
      "RATE_LIMITED",
      "INVALID_INPUT",
      "TIMEOUT",
      "INTERNAL",
    ]),
    message: z.string(),
  }),
});

export type MediaFormat = z.infer<typeof MediaFormatSchema>;
export type MediaInfo = z.infer<typeof MediaInfoSchema>;
export type MediaInfoRequest = z.infer<typeof MediaInfoRequestSchema>;
export type MediaDownloadQuery = z.infer<typeof MediaDownloadQuerySchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ErrorCode = ErrorResponse["error"]["code"];
