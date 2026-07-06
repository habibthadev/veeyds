export const sanitizeYtdlpError = (stderr: string): { code: string; message: string } => {
  if (/HTTP Error 403|HTTP Error 401|HTTP Error 400/i.test(stderr)) {
    return { code: "FORBIDDEN", message: "Access denied. The platform is blocking this request." };
  }
  if (/po_token|poToken|Proof of Origin|n-challenge/i.test(stderr)) {
    return { code: "BOT_DETECTED", message: "Bot detection triggered. Retrying with alternate client." };
  }
  if (/sign in|not a bot|cookies|authentication required/i.test(stderr)) {
    return { code: "FORBIDDEN", message: "This content requires authentication or is region-locked." };
  }
  if (/age.?restrict|age.?gate/i.test(stderr)) {
    return { code: "AGE_RESTRICTED", message: "This content is age-restricted." };
  }
  if (/private video|this video is private/i.test(stderr)) {
    return { code: "EXTRACTION_FAILED", message: "This content is private." };
  }
  if (/unavailable|been removed|account.*terminated|deleted by/i.test(stderr)) {
    return { code: "EXTRACTION_FAILED", message: "This content is unavailable." };
  }
  if (/too many requests|rate.?limit/i.test(stderr)) {
    return { code: "RATE_LIMITED", message: "Rate-limited. Try again later." };
  }
  if (/unsupported url|is not a valid url|no suitable extractor/i.test(stderr)) {
    return { code: "UNSUPPORTED_URL", message: "This URL is not supported." };
  }
  if (/geo.?restrict|not available in your country|geo.?blocked/i.test(stderr)) {
    return { code: "GEO_RESTRICTED", message: "This content is not available in your region." };
  }
  if (/SABR|adaptive.?bitrate|live.?stream/i.test(stderr)) {
    return { code: "EXTRACTION_FAILED", message: "This stream uses adaptive bitrate. Retrying with alternate client." };
  }
  if (/Premieres?|premiere|scheduled/i.test(stderr)) {
    return { code: "EXTRACTION_FAILED", message: "This content is a premiere and not yet available." };
  }
  return { code: "EXTRACTION_FAILED", message: "Failed to process media." };
};
