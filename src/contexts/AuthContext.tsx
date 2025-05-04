import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthState, SignInCredentials, UserProfile, SignUpCredentials } from "./auth-types";
import { UserRole } from "@/types";

interface AuthContextProps extends AuthState { }

const AuthContext = createContext<AuthContextProps>({
  user: null,
  profile: null,
  isLoading: false,
  isAuthenticated: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => { },
  updateProfile: async () => ({ error: null }),
});

export const useAuth = () => useContext(AuthContext);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session);
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthStateChange(session);
    })
  }, []);

  const handleAuthStateChange = async (session: any) => {
    const currentUser = session?.user || null;
    setUser(currentUser);

    if (currentUser) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (error) throw error;

        if (data) {
          // Ensure we're correctly typing the profile data
          setProfile({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role as UserRole,
            avatar_url: data.avatar,
            phone: data.phone,
            created_at: data.created_at,
            updated_at: data.updated_at
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    } else {
      setProfile(null);
    }

    setIsLoading(false);
  };

  const signIn = async (credentials: SignInCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error("Error signing in:", error);
      return { error };
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: credentials.role,
          }
        }
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error("Error signing up:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          role: updates.role as UserRole, // Cast to UserRole to ensure type safety
          updated_at: new Date().toISOString(),
        })
        .eq("id", user!.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);

      return { error: null };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return { error };
    }
  };

  const value: AuthContextProps = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
