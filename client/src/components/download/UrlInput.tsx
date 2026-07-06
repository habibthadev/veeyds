import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { detectPlatform } from "../../utils/format";
import { getPlatformInfo } from "../../constants/platforms";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  disabled?: boolean;
}

export const UrlInput = ({ onSubmit, disabled }: UrlInputProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const platform = detectPlatform(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL");
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    onSubmit(trimmed);
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
        <div className="flex-1 relative">
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="Paste a video or audio URL..."
            type="url"
            error={error}
            disabled={disabled}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              paddingRight: platform ? "6rem" : undefined,
            }}
          />
          <AnimatePresence>
            {platform && !error && (
              <motion.div
                className="absolute right-3 top-3 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <Badge variant="accent" className="flex items-center gap-1">
                  {(() => {
                    const pi = getPlatformInfo(platform ?? "");
                    return pi ? <Icon icon={pi.icon} className="w-4 h-4" {...(pi.color ? { color: pi.color } : {})} /> : null;
                  })()}
                  {platform}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button type="submit" size="md" disabled={disabled || !url.trim()}>
          Fetch
        </Button>
      </div>
    </form>
  );
};
