
import { toast as sonnerToast } from "sonner";
import { ReactNode } from "react";

// Map of Variants to Sonner toast types
type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

type ToastProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: ToastVariant;
};

// Create an array to store toast state for legacy components
const toasts: { id: string; title: ReactNode; description: ReactNode; action: ReactNode }[] = [];

// Simple wrapper around Sonner toast
const toast = ({ title, description, variant = "default", action }: ToastProps) => {
  const options = {
    action,
  };

  switch (variant) {
    case "destructive":
      return sonnerToast.error(title as string, { description });
    case "success":
      return sonnerToast.success(title as string, { description });
    case "warning": 
      return sonnerToast.warning(title as string, { description });
    case "info":
      return sonnerToast.info(title as string, { description });
    default:
      return sonnerToast(title as string, { description });
  }
};

// Hook for components
export const useToast = () => {
  return {
    toast,
    toasts, // Include toasts array for legacy components
  };
};

export { toast };

// Types
export type { ToastProps };
