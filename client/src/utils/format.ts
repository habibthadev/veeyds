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
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const detectPlatform = (url: string): string | null => {
  const patterns: Record<string, RegExp> = {
    YouTube: /(?:youtube\.com|youtu\.be)/i,
    Instagram: /instagram\.com/i,
    Facebook: /(?:facebook\.com|fb\.watch)/i,
    TikTok: /tiktok\.com/i,
    Twitter: /(?:twitter\.com|x\.com)/i,
    Snapchat: /snapchat\.com/i,
    Reddit: /reddit\.com/i,
    Vimeo: /vimeo\.com/i,
    Twitch: /twitch\.tv/i,
    Pinterest: /pinterest\.com/i,
    Dailymotion: /dailymotion\.com/i,
    SoundCloud: /soundcloud\.com/i,
    LinkedIn: /linkedin\.com/i,
    Tumblr: /tumblr\.com/i,
  };
  for (const [name, pattern] of Object.entries(patterns)) {
    if (pattern.test(url)) return name;
  }
  return null;
};
