
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  id?: string
}

export function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
  action,
  id,
}: ToastProps) {
  // Map our internal toast API to sonner's API
  const options = {
    id,
    duration,
    className: variant === "destructive" ? "destructive" : undefined,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  }

  return sonnerToast(title || "", {
    ...options,
    description,
  })
}

export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}
