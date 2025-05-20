
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

// Simple function without React hooks - fixes the useState issue
export const toast = (props: string | ToastProps): void => {
  if (typeof props === 'string') {
    sonnerToast(props);
  } else {
    const { title, description, ...rest } = props;
    if (title && description) {
      sonnerToast(title, { description, ...rest });
    } else if (title) {
      sonnerToast(title, rest);
    } else if (description) {
      sonnerToast(description, rest);
    } else {
      sonnerToast("Notification");
    }
  }
};

// Simple object that returns the toast function
export const useToast = () => {
  return { toast };
};
