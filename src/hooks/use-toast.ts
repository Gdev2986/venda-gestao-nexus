
import { toast as sonnerToast, type ToastT } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

// Overload for string message
export function toast(message: string): void;
// Overload for object message
export function toast(props: ToastProps): void;
// Implementation that handles both
export function toast(messageOrProps: string | ToastProps): void {
  if (typeof messageOrProps === 'string') {
    sonnerToast(messageOrProps);
  } else {
    // Extract props to match sonner's expected format
    const { title, description, ...rest } = messageOrProps;
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
