
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create a context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("AuthProvider rendering, isLoading:", isLoading, "user:", user?.email);

  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Generate a unique device ID for session management
    const getDeviceId = () => {
      let deviceId = sessionStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = `device_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem('deviceId', deviceId);
      }
      return deviceId;
    };
    
    const deviceId = getDeviceId();
    
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
          
          // Track the session in our custom table
          if (newSession?.user) {
            try {
              // Use setTimeout to avoid calling Supabase inside the callback
              setTimeout(async () => {
                await supabase.from('user_sessions').upsert({
                  user_id: newSession.user.id,
                  device_id: deviceId,
                  last_active: new Date().toISOString(),
                  metadata: {
                    user_agent: navigator.userAgent,
                  }
                }, { onConflict: 'user_id, device_id' });
              }, 0);
              
              toast({
                title: "Successfully authenticated",
                description: "Welcome to SigmaPay!",
              });
            } catch (error) {
              console.error("Error tracking session:", error);
            }
          }
        }
        
        if (event === "SIGNED_OUT") {
          console.log("Signed out event detected");
          
          // Clear auth data from sessionStorage and localStorage
          sessionStorage.removeItem('userRole');
          sessionStorage.removeItem('redirectPath');
          localStorage.removeItem('userRole');
          
          // Use setTimeout to avoid calling toast inside the callback
          setTimeout(() => {
            toast({
              title: "Signed out",
              description: "You have been successfully signed out.",
            });
          }, 0);
        }
      }
    );

    // Check for existing session AFTER setting up listeners
    const initialSessionCheck = async () => {
      try {
        console.log("Checking initial session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        console.log("Initial session check complete:", !!data.session);
        
        // Update the last_active timestamp for the session
        if (data.session?.user) {
          try {
            await supabase.from('user_sessions').upsert({
              user_id: data.session.user.id,
              device_id: deviceId,
              last_active: new Date().toISOString()
            }, { onConflict: 'user_id, device_id' });
          } catch (error) {
            console.error("Error updating session activity:", error);
          }
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Error during initial session check:", error);
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
      console.log("Sign in attempt for:", email);
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Enhanced error handling
        console.error("Login error:", error);
        let errorMessage = "An error occurred during authentication";
        
        if (error.message === "Invalid login credentials") {
          errorMessage = "Invalid credentials. Please check your email and password.";
        } else if (error.message.includes("Database error")) {
          errorMessage = "Server connection error. Please try again later.";
        }
        
        toast({
          title: "Login error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
      
      if (data.user) {
        console.log("Sign in successful, navigating to dashboard");
        // Use setTimeout to avoid race conditions with onAuthStateChange
        setTimeout(() => {
          const redirectPath = sessionStorage.getItem('redirectPath');
          if (redirectPath) {
            sessionStorage.removeItem('redirectPath');
            navigate(redirectPath);
          } else {
            navigate(PATHS.DASHBOARD);
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
      console.log("Sign up attempt for:", email);
      setIsLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      console.log("Sign up response:", { error, user: data?.user ? true : false });

      if (error) {
        let errorMessage = "An error occurred during registration";
        
        if (error.message.includes("already registered")) {
          errorMessage = "This email is already registered. Try logging in.";
        }
        
        toast({
          title: "Registration error",
          description: errorMessage,
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
      
      // Clear auth-related storage items
      sessionStorage.removeItem('userRole');
      localStorage.removeItem('userRole');
      
      // Call Supabase to sign out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate(PATHS.HOME);
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while trying to sign out",
        variant: "destructive",
      });
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
