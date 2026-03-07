import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn("animate-pulse rounded-lg", className)}
    style={{ backgroundColor: "var(--color-bg-secondary)" }}
  />
);
