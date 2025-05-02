
import { motion } from "framer-motion";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";
import { LoadingAnimation } from "./loading-animation";

interface LoadingOverlayProps {
  show: boolean;
}

export function LoadingOverlay({ show }: LoadingOverlayProps) {
  const { userRole } = useUserRole();
  
  // Different colored backgrounds based on user role
  const getBgColor = () => {
    switch (userRole) {
      case UserRole.CLIENT:
        return "bg-blue-900/90";
      case UserRole.PARTNER:
        return "bg-green-900/90";
      case UserRole.FINANCIAL:
        return "bg-purple-900/90";
      case UserRole.LOGISTICS:
        return "bg-orange-900/90";
      case UserRole.ADMIN:
      default:
        return "bg-blue-950/90";
    }
  };
  
  // Different colors for dots based on user role
  const getDotsColor = () => {
    switch (userRole) {
      case UserRole.CLIENT:
        return "bg-white";
      case UserRole.PARTNER:
        return "bg-white";
      case UserRole.FINANCIAL:
        return "bg-white";
      case UserRole.LOGISTICS:
        return "bg-white";
      case UserRole.ADMIN:
      default:
        return "bg-white";
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${getBgColor()} backdrop-blur-sm`}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <LoadingAnimation size="md" color={getDotsColor()} />
    </motion.div>
  );
}
