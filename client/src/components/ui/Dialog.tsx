import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
}: DialogProps) => (
  <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
    <AnimatePresence>
      {open && (
        <AlertDialog.Portal forceMount>
          <AlertDialog.Overlay asChild>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </AlertDialog.Overlay>
          <AlertDialog.Content asChild>
            <motion.div
              className={cn(
                "fixed left-1/2 top-1/2 z-50 w-full max-w-md p-6 rounded-2xl",
                "focus:outline-none",
              )}
              style={{
                backgroundColor: "var(--color-surface)",
                boxShadow: "var(--shadow-lg)",
              }}
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <AlertDialog.Title
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description
                className="text-sm mb-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {description}
              </AlertDialog.Description>
              <div className="flex gap-3 justify-end">
                <AlertDialog.Cancel asChild>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: "var(--color-bg-secondary)",
                      color: "var(--color-text)",
                    }}
                  >
                    {cancelLabel}
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                    style={{
                      backgroundColor:
                        variant === "destructive"
                          ? "var(--color-error)"
                          : "var(--color-accent)",
                    }}
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </button>
                </AlertDialog.Action>
              </div>
            </motion.div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      )}
    </AnimatePresence>
  </AlertDialog.Root>
);
