
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string }) => Promise<void>;
  signOut: () => Promise<{ success: boolean, error: Error | null }>;
}
