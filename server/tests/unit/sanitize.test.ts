import { sanitizeUrl } from "../../src/utils/sanitize.js";

describe("sanitizeUrl", () => {
  it("accepts valid HTTPS URLs", () => {
    const result = sanitizeUrl("https://www.youtube.com/watch?v=test");
    expect(result).toBe("https://www.youtube.com/watch?v=test");
  });

  it("accepts valid HTTP URLs", () => {
    const result = sanitizeUrl("http://example.com/video");
    expect(result).toBe("http://example.com/video");
  });

  it("rejects invalid URLs", () => {
    expect(() => sanitizeUrl("not-a-url")).toThrow("Invalid URL format");
  });

  it("rejects non-HTTP protocols", () => {
    expect(() => sanitizeUrl("ftp://files.example.com/video.mp4")).toThrow(
      "Only HTTP and HTTPS URLs are allowed",
    );
  });

  it("rejects localhost", () => {
    expect(() => sanitizeUrl("http://localhost:3000/secret")).toThrow(
      "URL points to a blocked host",
    );
  });

  it("rejects loopback IP", () => {
    expect(() => sanitizeUrl("http://127.0.0.1/admin")).toThrow(
      "URL points to a blocked host",
    );
  });

  it("trims whitespace", () => {
    const result = sanitizeUrl("  https://example.com/video  ");
    expect(result).toBe("https://example.com/video");
  });
});
