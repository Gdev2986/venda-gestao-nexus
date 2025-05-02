
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

export function Spinner({ size = "md", className, color }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };
  
  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 0.8
  };

  return (
    <div className="flex justify-center" aria-label="Carregando">
      <motion.div
        animate={{ rotate: 360 }}
        transition={spinTransition}
        className={cn(
          "rounded-full border-4 border-solid border-t-transparent",
          color ? color : "border-blue-900",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}
