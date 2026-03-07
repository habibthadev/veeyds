import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { UrlInput } from "../components/download/UrlInput";
import { DownloadQueue } from "../components/download/DownloadQueue";
import { useDownload } from "../hooks/useDownload";

export const DownloadPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { queue, addUrl, selectFormat, downloadItem, removeItem, clearQueue } =
    useDownload();
  const initialUrlProcessed = useRef(false);

  useEffect(() => {
    if (initialUrlProcessed.current) return;
    const urlParam = searchParams.get("url");
    if (urlParam) {
      initialUrlProcessed.current = true;
      addUrl(urlParam);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, addUrl, setSearchParams]);

  return (
    <motion.div
      className="pt-28 pb-16 px-6"
      style={{ minHeight: "calc(100vh - 80px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto space-y-8" style={{ maxWidth: "var(--content-width)" }}>
        <div className="text-center">
          <h2 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Download
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Paste any supported URL to extract and download media.
          </p>
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <UrlInput onSubmit={addUrl} />
        </div>

        <DownloadQueue
          queue={queue}
          onSelectFormat={selectFormat}
          onDownload={downloadItem}
          onRemove={removeItem}
          onClearAll={clearQueue}
        />

        {queue.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-bg-secondary)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-tertiary)" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Your download queue is empty. Paste a URL above to get started.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
