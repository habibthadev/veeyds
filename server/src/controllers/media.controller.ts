import type { Context } from "hono";
import type { MediaInfoRequest, MediaDownloadQuery, ErrorCode } from "../types/media.js";
import { extractMediaInfo } from "../services/extractor.service.js";
import { streamDirectDownload, streamMuxedDownload } from "../services/stream.service.js";

const createErrorResponse = (code: ErrorCode, message: string) => ({
  error: { code, message },
});

const handleExtractionError = (err: unknown): { status: number; body: ReturnType<typeof createErrorResponse> } => {
  const error = err as Error & { code?: string };
  const code = (error.code ?? "INTERNAL") as ErrorCode;
  const statusMap: Record<string, number> = {
    UNSUPPORTED_URL: 400,
    INVALID_INPUT: 400,
    RATE_LIMITED: 429,
    TIMEOUT: 504,
    EXTRACTION_FAILED: 422,
    INTERNAL: 500,
  };
  return {
    status: statusMap[code] ?? 500,
    body: createErrorResponse(code, error.message ?? "An unexpected error occurred"),
  };
};

export const getMediaInfo = async (c: Context): Promise<Response> => {
  const { url } = c.get("validatedBody") as MediaInfoRequest;

  try {
    const info = await extractMediaInfo(url);
    return c.json(info, 200);
  } catch (err) {
    const { status, body } = handleExtractionError(err);
    return c.json(body, status as Parameters<typeof c.json>[1]);
  }
};

export const downloadMedia = async (c: Context): Promise<Response> => {
  const { url, formatId } = c.get("validatedQuery") as MediaDownloadQuery;

  let info;
  try {
    info = await extractMediaInfo(url);
  } catch (err) {
    const { status, body } = handleExtractionError(err);
    return c.json(body, status as Parameters<typeof c.json>[1]);
  }

  const format = info.formats.find((f) => f.id === formatId);
  if (!format) {
    return c.json(createErrorResponse("INVALID_INPUT", "Format not found"), 400);
  }

  try {
    const needsMuxing = format.hasVideo && !format.hasAudio;
    const download = needsMuxing ? streamMuxedDownload : streamDirectDownload;
    const result = await download(url, formatId, info.title, format.ext);

    c.header("Content-Type", result.contentType);
    c.header("Content-Disposition", `attachment; filename="${result.filename}"`);
    if (result.contentLength !== null) {
      c.header("Content-Length", String(result.contentLength));
    }

    return new Response(result.stream, {
      status: 200,
      headers: c.res.headers,
    });
  } catch (err) {
    const { status, body } = handleExtractionError(err);
    return c.json(body, status as Parameters<typeof c.json>[1]);
  }
};
