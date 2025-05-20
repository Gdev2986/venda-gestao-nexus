
import * as React from "react";
import { toast as sonnerToast, type Toast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

// Simple function that doesn't use React hooks
export const toast = (props: string | ToastProps): void => {
  if (typeof props === 'string') {
    sonnerToast(props);
  } else {
    const { title, description, variant, ...rest } = props;
    
    // Apply variant-specific styling
    const styling = variant === "destructive" ? { style: { backgroundColor: "var(--destructive)", color: "var(--destructive-foreground)" } } : {};
    
    if (title && description) {
      sonnerToast(title, { description, ...styling, ...rest });
    } else if (title) {
      sonnerToast(title, { ...styling, ...rest });
    } else if (description) {
      sonnerToast(description, { ...styling, ...rest });
    } else {
      sonnerToast("Notification", { ...styling, ...rest });
    }
  }
};

// Export a simple object with the toast function
export const useToast = () => {
  return { toast };
};

export type { Toast as ToastType };
