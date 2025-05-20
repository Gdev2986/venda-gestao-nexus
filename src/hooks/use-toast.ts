
import { toast as sonnerToast } from "sonner";

// Define options type for our toast functions
type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
  duration?: number;
};

// Export toast directly for standalone usage
export const toast = sonnerToast;

// Export useToast hook
export const useToast = () => {
  return { toast: sonnerToast };
};
