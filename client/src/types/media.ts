import type { z } from "zod";
import type { MediaFormatSchema, MediaInfoSchema, ErrorResponseSchema } from "../utils/validators";

export type MediaFormat = z.infer<typeof MediaFormatSchema>;
export type MediaInfo = z.infer<typeof MediaInfoSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export interface QueueItem {
  id: string;
  url: string;
  status: "pending" | "loading" | "ready" | "downloading" | "error";
  info: MediaInfo | null;
  selectedFormatId: string | null;
  error: string | null;
}
