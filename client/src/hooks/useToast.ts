import { useContext, createContext } from "react";

interface ToastContextValue {
  showToast: (message: string, variant?: "default" | "error" | "success") => void;
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);
