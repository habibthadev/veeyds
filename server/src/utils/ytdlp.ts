import { execFile } from "node:child_process";
import { access, constants } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

let resolvedBinaryPath: string | null = null;
let resolvedFFmpegPath: string | null | undefined = undefined;

const YTDLP_CANDIDATES = ["yt-dlp", resolve(process.cwd(), "bin", "yt-dlp")];
const FFMPEG_CANDIDATES = ["ffmpeg", resolve(process.cwd(), "bin", "ffmpeg")];

const checkExecutable = async (candidate: string): Promise<boolean> => {
  try {
    if (candidate.includes("/")) {
      await access(candidate, constants.X_OK);
    } else {
      await execFileAsync(candidate, ["--version"]);
    }
    return true;
  } catch {
    return false;
  }
};

export const resolveBinaryPath = async (): Promise<string> => {
  if (resolvedBinaryPath) return resolvedBinaryPath;

  for (const candidate of YTDLP_CANDIDATES) {
    if (await checkExecutable(candidate)) {
      resolvedBinaryPath = candidate;
      return candidate;
    }
  }

  throw new Error("yt-dlp binary not found");
};

export const resolveFFmpegPath = async (): Promise<string | null> => {
  if (resolvedFFmpegPath !== undefined) return resolvedFFmpegPath;

  for (const candidate of FFMPEG_CANDIDATES) {
    if (await checkExecutable(candidate)) {
      resolvedFFmpegPath = candidate;
      return candidate;
    }
  }

  resolvedFFmpegPath = null;
  return null;
};

const withFFmpeg = (ffmpegPath: string | null): ReadonlyArray<string> =>
  ffmpegPath ? ["--ffmpeg-location", ffmpegPath] : [];

export const buildInfoArgs = (
  url: string,
  ffmpegPath: string | null = null,
): ReadonlyArray<string> => [
  "--dump-json",
  "--no-warnings",
  "--no-playlist",
  "--flat-playlist",
  ...withFFmpeg(ffmpegPath),
  url,
];

export const buildDownloadArgs = (
  url: string,
  formatId: string,
  outputPath: string,
  ffmpegPath: string | null = null,
): ReadonlyArray<string> => {
  const isMuxed = formatId.includes("+");
  return [
    "-f",
    formatId,
    "--no-warnings",
    "--no-playlist",
    "--no-part",
    ...(isMuxed ? ["--merge-output-format", "mp4"] : []),
    "-o",
    outputPath,
    ...withFFmpeg(ffmpegPath),
    url,
  ];
};

export const buildStreamArgs = (
  url: string,
  formatId: string,
  ffmpegPath: string | null = null,
): ReadonlyArray<string> => {
  if (formatId.includes("+")) {
    throw Object.assign(
      new Error("Muxed formats cannot be streamed to stdout — use buildDownloadArgs"),
      { code: "EXTRACTION_FAILED" },
    );
  }
  return [
    "-f",
    formatId,
    "--no-warnings",
    "--no-playlist",
    "-o",
    "-",
    ...withFFmpeg(ffmpegPath),
    url,
  ];
};
