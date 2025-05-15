
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  id?: string;
};

// For compatibility with both toast systems
export function toast({ title, description, action, variant = "default" }: ToastProps) {
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
      action,
    });
  } else if (variant === "success") {
    return sonnerToast.success(title, {
      description,
      action,
    });
  } else {
    return sonnerToast(title, {
      description,
      action,
    });
  }
}

// Simplified hook for use with Sonner
export const useToast = () => {
  return {
    toast,
    toasts: [], // Always provide an empty array to prevent mapping errors
    dismiss: (id: string) => sonnerToast.dismiss(id),
  };
};
