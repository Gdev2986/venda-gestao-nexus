
import { ReactNode } from "react";

declare module "sonner" {
  export interface ToastT {
    title?: string;
    description?: string;
    action?: ReactNode;
    variant?: "default" | "destructive";
    duration?: number;
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  }
  
  export function toast(
    message: string,
    options?: ToastT
  ): void;

  export function Toaster(props: {
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
    duration?: number;
    closeButton?: boolean;
  }): JSX.Element;
}
