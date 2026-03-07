import { formatFileSize, formatDuration, buildFormatLabel } from "../../src/utils/format.js";

describe("formatFileSize", () => {
  it("returns Unknown for null", () => {
    expect(formatFileSize(null)).toBe("Unknown");
  });

  it("returns Unknown for zero", () => {
    expect(formatFileSize(0)).toBe("Unknown");
  });

  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500.0 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(10485760)).toBe("10.0 MB");
  });

  it("formats gigabytes", () => {
    expect(formatFileSize(1073741824)).toBe("1.0 GB");
  });
});

describe("formatDuration", () => {
  it("returns Unknown for null", () => {
    expect(formatDuration(null)).toBe("Unknown");
  });

  it("formats seconds only", () => {
    expect(formatDuration(45)).toBe("0:45");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(125)).toBe("2:05");
  });

  it("formats hours", () => {
    expect(formatDuration(3661)).toBe("1:01:01");
  });
});

describe("buildFormatLabel", () => {
  it("builds label for video+audio format", () => {
    const label = buildFormatLabel({
      ext: "mp4",
      resolution: "1920x1080",
      hasAudio: true,
      hasVideo: true,
      filesize: 10485760,
    });
    expect(label).toBe("1920x1080 - video+audio - MP4 - 10.0 MB");
  });

  it("builds label for audio only", () => {
    const label = buildFormatLabel({
      ext: "m4a",
      resolution: null,
      hasAudio: true,
      hasVideo: false,
      filesize: null,
    });
    expect(label).toBe("audio only - M4A");
  });

  it("builds label for video only", () => {
    const label = buildFormatLabel({
      ext: "webm",
      resolution: "1280x720",
      hasAudio: false,
      hasVideo: true,
      filesize: 5242880,
    });
    expect(label).toBe("1280x720 - video only - WEBM - 5.0 MB");
  });
});
