
import { ReactNode } from "react";

declare module "sonner" {
  export interface ToastT {
    id?: string | number;
    title?: string | ReactNode;
    description?: string | ReactNode;
    action?: ReactNode;
    cancel?: ReactNode;
    variant?: "default" | "destructive";
    duration?: number;
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
    style?: React.CSSProperties;
  }
  
  export function toast(
    message: string | ReactNode | ToastT,
    options?: Partial<ToastT>
  ): number | string;

  export interface ToasterProps {
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
    duration?: number;
    closeButton?: boolean;
    theme?: "light" | "dark" | "system";
    className?: string;
    toastOptions?: object;
    visibleToasts?: number;
    dir?: "rtl" | "ltr";
    expand?: boolean;
  }
  
  export function Toaster(props: ToasterProps): JSX.Element;
  
  export type Toast = ToastT;
}
