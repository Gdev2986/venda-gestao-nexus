
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

// Implementation for both string and object API
export function toast(message: string | ToastProps): void {
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
}

export function useToast() {
  return { toast };
}
