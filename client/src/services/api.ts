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

export const getDownloadUrl = (
  url: string,
  formatId: string,
  title: string,
  ext: string,
  hasAudio: boolean,
  hasVideo: boolean,
): string => {
  const params = new URLSearchParams({
    url,
    formatId,
    title,
    ext,
    hasAudio: String(hasAudio),
    hasVideo: String(hasVideo),
  });
  return `${API_BASE}/media/download?${params.toString()}`;
};
