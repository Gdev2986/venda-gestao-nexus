
import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Map the context properties to maintain compatibility
  return {
    ...context,
    // Add isLoading alias for loading
    isLoading: context.isLoading,
    // Add profile alias for userProfile  
    profile: context.profile,
    // Add error property (not available in current context, but needed for compatibility)
    error: null
  };
};
