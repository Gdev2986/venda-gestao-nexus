
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

// Implementation that doesn't require useState
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

// A simplified hook that doesn't use useState
export function useToast() {
  return { toast };
}
