const ALLOWED_PROTOCOLS = ["http:", "https:"];

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"];

export const sanitizeUrl = (raw: string): string => {
  const trimmed = raw.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Invalid URL format");
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  if (BLOCKED_HOSTS.includes(parsed.hostname)) {
    throw new Error("URL points to a blocked host");
  }

  return parsed.href;
};
