
import { ReactNode } from "react";

declare module "sonner" {
  export interface ToastOptions {
    title?: string;
    description?: string;
    action?: ReactNode;
    variant?: "default" | "destructive";
    duration?: number;
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  }
  
  type Toast = (
    message: string,
    options?: ToastOptions
  ) => void;

  export const toast: Toast;

  export function Toaster(props: {
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
    duration?: number;
    closeButton?: boolean;
  }): JSX.Element;
}
