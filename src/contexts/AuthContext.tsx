
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

// Create a context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Add a flag to prevent multiple redirects
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("AuthProvider rendering - isLoading:", isLoading, "user:", user?.email, "userRole:", userRole, "isRedirecting:", isRedirecting);

  // Function to fetch user role - extracted to avoid code duplication
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      // Fetch user role from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      } 
      
      // Normalize the role to match our UserRole enum
      const normalizedRole = profile?.role?.toUpperCase() as UserRole;
      console.log("User role fetched:", normalizedRole);
      return normalizedRole;
    } catch (err) {
      console.error("Error in role fetching:", err);
      return null;
    }
  };

  // Handle redirects separately to avoid loops
  useEffect(() => {
    const handleRedirect = async () => {
      // Only redirect if we have all the required data and are not already redirecting
      if (!isLoading && user && userRole && isAuthenticated && !isRedirecting) {
        console.log("All conditions met for redirect - User and Role available");
        
        try {
          setIsRedirecting(true);
          const redirectPath = sessionStorage.getItem('redirectPath');
          
          if (redirectPath) {
            console.log("Redirecting to saved path:", redirectPath);
            sessionStorage.removeItem('redirectPath');
            navigate(redirectPath);
          } else {
            const dashboardPath = PATHS.DASHBOARD; // Will be handled by RootLayout
            console.log("Redirecting to dashboard:", dashboardPath);
            navigate(dashboardPath);
          }
        } catch (error) {
          console.error("Error during redirect:", error);
          setIsRedirecting(false);
        }
      }
    };

    handleRedirect();
  }, [isLoading, user, userRole, isAuthenticated, navigate, isRedirecting]);

  // Set up auth state listener and initial session check
  useEffect(() => {
    console.log("Setting up auth listener and checking session");
    setIsLoading(true);
    
    // First, check for existing session to avoid flashing login screen
    const initialSessionCheck = async () => {
      try {
        console.log("Performing initial session check");
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Initial session check complete:", !!session);
        
        // Update session state synchronously
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // Only fetch user role if we have a user
        if (session?.user) {
          // Wait for the role to be fetched before finishing loading
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        }
        
      } catch (error) {
        console.error("Error during initial session check:", error);
        setSession(null);
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      } finally {
        // Only set loading to false after we've fetched everything
        setIsLoading(false);
      }
    };
    
    // Set up auth state listener AFTER initial check
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state change event:", event, "Session:", !!newSession);
        
        // Update session state synchronously first
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);

        // Handle auth events
        if (event === "SIGNED_IN") {
          console.log("Signed in event detected");
          
          // Only fetch user role if we have a session
          if (newSession?.user) {
            // Set loading to true while we fetch the role
            setIsLoading(true);
            
            // Wait for the role to be fetched using setTimeout to prevent potential deadlocks
            setTimeout(async () => {
              try {
                const role = await fetchUserRole(newSession.user.id);
                setUserRole(role);
                
                toast({
                  title: "Login bem-sucedido",
                  description: "Bem-vindo ao SigmaPay!",
                });
              } catch (err) {
                console.error("Error in role fetching after sign in:", err);
              } finally {
                setIsLoading(false);
              }
            }, 0);
          }
        }
        
        if (event === "SIGNED_OUT") {
          console.log("Signed out event detected");
          
          // Clear auth data immediately
          setSession(null);
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
          setIsRedirecting(false);
          
          // Clean up all auth-related data
          cleanupSupabaseState();
          
          // Use setTimeout to avoid calling toast inside the callback
          setTimeout(() => {
            toast({
              title: "Sessão encerrada",
              description: "Você foi desconectado com sucesso.",
            });
            
            // Force page reload to clear state completely - using window.location for more reliable redirect
            window.location.href = PATHS.LOGIN;
          }, 0);
        }
      }
    );

    // Perform the initial session check
    initialSessionCheck();

    // Clean up subscription on unmount
    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, []); // Only run on mount

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing auth data before attempting login
      cleanupSupabaseState();
      
      console.log("Sign in attempt for:", email);
      setIsLoading(true);
      setIsRedirecting(false);
      
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
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return { user: null, error };
      }
      
      if (data.user) {
        console.log("Sign in successful - waiting for auth state change to detect role");
        // We'll let the onAuthStateChange handle the redirect after role is fetched
        // The loading state will be managed there too
      } else {
        setIsLoading(false);
      }
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Error during login:", error);
      setIsLoading(false);
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error("Unknown error during login") 
      };
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
        setIsLoading(false);
        return { user: null, error };
      }
      
      toast({
        title: "Registro bem-sucedido",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });

      // Reset loading since we're navigating away
      setIsLoading(false);
      navigate(PATHS.HOME);
      return { user: data?.user || null, error: null };
    } catch (error: any) {
      console.error("Error during registration:", error);
      setIsLoading(false);
      return { 
        user: null, 
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
      setIsRedirecting(false);
      
      // Clean up all auth data
      cleanupSupabaseState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.error("Error during logout:", error);
      }
      
      // Force complete page reload to clear all state - use window.location for more reliable redirect
      window.location.href = PATHS.HOME;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
      setIsLoading(false);
      return { success: false, error };
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
