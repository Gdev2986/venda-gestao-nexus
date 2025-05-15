
import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3",
  };

  return (
    <div className="flex justify-center" aria-label="Carregando">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-solid border-t-transparent",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};
