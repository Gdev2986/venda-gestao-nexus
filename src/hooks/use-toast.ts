
import { toast as sonnerToast } from "sonner";

// Define a ToastOptions type that matches the sonner toast API
type ToastOptions = {
  description?: string;
  action?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

/**
 * Toast function for standalone usage
 * @param message The main toast message
 * @param options Additional toast options
 */
export function toast(message: string, options?: ToastOptions) {
  return sonnerToast(message, options);
}

/**
 * Hook that provides the toast function
 * This follows the standard hook pattern but simply returns the toast function
 */
export function useToast() {
  return {
    toast: (message: string, options?: ToastOptions) => {
      return sonnerToast(message, options);
    }
  };
}
