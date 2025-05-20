
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";
import { 
  getCurrentSession, 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  clearAuthData
} from "@/services/auth-service";
import { AuthContextType, UserProfile } from "./auth-types";
import { toUserRole } from "@/lib/type-utils";

// Function to clean up Supabase-related data
export const cleanupSupabaseState = () => {
  try {
    // Clear standard auth data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    localStorage.removeItem('userRole');
    
    // Clear all Supabase keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear from sessionStorage if being used
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log("Auth state cleanup complete");
  } catch (error) {
    console.error("Error during auth state cleanup:", error);
  }
};

// Create a context for authentication - ensure React is properly referenced
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Set up auth state listener FIRST - this prevents missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state change event:", event);
        
        // Update session state synchronously first
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);

        // Handle auth events
        if (event === "SIGNED_IN") {
          console.log("Signed in event detected, session:", !!newSession);
          
          // Only fetch user role if we have a session
          if (newSession?.user) {
            // Defer data fetching to prevent deadlocks on iOS
            setTimeout(async () => {
              try {
                // Fetch user profile from profiles table
                const { data: profileData, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', newSession.user.id)
                  .single();
              
                if (error) {
                  console.error("Error fetching user profile:", error);
                } else {
                  // Update profile state - Convert profileData to UserProfile type
                  if (profileData) {
                    const userProfile: UserProfile = {
                      id: profileData.id,
                      name: profileData.name,
                      email: profileData.email,
                      role: toUserRole(profileData.role), // Use the utility function to convert role
                      avatar: profileData.avatar,
                      phone: profileData.phone
                    };
                    setProfile(userProfile);
                    
                    // Normalize the role to match our UserRole enum
                    const normalizedRole = toUserRole(profileData.role);
                    console.log("User role fetched:", normalizedRole);
                    setUserRole(normalizedRole);
                    
                    // Toast only if we successfully got the role
                    toast({
                      title: "Login bem-sucedido",
                      description: "Bem-vindo ao SigmaPay!",
                    });
                  }
                }
              } catch (err) {
                console.error("Error in role fetching:", err);
              } finally {
                setIsLoading(false);
              }
            }, 0);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("Signed out event detected");
          
          // Clear auth data immediately
          setSession(null);
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
          
          // Clean up all auth-related data
          cleanupSupabaseState();
          
          // Use setTimeout to avoid calling toast inside the callback
          setTimeout(() => {
            toast({
              title: "Sessão encerrada",
              description: "Você foi desconectado com sucesso.",
            });
            
            // Navigate to login page
            navigate(PATHS.LOGIN);
          }, 0);
          
          setIsLoading(false);
        }
      }
    );

    // Check for existing session AFTER setting up listeners
    const initialSessionCheck = async () => {
      setIsLoading(true);
      try {
        console.log("Checking initial session");
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        
        console.log("Initial session check complete:", !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // Only fetch user role if we have a user
        if (session?.user) {
          try {
            // Fetch user role from profiles table
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching user role:", error);
            } else if (profileData) {
              // Normalize the role to match our UserRole enum
              const normalizedRole = toUserRole(profileData.role);
              console.log("User role fetched:", normalizedRole);
              setUserRole(normalizedRole);
              
              // Create a properly typed profile object
              const userProfile: UserProfile = {
                id: profileData.id,
                name: profileData.name,
                email: profileData.email,
                role: normalizedRole,
                avatar: profileData.avatar,
                phone: profileData.phone
              };
              setProfile(userProfile);
            }
          } catch (err) {
            console.error("Error in role fetching:", err);
          }
        }
      } catch (error) {
        console.error("Error during initial session check:", error);
        setSession(null);
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initialSessionCheck();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]); // Include navigate in dependencies

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing auth data before attempting login
      cleanupSupabaseState();
      
      console.log("Sign in attempt for:", email);
      setIsLoading(true);
      
      // Try global logout before login to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Failed to perform global logout before login, continuing...");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      if (data.user) {
        console.log("Sign in successful");
        // Let the auth state change listener handle redirects
        return { error: null };
      }
      
      setIsLoading(false);
      return { error: null };
    } catch (error: any) {
      console.error("Error during login:", error);
      setIsLoading(false);
      return { 
        error: error instanceof Error ? error : new Error("Unknown error during login") 
      };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      // Clean up any existing auth data before attempting signup
      cleanupSupabaseState();
      
      console.log("Sign up attempt for:", email);
      setIsLoading(true);
      
      // Try global logout before signup to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata?.name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        let errorMessage = "Ocorreu um erro durante o cadastro";
        
        if (error.message.includes("already registered")) {
          errorMessage = "Este email já está registrado. Tente fazer login.";
        }
        
        toast({
          title: "Erro de registro",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return { data: null, error };
      }
      
      toast({
        title: "Registro bem-sucedido",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });

      navigate(PATHS.HOME);
      setIsLoading(false);
      return { data: data?.user || null, error: null };
    } catch (error: any) {
      console.error("Error during registration:", error);
      setIsLoading(false);
      return { 
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error during registration") 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log("Sign out attempt");
      setIsLoading(true);
      
      // Clear local state immediately for better UX
      setUser(null);
      setSession(null);
      setUserRole(null);
      setIsAuthenticated(false);
      
      // Clean up all auth data
      cleanupSupabaseState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        setIsLoading(false);
      }
      
      // Navigate to login page
      navigate(PATHS.LOGIN);
    } catch (error: any) {
      console.error("Error during sign out:", error);
      setIsLoading(false);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        profile,
        userRole,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
