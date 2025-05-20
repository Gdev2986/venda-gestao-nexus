
// We'll update to use toaster from sonner instead of custom hook to avoid circular dependencies
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

export { useToast, toast };
