import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

let resolvedBinaryPath: string | null = null;
let resolvedFFmpegPath: string | null | undefined = undefined;
let resolvedDenoPath: string | null = null;

const YTDLP_CANDIDATES = ["yt-dlp", resolve(process.cwd(), "bin", "yt-dlp")];
const FFMPEG_CANDIDATES = ["ffmpeg", resolve(process.cwd(), "bin", "ffmpeg")];
const DENO_CANDIDATES = ["deno"];

const DEFAULT_PLAYER_CLIENTS = "web,mweb,android,android_vr,tv,tv_embedded";
const FALLBACK_PLAYER_CLIENTS = "android,android_vr";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
];

export const getPlayerClients = (fallback = false): string =>
  fallback ? FALLBACK_PLAYER_CLIENTS : DEFAULT_PLAYER_CLIENTS;

const randomUserAgent = (): string =>
  USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]!;

const checkExecutable = async (candidate: string): Promise<boolean> => {
  try {
    await execFileAsync(candidate, ["--version"]);
    return true;
  } catch {
    try {
      await execFileAsync(candidate, ["-version"]);
      return true;
    } catch {
      return false;
    }
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

export const resolveDenoPath = async (): Promise<string | null> => {
  if (resolvedDenoPath !== null) return resolvedDenoPath;

  for (const candidate of DENO_CANDIDATES) {
    if (await checkExecutable(candidate)) {
      resolvedDenoPath = candidate;
      return candidate;
    }
  }

  resolvedDenoPath = "";
  return null;
};

const withFFmpeg = (ffmpegPath: string | null): ReadonlyArray<string> =>
  ffmpegPath ? ["--ffmpeg-location", ffmpegPath] : [];

const withCookies = (): ReadonlyArray<string> => {
  const cookiesPath = process.env.COOKIES_FILE;
  return cookiesPath ? ["--cookies", cookiesPath] : [];
};

interface BuildArgsOptions {
  ffmpegPath?: string | null;
  clients?: string;
}

export const buildInfoArgs = (
  url: string,
  options: BuildArgsOptions = {},
): ReadonlyArray<string> => {
  const { ffmpegPath = null, clients = DEFAULT_PLAYER_CLIENTS } = options;

  return [
    "--dump-json",
    "--no-warnings",
    "--no-playlist",
    "--flat-playlist",
    "--extractor-args",
    `youtube:player_client=${clients};skip=webpage,configs,js`,
    "--user-agent",
    randomUserAgent(),
    ...withFFmpeg(ffmpegPath),
    ...withCookies(),
    url,
  ];
};

export const buildDownloadArgs = (
  url: string,
  formatId: string,
  outputPath: string,
  options: BuildArgsOptions = {},
): ReadonlyArray<string> => {
  const { ffmpegPath = null, clients = DEFAULT_PLAYER_CLIENTS } = options;
  const isMuxed = formatId.includes("+");

  return [
    "-f",
    formatId,
    "--no-warnings",
    "--no-playlist",
    "--no-part",
    "--extractor-args",
    `youtube:player_client=${clients};skip=webpage,configs,js`,
    ...(isMuxed ? ["--merge-output-format", "mp4"] : []),
    "--user-agent",
    randomUserAgent(),
    "-o",
    outputPath,
    ...withFFmpeg(ffmpegPath),
    ...withCookies(),
    url,
  ];
};

export const buildStreamArgs = (
  url: string,
  formatId: string,
  options: BuildArgsOptions = {},
): ReadonlyArray<string> => {
  const { ffmpegPath = null, clients = DEFAULT_PLAYER_CLIENTS } = options;

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
    "--extractor-args",
    `youtube:player_client=${clients};skip=webpage,configs,js`,
    "--user-agent",
    randomUserAgent(),
    "-o",
    "-",
    ...withFFmpeg(ffmpegPath),
    ...withCookies(),
    url,
  ];
};
