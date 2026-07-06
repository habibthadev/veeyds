export interface PlatformInfo {
  key: string;
  displayName: string;
  icon: string;
  pattern: RegExp;
  color?: string;
}

export const PLATFORMS: PlatformInfo[] = [
  { key: "YouTube", displayName: "YouTube", icon: "logos:youtube-icon", pattern: /(?:youtube\.com|youtu\.be)/i },
  { key: "Instagram", displayName: "Instagram", icon: "logos:instagram-icon", pattern: /instagram\.com/i },
  { key: "Facebook", displayName: "Facebook", icon: "logos:facebook", pattern: /(?:facebook\.com|fb\.watch)/i },
  { key: "TikTok", displayName: "TikTok", icon: "logos:tiktok-icon", pattern: /tiktok\.com/i },
  { key: "Twitter", displayName: "X / Twitter", icon: "logos:twitter", pattern: /(?:twitter\.com|x\.com)/i },
  { key: "Snapchat", displayName: "Snapchat", icon: "selfhst:snapchat", pattern: /snapchat\.com/i },
  { key: "Reddit", displayName: "Reddit", icon: "logos:reddit-icon", pattern: /reddit\.com/i },
  { key: "Vimeo", displayName: "Vimeo", icon: "logos:vimeo", pattern: /vimeo\.com/i },
  { key: "Twitch", displayName: "Twitch", icon: "logos:twitch", pattern: /twitch\.tv/i },
  { key: "Pinterest", displayName: "Pinterest", icon: "logos:pinterest", pattern: /pinterest\.com/i },
  { key: "Dailymotion", displayName: "Dailymotion", icon: "simple-icons:dailymotion", pattern: /dailymotion\.com/i, color: "#0066DC" },
  { key: "SoundCloud", displayName: "SoundCloud", icon: "logos:soundcloud", pattern: /soundcloud\.com/i },
  { key: "LinkedIn", displayName: "LinkedIn", icon: "logos:linkedin-icon", pattern: /linkedin\.com/i },
  { key: "Tumblr", displayName: "Tumblr", icon: "logos:tumblr", pattern: /tumblr\.com/i },
];

export const getPlatformInfo = (key: string): PlatformInfo | undefined =>
  PLATFORMS.find((p) => p.key.toLowerCase() === key.toLowerCase());
