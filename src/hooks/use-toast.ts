
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

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

export const useToast = () => {
  return {
    toast,
  };
};
