import { vi, beforeEach } from "vitest";
import { resetRateLimitStores } from "../../src/middleware/rateLimit.js";

vi.mock("@hono/node-server", () => ({
  serve: vi.fn(),
}));

vi.mock("../../src/utils/ytdlp.js", () => ({
  resolveBinaryPath: vi.fn().mockResolvedValue("/usr/bin/yt-dlp"),
  resolveFFmpegPath: vi.fn().mockResolvedValue("/usr/bin/ffmpeg"),
  buildInfoArgs: vi.fn((url: string) => ["--dump-json", url]),
  buildDownloadArgs: vi.fn((_u: string, _f: string, _o: string) => []),
  buildStreamArgs: vi.fn((_u: string, _f: string) => []),
}));

vi.mock("../../src/utils/process.js", () => ({
  spawnWithTimeout: vi.fn().mockResolvedValue({
    stdout: JSON.stringify({
      title: "Test Video",
      thumbnail: "https://example.com/thumb.jpg",
      duration: 120,
      extractor_key: "Youtube",
      webpage_url: "https://www.youtube.com/watch?v=test",
      formats: [
        {
          format_id: "22",
          ext: "mp4",
          width: 1280,
          height: 720,
          filesize: 10485760,
          acodec: "aac",
          vcodec: "h264",
        },
        {
          format_id: "140",
          ext: "m4a",
          filesize: 3145728,
          acodec: "aac",
          vcodec: "none",
        },
      ],
    }),
    stderr: "",
    exitCode: 0,
  }),
}));

import { app } from "../../src/index.js";

describe("POST /api/media/info", () => {
  beforeEach(() => {
    resetRateLimitStores();
  });

  it("returns media info for valid URL", async () => {
    const res = await app.request("/api/media/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.1",
      },
      body: JSON.stringify({ url: "https://www.youtube.com/watch?v=test" }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Test Video");
    expect(data.platform).toBe("Youtube");
    expect(data.formats.length).toBe(2);
  });

  it("rejects invalid URL format", async () => {
    const res = await app.request("/api/media/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.2",
      },
      body: JSON.stringify({ url: "not-a-valid-url" }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe("INVALID_INPUT");
  });

  it("rejects missing body", async () => {
    const res = await app.request("/api/media/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.3",
      },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });
});

describe("GET /health", () => {
  it("returns ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
  });
});

describe("404 handling", () => {
  it("returns structured error for unknown routes", async () => {
    const res = await app.request("/unknown-route");
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error.code).toBe("INTERNAL");
  });
});
