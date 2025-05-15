
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
import { getDashboardRedirect } from "@/routes/routeUtils";
import { UserRole } from "@/types";

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
  } catch (error) {
    // Silent error
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

  useEffect(() => {
    // Set up auth state listener FIRST to prevent missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Set session and user state synchronously
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle auth events
        if (event === "SIGNED_IN") {
          // Track the session in our custom table - using setTimeout to avoid Supabase callback issues
          if (newSession?.user) {
            setTimeout(() => {
              toast({
                title: "Autenticação bem-sucedida",
                description: "Bem-vindo ao SigmaPay!",
              });
            }, 0);
          }
        }
        
        if (event === "SIGNED_OUT") {
          // Clear auth data
          clearAuthData();
          cleanupSupabaseState();
          
          // Use setTimeout to avoid calling toast inside the callback
          setTimeout(() => {
            toast({
              title: "Desconectado",
              description: "Você foi desconectado com sucesso.",
            });
            
            // Force page reload to completely clear state
            window.location.href = PATHS.LOGIN;
          }, 0);
        }
      }
    );

    // Check for existing session AFTER setting up listeners
    const initialSessionCheck = async () => {
      setIsLoading(true);
      try {
        const { session: currentSession, user: currentUser, error } = await getCurrentSession();
        
        if (error) {
          // Clear data in case of error
          cleanupSupabaseState();
          throw error;
        }
                
        setSession(currentSession);
        setUser(currentUser);
      } catch (error) {
        setSession(null);
        setUser(null);
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
      // Clear any auth data before attempting login
      cleanupSupabaseState();
      
      setIsLoading(true);
      
      // Attempt global logout before login
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { user: signedInUser, error } = await signInWithEmail(email, password);

      if (error) {
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      if (signedInUser) {
        // Fetch user role from profiles table after sign in
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signedInUser.id)
          .single();
        
        // Use setTimeout to avoid race conditions with onAuthStateChange
        setTimeout(() => {
          const redirectPath = sessionStorage.getItem('redirectPath');
          
          if (redirectPath) {
            sessionStorage.removeItem('redirectPath');
            navigate(redirectPath);
          } else {
            // Use the user's role to determine where to redirect
            const userRole = profileData?.role || UserRole.CLIENT;
            const dashboardPath = getDashboardRedirect(userRole);
            navigate(dashboardPath, { replace: true });
          }
        }, 0);
      }
    } catch (error: any) {
      // Toast is shown in the error handler above
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string }) => {
    try {
      // Clear any auth data before attempting registration
      cleanupSupabaseState();
      
      setIsLoading(true);
      
      // Attempt global logout before registration
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { user: newUser, error } = await signUpWithEmail(email, password, userData);

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });

      navigate(PATHS.HOME);
    } catch (error: any) {
      // Toast is shown in the error handler above
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear local state immediately for better UX
      setUser(null);
      setSession(null);
      
      // Clear all auth data
      cleanupSupabaseState();
      
      const { error } = await signOutUser();
      
      if (error) {
        // Error handling
      }
      
      // Force complete page reload to clear all state
      window.location.href = PATHS.HOME;
      
      return { success: true, error: null };
    } catch (error: any) {
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
