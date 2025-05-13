import { toast as sonnerToast } from "sonner";
import { useState } from "react";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  id?: string;
};

// For compatibility with both toast systems
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

// Store to keep track of toast components for the radix UI toast system
const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// Simple store for managing toasts
const toastStore = {
  toasts: [] as ToasterToast[],
  listeners: new Set<() => void>(),

  addToast: (toast: ToasterToast) => {
    const { toasts } = toastStore;
    toastStore.toasts = [toast, ...toasts].slice(0, TOAST_LIMIT);
    toastStore.listeners.forEach((listener) => listener());
  },
  
  updateToast: (id: string, toast: Partial<ToasterToast>) => {
    const { toasts } = toastStore;
    toastStore.toasts = toasts.map((t) => (t.id === id ? { ...t, ...toast } : t));
    toastStore.listeners.forEach((listener) => listener());
  },
  
  dismissToast: (id: string) => {
    const { toasts } = toastStore;
    toastStore.toasts = toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
    toastStore.listeners.forEach((listener) => listener());
  },
  
  removeToast: (id: string) => {
    const { toasts } = toastStore;
    toastStore.toasts = toasts.filter((t) => t.id !== id);
    toastStore.listeners.forEach((listener) => listener());
  },
  
  subscribe: (listener: () => void) => {
    toastStore.listeners.add(listener);
    return () => {
      toastStore.listeners.delete(listener);
    };
  }
};

// Hook for accessing and managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>(toastStore.toasts);

  useState(() => {
    const unsubscribe = toastStore.subscribe(() => {
      setToasts([...toastStore.toasts]);
    });
    return unsubscribe;
  });

  const createToast = (props: ToastProps) => {
    const id = genId();
    const newToast = { id, ...props };
    toastStore.addToast(newToast);
    return id;
  };

  return {
    toasts, 
    toast: createToast,
    dismiss: (id: string) => toastStore.dismissToast(id),
    remove: (id: string) => toastStore.removeToast(id),
  };
};
