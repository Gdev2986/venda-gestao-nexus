
// Re-export the toast hooks from the UI component
import { toast, useToast as useToastUI } from "@/components/ui/use-toast";

// Export with consistent naming
export { toast };
export const useToast = useToastUI;
export default useToast;
