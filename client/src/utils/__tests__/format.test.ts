import { formatFileSize, formatDuration, detectPlatform } from "../format";

describe("formatFileSize", () => {
  it("returns Unknown for null", () => {
    expect(formatFileSize(null)).toBe("Unknown");
  });

  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500.0 B");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(10485760)).toBe("10.0 MB");
  });
});

describe("formatDuration", () => {
  it("returns Unknown for null", () => {
    expect(formatDuration(null)).toBe("Unknown");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(125)).toBe("2:05");
  });

  it("formats hours", () => {
    expect(formatDuration(3661)).toBe("1:01:01");
  });
});

describe("detectPlatform", () => {
  it("detects YouTube", () => {
    expect(detectPlatform("https://www.youtube.com/watch?v=test")).toBe("YouTube");
  });

  it("detects Instagram", () => {
    expect(detectPlatform("https://www.instagram.com/p/abc123")).toBe("Instagram");
  });

  it("detects TikTok", () => {
    expect(detectPlatform("https://www.tiktok.com/@user/video/123")).toBe("TikTok");
  });

  it("detects Twitter/X", () => {
    expect(detectPlatform("https://x.com/user/status/123")).toBe("Twitter");
  });

  it("returns null for unknown", () => {
    expect(detectPlatform("https://unknown.example.com/video")).toBeNull();
  });
});
