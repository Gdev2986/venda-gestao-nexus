
import { UserRole } from "@/types";
import { Session, User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  role?: UserRole;
  name?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  requestPasswordReset: (email: string) => Promise<{ error: any }>;
  resetPassword: (password: string) => Promise<{ error: any }>;
}
