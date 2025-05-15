
import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-3 w-3 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-8 w-8 border-2",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-muted border-t-primary",
          sizeClasses[size]
        )}
      />
    </div>
  );
};
