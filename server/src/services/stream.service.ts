import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { unlink, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { Readable } from "node:stream";
import { resolveBinaryPath, resolveFFmpegPath, buildStreamArgs, buildDownloadArgs, getPlayerClients } from "../utils/ytdlp";
import { sanitizeUrl } from "../utils/sanitize";
import { spawnWithTimeout } from "../utils/process";
import { sanitizeYtdlpError } from "../utils/errors";

const DOWNLOAD_TIMEOUT_MS = 300_000;

interface StreamResult {
  stream: ReadableStream<Uint8Array>;
  contentType: string;
  filename: string;
  contentLength: number | null;
}

const EXT_CONTENT_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mkv: "video/x-matroska",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  opus: "audio/opus",
  wav: "audio/wav",
  flac: "audio/flac",
  aac: "audio/aac",
};

const getContentType = (ext: string): string =>
  EXT_CONTENT_TYPES[ext.toLowerCase()] ?? "application/octet-stream";

const UNSAFE_FILENAME_CHARS = /[<>:"/\\|?*\x00-\x1f]/g;

const sanitizeFilename = (title: string, ext: string): string => {
  const cleaned = title
    .replace(/[^\x20-\x7E]/g, "")
    .replace(UNSAFE_FILENAME_CHARS, "_")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 200) || "download";
  return `${cleaned}.${ext}`;
};

const nodeReadableToWeb = (readable: Readable): ReadableStream<Uint8Array> => {
  return new ReadableStream({
    start(controller) {
      readable.on("data", (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      readable.on("end", () => {
        controller.close();
      });
      readable.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      readable.destroy();
    },
  });
};

export const streamDirectDownload = async (
  rawUrl: string,
  formatId: string,
  title: string,
  ext: string,
): Promise<StreamResult> => {
  const url = sanitizeUrl(rawUrl);
  const binaryPath = await resolveBinaryPath();
  const ffmpegPath = await resolveFFmpegPath();
  const clients = getPlayerClients(false);
  const args = buildStreamArgs(url, formatId, { ffmpegPath, clients });

  const child = spawn(binaryPath, [...args], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  });

  const timeout = setTimeout(() => {
    child.kill("SIGTERM");
  }, DOWNLOAD_TIMEOUT_MS);

  child.on("close", () => clearTimeout(timeout));
  child.on("error", () => clearTimeout(timeout));

  if (!child.stdout) {
    throw Object.assign(new Error("Failed to capture stdout"), {
      code: "EXTRACTION_FAILED",
    });
  }
  const stream = nodeReadableToWeb(child.stdout);
  const filename = sanitizeFilename(title, ext);

  return {
    stream,
    contentType: getContentType(ext),
    filename,
    contentLength: null,
  };
};

const downloadToFile = async (
  binaryPath: string,
  url: string,
  formatId: string,
  outputPath: string,
  ffmpegPath: string | null,
  clients: string,
): Promise<void> => {
  const args = buildDownloadArgs(url, formatId, outputPath, { ffmpegPath, clients });
  const result = await spawnWithTimeout(binaryPath, args, DOWNLOAD_TIMEOUT_MS);

  if (result.exitCode !== 0) {
    await unlink(outputPath).catch(() => {});
    const { code, message } = sanitizeYtdlpError(result.stderr.trim());
    throw Object.assign(new Error(message), { code });
  }

  const stats = await stat(outputPath).catch(() => null);
  if (!stats || stats.size === 0) {
    await unlink(outputPath).catch(() => {});
    throw Object.assign(new Error("Output file missing or empty"), { code: "EXTRACTION_FAILED" });
  }
};

const streamTempFile = (
  tempPath: string,
  title: string,
  ext: string,
  contentLength: number,
): StreamResult => {
  const readable = createReadStream(tempPath);
  const stream = nodeReadableToWeb(readable);

  readable.on("close", () => {
    unlink(tempPath).catch(() => {});
  });

  return {
    stream,
    contentType: getContentType(ext),
    filename: sanitizeFilename(title, ext),
    contentLength,
  };
};

export const streamMuxedDownload = async (
  rawUrl: string,
  formatId: string,
  title: string,
  ext: string,
): Promise<StreamResult> => {
  const url = sanitizeUrl(rawUrl);
  const binaryPath = await resolveBinaryPath();
  const ffmpegPath = await resolveFFmpegPath();
  const clients = getPlayerClients(false);
  const tempPath = join(tmpdir(), `veeyds-${randomUUID()}.${ext}`);

  try {
    await downloadToFile(binaryPath, url, formatId, tempPath, ffmpegPath, clients);
  } catch (err) {
    if (formatId.includes("+")) {
      const fallbackPath = join(tmpdir(), `veeyds-${randomUUID()}.${ext}`);
      try {
        await downloadToFile(binaryPath, url, "best[ext=mp4]/best", fallbackPath, ffmpegPath, clients);
        const fallbackStats = await stat(fallbackPath);
        if (fallbackStats.size > 0) {
          return streamTempFile(fallbackPath, title, ext, fallbackStats.size);
        }
      } catch {
        await unlink(fallbackPath).catch(() => {});
      }
    }
    throw err;
  }

  const fileStats = await stat(tempPath);
  return streamTempFile(tempPath, title, ext, fileStats.size);
};
