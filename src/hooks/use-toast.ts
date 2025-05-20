import * as React from "react";
import { toast as sonnerToast, type ToastT } from "sonner";

// Define options type for our toast functions
type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
  duration?: number;
};

// Modified toast function that accepts our custom options
const toast = ({ title, description, variant, action, ...props }: ToastOptions) => {
  return sonnerToast(title, {
    description,
    // Custom className based on variant
    className: variant === "destructive" ? "destructive" : undefined,
    action,
    ...props,
  });
};

// Simple string shortcut
toast.success = (message: string, options?: Omit<ToastOptions, "title">) => {
  return toast({ title: message, ...options });
};

toast.error = (message: string, options?: Omit<ToastOptions, "title" | "variant">) => {
  return toast({ title: message, variant: "destructive", ...options });
};

// Keep compatibility with direct sonner usage
toast.promise = sonnerToast.promise;
toast.dismiss = sonnerToast.dismiss;
toast.custom = sonnerToast.custom;

export { toast };

export const useToast = () => {
  return {
    toast,
  };
};
