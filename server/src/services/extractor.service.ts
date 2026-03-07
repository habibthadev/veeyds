import type { MediaFormat, MediaInfo } from "../types/media";
import { resolveBinaryPath, resolveFFmpegPath, buildInfoArgs } from "../utils/ytdlp";
import { sanitizeUrl } from "../utils/sanitize";
import { spawnWithTimeout } from "../utils/process";
import { buildFormatLabel } from "../utils/format";

const INFO_TIMEOUT_MS = 30_000;

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

const mapFormat = (raw: YtdlpFormat): MediaFormat => {
  const hasAudio = !isNoneCodec(raw.acodec);
  const hasVideo = !isNoneCodec(raw.vcodec);
  const resolution =
    raw.width && raw.height ? `${raw.width}x${raw.height}` : raw.resolution ?? null;
  const filesize = raw.filesize ?? raw.filesize_approx ?? null;
  const ext = raw.ext ?? "unknown";

  return {
    id: raw.format_id ?? "unknown",
    ext,
    resolution,
    filesize,
    hasAudio,
    hasVideo,
    label: buildFormatLabel({ ext, resolution, hasAudio, hasVideo, filesize }),
  };
};

const filterUsableFormats = (formats: MediaFormat[]): MediaFormat[] =>
  formats.filter((f) => f.hasAudio || f.hasVideo);

export const extractMediaInfo = async (rawUrl: string): Promise<MediaInfo> => {
  const url = sanitizeUrl(rawUrl);
  const binaryPath = await resolveBinaryPath();
  const ffmpegPath = await resolveFFmpegPath();
  const args = buildInfoArgs(url, ffmpegPath);

  const result = await spawnWithTimeout(binaryPath, args, INFO_TIMEOUT_MS);

  if (result.exitCode !== 0) {
    const stderr = result.stderr.trim();
    if (stderr.includes("Unsupported URL") || stderr.includes("is not a valid URL")) {
      throw Object.assign(new Error("URL is not supported by any extractor"), {
        code: "UNSUPPORTED_URL",
      });
    }
    throw Object.assign(new Error(stderr || "Failed to extract media information"), {
      code: "EXTRACTION_FAILED",
    });
  }

  let parsed: YtdlpInfo;
  try {
    parsed = JSON.parse(result.stdout) as YtdlpInfo;
  } catch {
    throw Object.assign(new Error("Failed to parse yt-dlp output"), {
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

  return {
    title: parsed.title ?? "Untitled",
    thumbnail: parsed.thumbnail ?? null,
    duration: parsed.duration ?? null,
    platform: parsed.extractor_key ?? parsed.extractor ?? "Unknown",
    formats,
    originalUrl: parsed.webpage_url ?? url,
  };
};
