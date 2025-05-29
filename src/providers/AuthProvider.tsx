
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { AuthManager } from "@/services/AuthManager";
import {
  AuthState,
  AuthAction,
  AuthContextType,
  UserProfile,
} from "../contexts/auth-types";

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  userRole: null,
  isLoading: true,
  isAuthenticated: false,
  needsPasswordChange: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SESSION":
      console.log("AuthReducer: Setting session", {
        user: action.payload.user?.id,
        session: !!action.payload.session
      });
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: !!action.payload.user && !!action.payload.session,
        error: null,
      };
    case "SET_PROFILE":
      const profile = action.payload;
      const role = profile?.role || null;
      
      console.log("AuthReducer: Setting profile", {
        profile: !!profile,
        role
      });
      
      // Persist role in localStorage
      if (role) {
        localStorage.setItem('userRole', role);
        console.log("AuthReducer: Role persisted to localStorage:", role);
      } else {
        localStorage.removeItem('userRole');
        console.log("AuthReducer: Role removed from localStorage");
      }
      
      return {
        ...state,
        profile,
        userRole: role,
        isLoading: false,
      };
    case "SET_NEEDS_PASSWORD_CHANGE":
      return { ...state, needsPasswordChange: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "LOGOUT":
      localStorage.removeItem('userRole');
      console.log("AuthReducer: Logout, cleared localStorage");
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

export const AuthContext = React.createContext<AuthContextType>({
  ...initialState,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  refreshSession: async () => {},
  changePasswordAndActivate: async () => false,
});

export const useAuth = () => React.useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    ...initialState,
    userRole: (localStorage.getItem('userRole') as UserRole) || null,
  });

  const loadUserProfile = React.useCallback(async (userId: string) => {
    try {
      console.log("AuthProvider: Loading user profile for:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("AuthProvider: Error loading profile:", error);
        if (error.code === 'PGRST116') {
          console.log("AuthProvider: Profile not found, creating default profile");
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              email: '',
              name: 'Usuário',
              role: 'CLIENT',
              status: 'active'
            })
            .select()
            .single();
          
          if (createError) {
            console.error("AuthProvider: Error creating profile:", createError);
            dispatch({ type: "SET_ERROR", payload: "Erro ao criar perfil do usuário" });
            return;
          }
          
          const userProfile: UserProfile = {
            ...newProfile,
            role: newProfile.role as UserRole,
          };
          console.log("AuthProvider: Created new profile with role:", userProfile.role);
          dispatch({ type: "SET_PROFILE", payload: userProfile });
          return;
        }
        
        dispatch({ type: "SET_ERROR", payload: "Erro ao carregar perfil do usuário" });
        return;
      }

      if (data) {
        console.log("AuthProvider: Profile loaded successfully:", {
          id: data.id,
          role: data.role,
          status: data.status
        });
        
        if (data.status === 'pending_activation') {
          console.log("AuthProvider: Activating user...");
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ status: 'active' })
            .eq("id", userId);
            
          if (updateError) {
            console.error("AuthProvider: Error activating user:", updateError);
          } else {
            data.status = 'active';
            console.log("AuthProvider: User activated successfully");
          }
        }
        
        const userProfile: UserProfile = {
          ...data,
          role: data.role as UserRole,
        };
        console.log("AuthProvider: Setting user profile with role:", userProfile.role);
        dispatch({ type: "SET_PROFILE", payload: userProfile });
        
        const needsChange = await AuthManager.needsPasswordChange(userId);
        dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: needsChange });
      }
    } catch (error) {
      console.error("AuthProvider: Exception loading profile:", error);
      dispatch({ type: "SET_ERROR", payload: "Erro ao carregar perfil do usuário" });
    }
  }, []);

  const refreshSession = React.useCallback(async () => {
    try {
      console.log("AuthProvider: Refreshing session...");
      dispatch({ type: "SET_LOADING", payload: true });
      const { session, user, error } = await AuthManager.getCurrentSession();
      
      if (error) {
        console.error("AuthProvider: Error refreshing session:", error);
        dispatch({ type: "SET_SESSION", payload: { user: null, session: null } });
        dispatch({ type: "SET_PROFILE", payload: null });
        return;
      }
      
      console.log("AuthProvider: Session refreshed", {
        user: user?.id,
        session: !!session
      });
      
      dispatch({ type: "SET_SESSION", payload: { user, session } });
      
      if (user) {
        console.log("AuthProvider: User found, loading profile for:", user.id);
        await loadUserProfile(user.id);
      } else {
        console.log("AuthProvider: No user found, clearing profile");
        dispatch({ type: "SET_PROFILE", payload: null });
        dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: false });
      }
    } catch (error) {
      console.error("AuthProvider: Error in refreshSession:", error);
      dispatch({ type: "SET_ERROR", payload: "Erro ao atualizar sessão" });
    }
  }, [loadUserProfile]);

  React.useEffect(() => {
    let active = true;
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      
      console.log("AuthProvider: Auth state change:", event, {
        userId: session?.user?.id,
        hasSession: !!session
      });
      
      dispatch({
        type: "SET_SESSION",
        payload: { user: session?.user || null, session },
      });
      
      if (session?.user) {
        console.log("AuthProvider: User authenticated, loading profile");
        await loadUserProfile(session.user.id);
      } else {
        console.log("AuthProvider: No user, clearing profile");
        dispatch({ type: "SET_PROFILE", payload: null });
        dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: false });
      }
    });

    refreshSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile, refreshSession]);

  const signIn = async (email: string, password: string) => {
    console.log("AuthProvider: Starting sign in for:", email);
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const result = await AuthManager.login({ email, password });
      if (result.error) {
        console.error("AuthProvider: Sign in error:", result.error);
        dispatch({ type: "SET_ERROR", payload: result.error.message });
      } else {
        console.log("AuthProvider: Sign in successful");
      }
      return result;
    } catch (err: any) {
      const errorObj = new Error(err.message || "Erro durante o login");
      console.error("AuthProvider: Sign in exception:", errorObj);
      dispatch({ type: "SET_ERROR", payload: errorObj.message });
      return { data: null, error: errorObj };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const result = await AuthManager.signUp({ email, password, metadata });
      if (result.error) {
        dispatch({ type: "SET_ERROR", payload: result.error.message });
      }
      return result;
    } catch (err: any) {
      const errorObj = new Error(err.message || "Erro durante o cadastro");
      dispatch({ type: "SET_ERROR", payload: errorObj.message });
      return { data: null, error: errorObj };
    }
  };

  const signOut = async () => {
    console.log("AuthProvider: Starting sign out");
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await AuthManager.logout();
      if (!result.error) {
        console.log("AuthProvider: Sign out successful");
        dispatch({ type: "LOGOUT" });
      }
      return result;
    } catch (err: any) {
      const errorObj = new Error("Erro durante o logout");
      console.error("AuthProvider: Sign out error:", errorObj);
      return { error: errorObj };
    }
  };

  const changePasswordAndActivate = async (newPassword: string): Promise<boolean> => {
    return AuthManager.changePasswordAndActivate(newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        refreshSession,
        changePasswordAndActivate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
