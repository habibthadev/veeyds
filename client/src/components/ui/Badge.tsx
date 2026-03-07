import { cn } from "../../utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}

export const Badge = ({
  children,
  variant = "default",
  className,
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full",
      className,
    )}
    style={{
      backgroundColor:
        variant === "accent"
          ? "var(--color-accent)"
          : "var(--color-bg-secondary)",
      color:
        variant === "accent" ? "white" : "var(--color-text-secondary)",
    }}
  >
    {children}
  </span>
);
