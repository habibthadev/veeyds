import { motion } from "framer-motion";
import type { QueueItem as QueueItemType } from "../../types/media";
import { MediaPreview } from "./MediaPreview";
import { FormatSelector } from "./FormatSelector";
import { Skeleton } from "../ui/Skeleton";
import { Button } from "../ui/Button";

interface QueueItemProps {
  item: QueueItemType;
  onSelectFormat: (formatId: string) => void;
  onDownload: () => void;
  onRemove: () => void;
}

export const QueueItemCard = ({
  item,
  onSelectFormat,
  onDownload,
  onRemove,
}: QueueItemProps) => (
  <motion.div
    layout
    className="p-5 rounded-2xl"
    style={{
      backgroundColor: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-sm)",
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="flex items-start justify-between mb-6">
      <p
        className="text-xs truncate max-w-[70%]"
        style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}
      >
        {item.url}
      </p>
      <button
        onClick={onRemove}
        className="ml-3 text-xs transition-opacity hover:opacity-70 cursor-pointer flex-shrink-0"
        style={{ color: "var(--color-text-tertiary)" }}
        aria-label="Remove from queue"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    {item.status === "loading" && (
      <div className="space-y-3">
        <div className="flex gap-4">
          <Skeleton className="w-32 h-20" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    )}

    {item.status === "ready" && item.info && (
      <div className="space-y-5">
        <MediaPreview info={item.info} />
        <div className="space-y-3">
          <FormatSelector
            formats={item.info.formats}
            selectedFormatId={item.selectedFormatId}
            onSelect={onSelectFormat}
          />
          <Button
            onClick={onDownload}
            disabled={!item.selectedFormatId}
            className="w-full"
            size="md"
          >
            Download
          </Button>
        </div>
      </div>
    )}

    {item.status === "downloading" && item.info && (
      <div className="space-y-4">
        <MediaPreview info={item.info} />
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--color-border)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
                initial={{ width: "5%" }}
                animate={{ width: "85%" }}
                transition={{ duration: 30, ease: "linear" }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
              Downloading...
            </p>
          </div>
        </div>
      </div>
    )}

    {item.status === "error" && (
      <div
        className="p-3 rounded-lg text-sm"
        style={{
          backgroundColor: "rgba(220, 38, 38, 0.08)",
          color: "var(--color-error)",
        }}
      >
        {item.error}
      </div>
    )}
  </motion.div>
);
