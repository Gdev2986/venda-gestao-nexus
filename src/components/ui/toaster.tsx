
"use client";

import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "../theme-provider";

export function Toaster() {
  const { theme } = useTheme();
  
  return (
    <SonnerToaster 
      theme={theme as "dark" | "light" | "system"}
      position="top-right" 
      closeButton
      toastOptions={{
        classNames: {
          toast: "bg-background border-border",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        }
      }}
    />
  );
}
