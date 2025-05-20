
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

export function toast(message: string, options?: ToastProps) {
  return sonnerToast(message, options);
}

export function useToast() {
  return {
    toast
  };
}
