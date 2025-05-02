
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export function LoadingAnimation({ 
  size = "md", 
  color, 
  className 
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };
  
  // Animation variants for dots
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const dotVariants = {
    initial: { 
      scale: 0,
      opacity: 0.7,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  return (
    <motion.div 
      className={cn("flex items-center justify-center gap-2", className)}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full", 
            sizeClasses[size],
            color ? color : "bg-blue-900"
          )}
          variants={dotVariants}
          style={{ 
            transformOrigin: "center",
            transitionDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
