import { useState, useCallback } from "react";
import type { QueueItem, MediaInfo } from "../types/media";
import { fetchMediaInfo, downloadMedia } from "../services/api";

const STORAGE_KEY = "veeyds-queue";

const loadQueue = (): QueueItem[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as QueueItem[]) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue: QueueItem[]): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {}
};

let nextId = 0;
const generateId = (): string => {
  nextId += 1;
  return `q-${nextId}-${Date.now()}`;
};

export const useDownload = () => {
  const [queue, setQueue] = useState<QueueItem[]>(loadQueue);

  const persist = useCallback((fn: (prev: QueueItem[]) => QueueItem[]) => {
    setQueue((prev) => {
      const next = fn(prev);
      saveQueue(next);
      return next;
    });
  }, []);

  const updateItem = useCallback(
    (id: string, updates: Partial<QueueItem>) => {
      persist((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      );
    },
    [persist],
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

      persist((prev) => [...prev, newItem]);

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

  const downloadItem = useCallback(
    async (item: QueueItem) => {
      if (!item.selectedFormatId) return;

      updateItem(item.id, { status: "downloading", error: null });

      try {
        await downloadMedia(item.url, item.selectedFormatId);
        updateItem(item.id, { status: "ready" });
      } catch (err) {
        const message =
          (err as { error?: { message?: string } })?.error?.message ??
          "Download failed";
        updateItem(item.id, { status: "error", error: message });
      }
    },
    [updateItem],
  );

  const removeItem = useCallback((id: string) => {
    persist((prev) => prev.filter((item) => item.id !== id));
  }, [persist]);

  const clearQueue = useCallback(() => {
    saveQueue([]);
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
