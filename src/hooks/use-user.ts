
// Re-export the user functionality from the AuthContext
import { useAuth } from "@/contexts/AuthContext";

export const useUser = () => {
  const { user } = useAuth();
  return { user };
};
