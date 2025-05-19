import { createContext, useContext, useEffect, useState } from "react";
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
import { AuthContextType } from "./auth-types";

// Function to clean up Supabase-related data
export const cleanupSupabaseState = () => {
  try {
    console.log("Starting auth state cleanup");
    
    // Clear standard auth data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    localStorage.removeItem('userRole');
    
    // Clear all Supabase keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log(`Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Clear from sessionStorage if being used
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log(`Removing sessionStorage key: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
    
    console.log("Auth state cleanup complete");
  } catch (error) {
    console.error("Error during auth state cleanup:", error);
  }
};

// Create a context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  console.log("AuthProvider rendering - isLoading:", isLoading, "user:", user?.email, "userRole:", userRole, "isMobile:", isMobile);

  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state change event:", event);
        
        // Update session state synchronously first
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);

        // Handle auth events
        if (event === "SIGNED_IN") {
          console.log("Signed in event detected");
          
          // Only fetch user role if we have a session
          if (newSession?.user) {
            // Defer data fetching to prevent deadlocks
            setTimeout(async () => {
              try {
                // Fetch user role from profiles table
                const { data: profile, error } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', newSession.user.id)
                  .single();
                
                if (error) {
                  console.error("Error fetching user role:", error);
                  setUserRole(null);
                } else {
                  // Normalize the role to match our UserRole enum
                  const normalizedRole = profile?.role?.toUpperCase() as UserRole;
                  console.log("User role fetched:", normalizedRole);
                  setUserRole(normalizedRole);
                }
              } catch (err) {
                console.error("Error in role fetching:", err);
                setUserRole(null);
              }
              
              toast({
                title: "Login bem-sucedido",
                description: "Bem-vindo ao SigmaPay!",
              });
            }, 0);
          }
        }
        
        if (event === "SIGNED_OUT") {
          console.log("Signed out event detected");
          
          // Clear auth data immediately
          setSession(null);
          setUser(null);
          setUserRole(null); // Explicitly set userRole to null
          setIsAuthenticated(false);
          
          // Clean up all auth-related data
          cleanupSupabaseState();
          
          // Use setTimeout to avoid calling toast inside the callback
          setTimeout(() => {
            toast({
              title: "Sessão encerrada",
              description: "Você foi desconectado com sucesso.",
            });
            
            // Force page reload to clear state completely
            window.location.href = PATHS.LOGIN;
          }, 0);
        }
      }
    );

    // Check for existing session AFTER setting up listeners
    const initialSessionCheck = async () => {
      setIsLoading(true);
      try {
        console.log("Checking initial session");
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Initial session check complete:", !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // Only fetch user role if we have a user
        if (session?.user) {
          try {
            // Fetch user role from profiles table
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching user role:", error);
              setUserRole(null);
            } else {
              // Normalize the role to match our UserRole enum
              const normalizedRole = profile?.role?.toUpperCase() as UserRole;
              console.log("User role fetched:", normalizedRole);
              setUserRole(normalizedRole);
            }
          } catch (err) {
            console.error("Error in role fetching:", err);
            setUserRole(null);
          }
        } else {
          // Explicitly set userRole to null when no session
          setUserRole(null);
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
  }, [toast]); // Only run on mount

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
        console.error("Login error:", error);
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive",
        });
        return { user: null, error };
      }
      
      if (data.user) {
        console.log("Sign in successful, navigating to dashboard");
        // Use setTimeout to avoid race conditions with onAuthStateChange
        setTimeout(() => {
          const redirectPath = sessionStorage.getItem('redirectPath');
          
          if (isMobile) {
            console.log("Mobile device detected, using window.location");
            window.location.href = redirectPath || PATHS.DASHBOARD;
          } else {
            if (redirectPath) {
              sessionStorage.removeItem('redirectPath');
              navigate(redirectPath);
            } else {
              navigate(PATHS.DASHBOARD); // Will be handled by RootLayout
            }
          }
        }, 0);
      }
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Error during login:", error);
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error("Unknown error during login") 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string, role?: UserRole | string }) => {
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
            name: userData.name,
            role: userData.role
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
        return { user: null, error };
      }
      
      toast({
        title: "Registro bem-sucedido",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });

      navigate(PATHS.HOME);
      return { user: data?.user || null, error: null };
    } catch (error: any) {
      console.error("Error during registration:", error);
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error("Unknown error during registration") 
      };
    } finally {
      setIsLoading(false);
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
      }
      
      // Force complete page reload to clear all state
      window.location.href = PATHS.HOME;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
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
