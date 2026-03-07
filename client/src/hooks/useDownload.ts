import { useState, useCallback } from "react";
import type { QueueItem, MediaInfo } from "../types/media";
import { fetchMediaInfo, getDownloadUrl } from "../services/api";

let nextId = 0;
const generateId = (): string => {
  nextId += 1;
  return `q-${nextId}-${Date.now()}`;
};

export const useDownload = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const updateItem = useCallback(
    (id: string, updates: Partial<QueueItem>) => {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      );
    },
    [],
  );

  const addUrl = useCallback(
    async (url: string) => {
      const id = generateId();
      const newItem: QueueItem = {
        id,
        url,
        status: "loading",
        info: null,
        selectedFormatId: null,
        error: null,
      };

      setQueue((prev) => [...prev, newItem]);

      try {
        const info: MediaInfo = await fetchMediaInfo(url);
        const defaultFormat =
          info.formats.find((f) => f.hasVideo && f.hasAudio) ??
          info.formats[0] ??
          null;

        updateItem(id, {
          status: "ready",
          info,
          selectedFormatId: defaultFormat?.id ?? null,
        });
      } catch (err) {
        const message =
          (err as { error?: { message?: string } })?.error?.message ??
          "Failed to fetch media info";
        updateItem(id, { status: "error", error: message });
      }
    },
    [updateItem],
  );

  const selectFormat = useCallback(
    (id: string, formatId: string) => {
      updateItem(id, { selectedFormatId: formatId });
    },
    [updateItem],
  );

  const downloadItem = useCallback((item: QueueItem) => {
    if (!item.selectedFormatId) return;
    const downloadUrl = getDownloadUrl(item.url, item.selectedFormatId);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const removeItem = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    addUrl,
    selectFormat,
    downloadItem,
    removeItem,
    clearQueue,
  } as const;
};
