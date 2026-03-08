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

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export const UrlInputSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});
