
import { toast as sonnerToast, useToast as useSonnerToast } from "sonner";
import { type ToastProps } from "sonner";

// Create a custom useToast hook that provides the toast function with our default options
export function useToast() {
  return useSonnerToast();
}

// Export a pre-configured toast function
export const toast = (props: ToastProps) => {
  return sonnerToast(props);
};
