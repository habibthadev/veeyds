export const sanitizeYtdlpError = (stderr: string): { code: string; message: string } => {
  if (/sign in|not a bot|cookies|authentication required/i.test(stderr)) {
    return { code: "EXTRACTION_FAILED", message: "This content requires authentication and cannot be downloaded." };
  }
  if (/private video|this video is private/i.test(stderr)) {
    return { code: "EXTRACTION_FAILED", message: "This content is private." };
  }
  if (/age.?restrict|age.?gate/i.test(stderr)) {
    return { code: "EXTRACTION_FAILED", message: "This content is age-restricted." };
  }
  if (/unavailable|been removed|account.*terminated|deleted by/i.test(stderr)) {
    return { code: "EXTRACTION_FAILED", message: "This content is unavailable." };
  }
  if (/too many requests|rate.?limit/i.test(stderr)) {
    return { code: "RATE_LIMITED", message: "The platform is rate-limiting requests. Try again later." };
  }
  if (/unsupported url|is not a valid url|no suitable extractor/i.test(stderr)) {
    return { code: "UNSUPPORTED_URL", message: "This URL is not supported." };
  }
  return { code: "EXTRACTION_FAILED", message: "Failed to process media." };
};
