
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

// Simple direct implementation without React hooks
export const toast = (message: string | ToastProps): void => {
  if (typeof message === 'string') {
    sonnerToast(message);
  } else {
    // Extract props to match sonner's expected format
    const { title, description, ...rest } = message;
    if (title) {
      sonnerToast(title, { description, ...rest });
    } else if (description) {
      sonnerToast(description);
    } else {
      sonnerToast("Notification");
    }
  }
};

// A simplified hook that just returns the toast function
export function useToast() {
  return { toast };
}
