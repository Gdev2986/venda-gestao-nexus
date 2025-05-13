
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { 
  getCurrentSession, 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  clearAuthData 
} from "@/services/auth-service";
import { AuthContextType } from "./auth-types";

// Function to clean up all Supabase-related data
const cleanupSupabaseState = () => {
  try {
    // Clear standard tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear other auth data
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    localStorage.removeItem('userRole');
    
    console.log("Complete cleanup of authentication state");
  } catch (error) {
    console.error("Error clearing authentication state:", error);
  }
};

// Create a context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("AuthProvider rendering, isLoading:", isLoading, "user:", user?.email);

  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Set up auth state listener FIRST to prevent missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state change event:", event);
        
        // Set session and user state synchronously
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle auth events
        if (event === "SIGNED_IN") {
          console.log("Signed in event detected");
          
          // Track the session in our custom table - using setTimeout to avoid Supabase callback issues
          if (newSession?.user) {
            setTimeout(() => {
              toast({
                title: "Successfully authenticated",
                description: "Welcome to SigmaPay!",
              });
            }, 0);
          }
        }
        
        if (event === "SIGNED_OUT") {
          console.log("Signed out event detected");
          
          // Clear auth data
          clearAuthData();
          cleanupSupabaseState();
          
          // Use setTimeout to avoid calling toast inside the callback
          setTimeout(() => {
            toast({
              title: "Signed out",
              description: "You have been successfully signed out.",
            });
            
            // Force page reload to completely clear state
            window.location.href = PATHS.LOGIN;
          }, 0);
        }
        
        if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed event");
        }
        
        if (event === "USER_UPDATED") {
          console.log("User updated event");
        }
      }
    );

    // Check for existing session AFTER setting up listeners
    const initialSessionCheck = async () => {
      setIsLoading(true);
      try {
        console.log("Checking initial session");
        const { session: currentSession, user: currentUser, error } = await getCurrentSession();
        
        if (error) {
          console.error("Error getting session:", error);
          // Clear data in case of error
          cleanupSupabaseState();
          throw error;
        }
        
        console.log("Initial session check complete:", !!currentSession);
        
        setSession(currentSession);
        setUser(currentUser);
      } catch (error) {
        console.error("Error during initial session check:", error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initialSessionCheck();

    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, [toast]); // Only run on mount

  const signIn = async (email: string, password: string) => {
    try {
      // Limpar qualquer dado de autenticação antes de tentar login
      cleanupSupabaseState();
      
      console.log("Sign in attempt for:", email);
      setIsLoading(true);
      
      // Tentativa de logout global antes de fazer login
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar mesmo se falhar
        console.log("Falha ao fazer logout global antes do login, continuando...");
      }
      
      const { user: signedInUser, error } = await signInWithEmail(email, password);

      if (error) {
        toast({
          title: "Login error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      if (signedInUser) {
        console.log("Sign in successful, navigating to dashboard");
        // Use setTimeout to avoid race conditions with onAuthStateChange
        setTimeout(() => {
          const redirectPath = sessionStorage.getItem('redirectPath');
          if (redirectPath) {
            sessionStorage.removeItem('redirectPath');
            navigate(redirectPath);
          } else {
            navigate(PATHS.DASHBOARD); // Will be handled by RootLayout
          }
        }, 0);
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      // Toast is shown in the error handler above
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string }) => {
    try {
      // Limpar qualquer dado de autenticação antes de tentar cadastro
      cleanupSupabaseState();
      
      console.log("Sign up attempt for:", email);
      setIsLoading(true);
      
      // Tentativa de logout global antes de fazer cadastro
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar mesmo se falhar
      }
      
      const { user: newUser, error } = await signUpWithEmail(email, password, userData);

      if (error) {
        toast({
          title: "Registration error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });

      navigate(PATHS.HOME);
    } catch (error: any) {
      console.error("Error during registration:", error);
      // Toast is shown in the error handler above
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Sign out attempt");
      setIsLoading(true);
      
      // Limpar estado local imediatamente para melhor UX
      setUser(null);
      setSession(null);
      
      // Limpar todos os dados de autenticação
      cleanupSupabaseState();
      
      const { error } = await signOutUser();
      
      if (error) {
        console.error("Erro ao fazer logout:", error);
      }
      
      // Forçar recarga completa da página para limpar todo o estado
      window.location.href = PATHS.HOME;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while trying to sign out",
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
