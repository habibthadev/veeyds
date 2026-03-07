import { motion } from "framer-motion";
import type { MediaInfo } from "../../types/media";
import { Badge } from "../ui/Badge";
import { formatDuration } from "../../utils/format";

interface MediaPreviewProps {
  info: MediaInfo;
}

export const MediaPreview = ({ info }: MediaPreviewProps) => (
  <motion.div
    className="flex gap-4 items-start"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    {info.thumbnail && (
      <img
        src={info.thumbnail}
        alt={info.title}
        className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
        style={{ border: "1px solid var(--color-border)" }}
      />
    )}
    <div className="flex-1 min-w-0">
      <h3
        className="text-base font-semibold truncate mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {info.title}
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="accent">{info.platform}</Badge>
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
