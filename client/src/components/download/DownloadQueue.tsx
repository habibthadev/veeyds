import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { QueueItem } from "../../types/media";
import { QueueItemCard } from "./QueueItem";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";

interface DownloadQueueProps {
  queue: QueueItem[];
  onSelectFormat: (id: string, formatId: string) => void;
  onDownload: (item: QueueItem) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export const DownloadQueue = ({
  queue,
  onSelectFormat,
  onDownload,
  onRemove,
  onClearAll,
}: DownloadQueueProps) => {
  const [showClearDialog, setShowClearDialog] = useState(false);

  if (queue.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Queue ({queue.length})
        </h2>
        {queue.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowClearDialog(true)}
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {queue.map((item) => (
            <QueueItemCard
              key={item.id}
              item={item}
              onSelectFormat={(formatId) => onSelectFormat(item.id, formatId)}
              onDownload={() => onDownload(item)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <Dialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear queue"
        description="This will remove all items from your download queue. This action cannot be undone."
        confirmLabel="Clear all"
        cancelLabel="Keep"
        variant="destructive"
        onConfirm={() => {
          onClearAll();
          setShowClearDialog(false);
        }}
      />
    </div>
  );
};
