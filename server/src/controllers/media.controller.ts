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
    FORBIDDEN: 403,
    AGE_RESTRICTED: 403,
    GEO_RESTRICTED: 403,
    BOT_DETECTED: 422,
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

  const resolvedFormatId = format.needsMux
    ? `${formatId}+bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio`
    : formatId;
  const resolvedExt = format.needsMux ? "mp4" : format.ext;

  try {
    let result;

    if (format.needsMux) {
      result = await streamMuxedDownload(url, resolvedFormatId, info.title, resolvedExt);
    } else {
      try {
        result = await streamDirectDownload(url, resolvedFormatId, info.title, resolvedExt);
      } catch {
        result = await streamMuxedDownload(url, resolvedFormatId, info.title, resolvedExt);
      }
    }

    const asciiFilename = result.filename;
    const rfc5987 = `UTF-8''${encodeURIComponent(result.filename)}`;

    c.header("Content-Type", result.contentType);
    c.header(
      "Content-Disposition",
      `attachment; filename="${asciiFilename}"; filename*=${rfc5987}`,
    );
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
