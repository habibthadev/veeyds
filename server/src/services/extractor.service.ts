import type { MediaFormat, MediaInfo } from "../types/media";
import { resolveBinaryPath, resolveFFmpegPath, buildInfoArgs } from "../utils/ytdlp";
import { sanitizeUrl } from "../utils/sanitize";
import { spawnWithTimeout } from "../utils/process";
import { buildFormatLabel } from "../utils/format";
import { sanitizeYtdlpError } from "../utils/errors";

const INFO_TIMEOUT_MS = 30_000;
const CACHE_TTL_MS = 2 * 60 * 1000;
const CACHE_MAX_SIZE = 100;

interface CacheEntry {
  data: MediaInfo;
  expiresAt: number;
}

const infoCache = new Map<string, CacheEntry>();

const getCached = (url: string): MediaInfo | null => {
  const entry = infoCache.get(url);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    infoCache.delete(url);
    return null;
  }
  return entry.data;
};

const setCache = (url: string, data: MediaInfo): void => {
  if (infoCache.size >= CACHE_MAX_SIZE) {
    const now = Date.now();
    for (const [key, entry] of infoCache) {
      if (now > entry.expiresAt) infoCache.delete(key);
    }
    if (infoCache.size >= CACHE_MAX_SIZE) {
      const firstKey = infoCache.keys().next().value as string | undefined;
      if (firstKey !== undefined) infoCache.delete(firstKey);
    }
  }
  infoCache.set(url, { data, expiresAt: Date.now() + CACHE_TTL_MS });
};

interface YtdlpFormat {
  format_id?: string;
  ext?: string;
  resolution?: string;
  width?: number;
  height?: number;
  filesize?: number;
  filesize_approx?: number;
  acodec?: string;
  vcodec?: string;
  protocol?: string;
}

interface YtdlpInfo {
  title?: string;
  thumbnail?: string;
  duration?: number;
  extractor_key?: string;
  extractor?: string;
  webpage_url?: string;
  formats?: YtdlpFormat[];
}

const isNoneCodec = (codec: string | undefined): boolean =>
  !codec || codec === "none";

const hasResolution = (raw: YtdlpFormat): boolean =>
  (raw.width !== undefined && raw.width > 0 && raw.height !== undefined && raw.height > 0) ||
  (raw.resolution !== undefined && raw.resolution !== null && raw.resolution !== "audio only");

const resolveExt = (raw: YtdlpFormat, hasVideo: boolean, hasAudio: boolean): string => {
  if (!hasVideo && hasAudio && (raw.ext === "mp4" || raw.ext === "m4a")) return "m4a";
  return raw.ext ?? "unknown";
};

const mapFormat = (raw: YtdlpFormat): MediaFormat => {
  const codecHasAudio = !isNoneCodec(raw.acodec);
  const codecHasVideo = !isNoneCodec(raw.vcodec);
  const hasRes = hasResolution(raw);

  const isPreMuxed = !codecHasVideo && !codecHasAudio && hasRes;
  const hasVideo = codecHasVideo || isPreMuxed;
  const hasAudio = codecHasAudio || isPreMuxed;
  const needsMux = codecHasVideo && !codecHasAudio;

  const resolution =
    raw.width && raw.height ? `${raw.width}x${raw.height}` : raw.resolution ?? null;
  const filesize = raw.filesize ?? raw.filesize_approx ?? null;
  const ext = resolveExt(raw, hasVideo, hasAudio);

  return {
    id: raw.format_id ?? "unknown",
    ext,
    resolution,
    filesize,
    hasAudio,
    hasVideo,
    needsMux,
    label: buildFormatLabel({ ext, resolution, hasAudio, hasVideo, filesize }),
  };
};

const filterUsableFormats = (formats: MediaFormat[]): MediaFormat[] =>
  formats.filter((f) => f.hasAudio || f.hasVideo);

export const extractMediaInfo = async (rawUrl: string): Promise<MediaInfo> => {
  const url = sanitizeUrl(rawUrl);

  const cached = getCached(url);
  if (cached) return cached;

  const binaryPath = await resolveBinaryPath();
  const ffmpegPath = await resolveFFmpegPath();
  const args = buildInfoArgs(url, ffmpegPath);

  const result = await spawnWithTimeout(binaryPath, args, INFO_TIMEOUT_MS);

  if (result.exitCode !== 0) {
    const { code, message } = sanitizeYtdlpError(result.stderr.trim());
    throw Object.assign(new Error(message), { code });
  }

  let parsed: YtdlpInfo;
  try {
    parsed = JSON.parse(result.stdout) as YtdlpInfo;
  } catch {
    throw Object.assign(new Error("Failed to parse media information"), {
      code: "EXTRACTION_FAILED",
    });
  }

  const rawFormats = (parsed.formats ?? []).map(mapFormat);
  const formats = filterUsableFormats(rawFormats);

  if (formats.length === 0) {
    throw Object.assign(new Error("No downloadable formats found"), {
      code: "EXTRACTION_FAILED",
    });
  }

  const info: MediaInfo = {
    title: parsed.title ?? "Untitled",
    thumbnail: parsed.thumbnail ?? null,
    duration: parsed.duration ?? null,
    platform: parsed.extractor_key ?? parsed.extractor ?? "Unknown",
    formats,
    originalUrl: parsed.webpage_url ?? url,
  };

  setCache(url, info);
  return info;
};
