
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // Direct import from sonner
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";
import { AuthContextType, UserProfile } from "@/contexts/auth-types";
import { cleanupSupabaseState } from "@/utils/auth-cleanup";

// Create a context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  // Simple auth functions to avoid circular dependencies
  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast(error.message, {
          description: "Erro ao fazer login",
        });
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Error during sign in:", error);
      toast("Ocorreu um erro durante o login", {
        description: error?.message || "Tente novamente mais tarde",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        toast(error.message, {
          description: "Erro ao criar conta",
        });
        return { data: null, error };
      }
      
      toast("Verificação necessária", {
        description: "Verifique seu email para confirmar sua conta",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error during sign up:", error);
      toast("Ocorreu um erro ao criar sua conta", {
        description: error?.message || "Tente novamente mais tarde",
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      navigate(PATHS.LOGIN);
    } catch (error) {
      console.error("Error during sign out:", error);
      toast("Erro ao sair", {
        description: "Ocorreu um erro ao encerrar sua sessão",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            // Defer data fetching to prevent deadlocks
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
                  // Update profile state
                  setProfile(profileData as UserProfile);
                  
                  // Normalize the role to match our UserRole enum
                  const normalizedRole = profileData?.role?.toUpperCase() as UserRole;
                  console.log("User role fetched:", normalizedRole);
                  setUserRole(normalizedRole);
                  
                  // Toast only if we successfully got the role
                  toast("Login bem-sucedido", {
                    description: "Bem-vindo ao SigmaPay!"
                  });
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
          setProfile(null);
          
          // Clean up all auth-related data
          cleanupSupabaseState();
          
          // Use setTimeout to avoid calling toast inside the callback
          setTimeout(() => {
            toast("Sessão encerrada", {
              description: "Você foi desconectado com sucesso."
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
            // Fetch user profile from profiles table
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching user profile:", error);
            } else {
              // Set profile
              setProfile(profileData as UserProfile);
              
              // Normalize the role to match our UserRole enum
              const normalizedRole = profileData?.role?.toUpperCase() as UserRole;
              console.log("User role fetched:", normalizedRole);
              setUserRole(normalizedRole);
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
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    initialSessionCheck();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
