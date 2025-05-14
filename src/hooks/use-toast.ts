
// Re-export the toast hooks from the UI component
import { toast, useToast as useToastUI } from "@/components/ui/use-toast";

// Re-export with the same name
export { toast, useToast as default, useToast as useToast };
export const useToast = useToastUI;
