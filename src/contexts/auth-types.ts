
import { Session, User } from "@supabase/supabase-js";
import { UserRole } from "@/types";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  phone?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<void>;
}
