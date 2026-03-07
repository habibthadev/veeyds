import { type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({
  className,
  error,
  style,
  ...props
}: InputProps) => (
  <div className="w-full">
    <input
      className={cn(
        "w-full px-4 py-3 rounded-lg text-base transition-all duration-300",
        "placeholder:opacity-50",
        "focus-visible:outline-none",
        className,
      )}
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
        boxShadow: error
          ? "0 0 0 2px var(--color-error)"
          : "none",
        fontFamily: "var(--font-body)",
        ...style,
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-accent)";
          e.currentTarget.style.borderColor = "var(--color-accent)";
        }
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        if (!error) {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }
        props.onBlur?.(e);
      }}
      {...props}
    />
    {error && (
      <p
        className="mt-1.5 text-sm"
        style={{ color: "var(--color-error)" }}
      >
        {error}
      </p>
    )}
  </div>
);
