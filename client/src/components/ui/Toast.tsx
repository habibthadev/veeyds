import * as ToastPrimitive from "@radix-ui/react-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, type ReactNode } from "react";
import { ToastContext } from "../../hooks/useToast";

interface ToastData {
  id: string;
  message: string;
  variant: "default" | "error" | "success";
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastData["variant"] = "default") => {
      const id = `toast-${Date.now()}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  const variantColors: Record<string, string> = {
    default: "var(--color-surface)",
    error: "var(--color-error)",
    success: "var(--color-success)",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={4000}>
        {children}
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastPrimitive.Root key={toast.id} asChild forceMount>
              <motion.li
                className="px-4 py-3 rounded-xl text-sm font-medium list-none"
                style={{
                  backgroundColor: variantColors[toast.variant],
                  color:
                    toast.variant === "default"
                      ? "var(--color-text)"
                      : "white",
                  boxShadow: "var(--shadow-md)",
                }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <ToastPrimitive.Description>
                  {toast.message}
                </ToastPrimitive.Description>
              </motion.li>
            </ToastPrimitive.Root>
          ))}
        </AnimatePresence>
        <ToastPrimitive.Viewport className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};
