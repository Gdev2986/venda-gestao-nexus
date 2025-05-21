
import { ReactNode } from "react";

declare module "sonner" {
  export interface ToastT {
    id?: string;
    title?: string;
    description?: string | ReactNode;
    action?: ReactNode;
    variant?: "default" | "destructive";
    duration?: number;
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  }
  
  export function toast(
    message: string | ToastT,
    options?: Partial<ToastT>
  ): void;

  export interface ToasterProps {
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
    duration?: number;
    closeButton?: boolean;
    theme?: "light" | "dark" | "system";
    className?: string;
    toastOptions?: object;
  }
  
  export function Toaster(props: ToasterProps): JSX.Element;
}
