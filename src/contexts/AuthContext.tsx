
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

// Function to clear all Supabase-related data
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
    
    // Remove from sessionStorage if being used
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear other auth-related data
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    localStorage.removeItem('userRole');
    
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

  console.log("AuthProvider rendering - isLoading:", isLoading, "user:", user?.email, "userRole:", userRole);

  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Set up auth state listener FIRST to prevent missing events
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
            try {
              // Fetch user role from profiles table
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', newSession.user.id)
                .single();
              
              if (error) {
                console.error("Error fetching user role:", error);
              } else {
                // Normalize the role to match our UserRole enum
                const normalizedRole = profile?.role?.toUpperCase() as UserRole;
                console.log("User role fetched:", normalizedRole);
                setUserRole(normalizedRole);
              }
            } catch (err) {
              console.error("Error in role fetching:", err);
            }
            
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
          
          // Clear auth data immediately
          setSession(null);
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
          
          // Clean up all auth-related data
          clearAuthData();
          cleanupSupabaseState();
          
          // Use setTimeout to avoid calling toast inside the callback
          setTimeout(() => {
            toast({
              title: "Signed out",
              description: "You have been successfully signed out.",
            });
            
            // Force page reload to clear state completely
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
          // Clean up data if there's an error
          cleanupSupabaseState();
          throw error;
        }
        
        console.log("Initial session check complete:", !!currentSession);
        
        setSession(currentSession);
        setUser(currentUser);
        setIsAuthenticated(!!currentSession);
        
        // Only fetch user role if we have a user
        if (currentUser) {
          try {
            // Fetch user role from profiles table
            const { data: profile, error: roleError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', currentUser.id)
              .single();
            
            if (roleError) {
              console.error("Error fetching user role:", roleError);
            } else {
              // Normalize the role to match our UserRole enum
              const normalizedRole = profile?.role?.toUpperCase() as UserRole;
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
      
      // Clear local state immediately for better UX
      setUser(null);
      setSession(null);
      setUserRole(null);
      setIsAuthenticated(false);
      
      // Clean up all auth data
      cleanupSupabaseState();
      
      const { error } = await signOutUser();
      
      if (error) {
        console.error("Error during logout:", error);
      }
      
      // Force complete page reload to clear all state
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
