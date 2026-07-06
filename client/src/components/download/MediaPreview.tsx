import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import type { MediaInfo } from "../../types/media";
import { Badge } from "../ui/Badge";
import { formatDuration } from "../../utils/format";
import { getPlatformInfo } from "../../constants/platforms";

interface MediaPreviewProps {
  info: MediaInfo;
}

export const MediaPreview = ({ info }: MediaPreviewProps) => (
  <motion.div
    className="flex flex-col gap-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    {info.thumbnail && (
      <div className="w-full rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        <img
          src={info.thumbnail}
          alt={info.title}
          className="w-full object-cover"
          style={{ aspectRatio: "16 / 9" }}
        />
      </div>
    )}
    <div className="min-w-0">
      <h3
        className="text-base font-semibold mb-1.5 leading-snug"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {info.title.length > 80 ? `${info.title.slice(0, 80)}...` : info.title}
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="accent" className="flex items-center gap-1">
          {(() => {
            const pi = getPlatformInfo(info.platform);
            return pi ? <Icon icon={pi.icon} className="w-4 h-4" {...(pi.color ? { color: pi.color } : {})} /> : null;
          })()}
          {info.platform}
        </Badge>
        {info.duration && (
          <span
            className="text-xs"
            style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}
          >
            {formatDuration(info.duration)}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);
