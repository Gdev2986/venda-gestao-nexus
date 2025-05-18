
import { Session, User } from "@supabase/supabase-js";
import { UserRole } from "@/types";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string, role?: UserRole | string }) => Promise<void>;
  signOut: () => Promise<{ success: boolean, error: Error | null }>;
}
