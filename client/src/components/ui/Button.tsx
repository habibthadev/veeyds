import { type ReactNode, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  style?: CSSProperties;
}

const variantStyles: Record<string, string> = {
  primary: "text-white font-medium",
  secondary: "font-medium",
  ghost: "font-medium",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-base rounded-lg",
  lg: "px-7 py-3.5 text-lg rounded-xl",
};

const getVariantColors = (variant: string): CSSProperties => {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: "var(--color-accent)",
        color: "white",
        boxShadow: "0 2px 8px rgba(232, 114, 74, 0.3)",
      };
    case "secondary":
      return {
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        border: "1px solid var(--color-border)",
      };
    case "ghost":
    default:
      return {
        backgroundColor: "transparent",
        color: "var(--color-text)",
      };
  }
};

export const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  type,
  onClick,
  style,
}: ButtonProps) => (
  <motion.button
    whileHover={disabled ? undefined : { scale: 1.02, opacity: 0.9 }}
    whileTap={disabled ? undefined : { scale: 0.98 }}
    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
    className={cn(
      "inline-flex items-center justify-center transition-all cursor-pointer",
      "focus-visible:outline-2 focus-visible:outline-offset-2",
      variantStyles[variant],
      sizeStyles[size],
      disabled && "opacity-50 cursor-not-allowed",
      className,
    )}
    style={{
      ...getVariantColors(variant),
      outlineColor: "var(--color-accent)",
      ...style,
    }}
    disabled={disabled}
    type={type}
    onClick={onClick}
  >
    {children}
  </motion.button>
);
