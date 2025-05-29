
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsPasswordChange: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{
    data: { user: User; session: Session } | null;
    error: Error | null;
  }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{
    data: { user: User } | null;
    error: Error | null;
  }>;
  signOut: () => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<void>;
  changePasswordAndActivate: (newPassword: string) => Promise<boolean>;
}

export type AuthAction = 
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SESSION"; payload: { user: User | null; session: Session | null } }
  | { type: "SET_PROFILE"; payload: UserProfile | null }
  | { type: "SET_NEEDS_PASSWORD_CHANGE"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" };
