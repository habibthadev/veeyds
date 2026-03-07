import * as Select from "@radix-ui/react-select";
import { cn } from "../../utils/cn";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

export const Dropdown = ({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
}: DropdownProps) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger
      className={cn(
        "inline-flex items-center justify-between px-4 py-2.5 rounded-lg text-sm",
        "w-full transition-colors cursor-pointer",
        className,
      )}
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text)",
        outlineColor: "var(--color-accent)",
      }}
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        className="z-50 rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
        position="popper"
        sideOffset={4}
      >
        <Select.Viewport className="p-1.5">
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
              className={cn(
                "px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors",
                "outline-none data-[highlighted]:opacity-80",
              )}
              style={{
                color: "var(--color-text)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
              }}
            >
              <Select.ItemText>{option.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);
