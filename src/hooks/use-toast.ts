
import { toast as sonnerToast } from "sonner";

// Simple re-export of the toast function from sonner
export const toast = sonnerToast;

// A simplified useToast hook that returns the toast function
export function useToast() {
  return {
    toast
  };
}
