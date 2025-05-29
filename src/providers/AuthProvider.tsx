
import React, { createContext, useEffect, useReducer, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: any | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsPasswordChange: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  userRole: null,
  isLoading: true,
  isAuthenticated: false,
  needsPasswordChange: false,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signOut: async () => {},
});

type AuthAction =
  | { type: "SET_SESSION"; payload: { user: User | null; session: Session | null } }
  | { type: "SET_PROFILE"; payload: { profile: any; userRole: UserRole } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SIGN_OUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_SESSION":
      console.log("AuthReducer: Setting session", {
        user: action.payload.user?.id,
        session: !!action.payload.session,
      });
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: !!action.payload.user && !!action.payload.session,
        isLoading: !!action.payload.user, // Keep loading if we have a user but no profile yet
      };
    case "SET_PROFILE":
      console.log("AuthReducer: Setting profile", {
        profile: action.payload.profile?.name,
        userRole: action.payload.userRole,
      });
      return {
        ...state,
        profile: action.payload.profile,
        userRole: action.payload.userRole,
        isLoading: false,
        needsPasswordChange: action.payload.profile?.needs_password_change || false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SIGN_OUT":
      console.log("AuthReducer: Signing out");
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("AuthProvider: Loading user profile for:", userId);
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("AuthProvider: Error loading profile:", error);
        // If profile doesn't exist, create a default one with CLIENT role
        const defaultProfile = {
          id: userId,
          name: null,
          role: UserRole.CLIENT,
          needs_password_change: false
        };
        
        dispatch({
          type: "SET_PROFILE",
          payload: {
            profile: defaultProfile,
            userRole: UserRole.CLIENT,
          },
        });
        return;
      }

      const userRole = profile?.role as UserRole || UserRole.CLIENT;
      console.log("AuthProvider: Profile loaded successfully", {
        name: profile?.name,
        role: userRole,
      });

      dispatch({
        type: "SET_PROFILE",
        payload: {
          profile,
          userRole,
        },
      });
    } catch (error) {
      console.error("AuthProvider: Error in loadUserProfile:", error);
      // Fallback to CLIENT role if there's an error
      dispatch({
        type: "SET_PROFILE",
        payload: {
          profile: { role: UserRole.CLIENT },
          userRole: UserRole.CLIENT,
        },
      });
    }
  };

  const signOut = async () => {
    try {
      console.log("AuthProvider: Signing out...");
      
      // Clean up local storage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      await supabase.auth.signOut({ scope: 'global' });
      dispatch({ type: "SIGN_OUT" });
      
      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error("AuthProvider: Error signing out:", error);
      // Force cleanup even if signOut fails
      dispatch({ type: "SIGN_OUT" });
      window.location.href = '/';
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Initializing...");

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider: Auth state change:", event, {
          userId: session?.user?.id,
          hasSession: !!session,
        });

        if (event === "SIGNED_OUT" || !session?.user) {
          dispatch({ type: "SIGN_OUT" });
          return;
        }

        if (event === "SIGNED_IN" || (event === "TOKEN_REFRESHED" && session?.user)) {
          console.log("AuthProvider: User authenticated, loading profile");
          dispatch({
            type: "SET_SESSION",
            payload: {
              user: session.user,
              session: session,
            },
          });

          // Load profile with a small delay to prevent deadlocks
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 100);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Checking for existing session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider: Error getting session:", error);
          dispatch({ type: "SET_LOADING", payload: false });
          return;
        }

        if (session?.user) {
          console.log("AuthProvider: Found existing session");
          dispatch({
            type: "SET_SESSION",
            payload: {
              user: session.user,
              session: session,
            },
          });
          
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 100);
        } else {
          console.log("AuthProvider: No existing session");
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("AuthProvider: Error initializing auth:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();

    return () => {
      console.log("AuthProvider: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
