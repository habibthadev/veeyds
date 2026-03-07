export const formatFileSize = (bytes: number | null): string => {
  if (bytes === null || bytes <= 0) return "Unknown";
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const formatDuration = (seconds: number | null): string => {
  if (seconds === null || seconds <= 0) return "Unknown";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const buildFormatLabel = (format: {
  ext: string;
  resolution: string | null;
  hasAudio: boolean;
  hasVideo: boolean;
  filesize: number | null;
}): string => {
  const parts: string[] = [];
  if (format.hasVideo && format.resolution) {
    parts.push(format.resolution);
  }
  if (format.hasVideo && format.hasAudio) {
    parts.push("video+audio");
  } else if (format.hasVideo) {
    parts.push("video only");
  } else if (format.hasAudio) {
    parts.push("audio only");
  }
  parts.push(format.ext.toUpperCase());
  if (format.filesize) {
    parts.push(formatFileSize(format.filesize));
  }
  return parts.join(" - ");
};
