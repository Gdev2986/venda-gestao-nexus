
import { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (credentials: SignUpCredentials) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  role?: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  phone?: string;
}

export enum UserRole {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
  FINANCIAL = "FINANCIAL",
  LOGISTICS = "LOGISTICS"
}
