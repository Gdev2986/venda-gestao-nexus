
// Re-export the useAuth hook from the AuthContext with additional type safety
import { useAuth as useAuthContext } from "@/providers/AuthProvider";
import { AuthContextType } from "@/contexts/auth-types";

export const useAuth = (): AuthContextType => {
  return useAuthContext();
};
