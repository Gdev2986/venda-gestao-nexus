
// Re-export the toast hooks from the UI component
import { toast } from "@/components/ui/use-toast";
import { useToast as useToastUI } from "@/components/ui/use-toast";

// Re-export with the same name
export const useToast = useToastUI;
export { toast };
