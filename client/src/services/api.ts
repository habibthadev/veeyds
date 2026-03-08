import type { MediaInfo } from "../types/media";
import type { ApiError } from "../types/api";
import { MediaInfoSchema } from "../utils/validators";

const API_BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

const handleResponse = async <T>(
  response: Response,
  schema?: { parse: (data: unknown) => T },
): Promise<T> => {
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      error: { code: "INTERNAL", message: "An unexpected error occurred" },
    }));
    throw errorData;
  }
  const data: unknown = await response.json();
  if (schema) return schema.parse(data);
  return data as T;
};

export const fetchMediaInfo = async (url: string): Promise<MediaInfo> => {
  const response = await fetch(`${API_BASE}/media/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return handleResponse(response, MediaInfoSchema);
};

export const downloadMedia = async (url: string, formatId: string): Promise<void> => {
  const params = new URLSearchParams({ url, formatId });
  const response = await fetch(`${API_BASE}/media/download?${params.toString()}`);

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      error: { code: "INTERNAL", message: "Download failed" },
    }));
    throw errorData;
  }

  const disposition = response.headers.get("Content-Disposition");
  let filename = "download";
  if (disposition) {
    const utf8Match = disposition.match(/filename\*=UTF-8''(.+?)(?:;|$)/);
    const asciiMatch = disposition.match(/filename="(.+?)"/);
    if (utf8Match) {
      filename = decodeURIComponent(utf8Match[1]);
    } else if (asciiMatch) {
      filename = asciiMatch[1];
    }
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};
