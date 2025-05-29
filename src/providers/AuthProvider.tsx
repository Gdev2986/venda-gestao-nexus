
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
      
      // Persist role in localStorage
      if (role) {
        localStorage.setItem('userRole', role);
      } else {
        localStorage.removeItem('userRole');
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
      console.log("Loading user profile for:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        if (error.code === 'PGRST116') {
          console.log("Profile not found, creating default profile");
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
            console.error("Error creating profile:", createError);
            dispatch({ type: "SET_ERROR", payload: "Erro ao criar perfil do usuário" });
            return;
          }
          
          const userProfile: UserProfile = {
            ...newProfile,
            role: newProfile.role as UserRole,
          };
          dispatch({ type: "SET_PROFILE", payload: userProfile });
          return;
        }
        
        dispatch({ type: "SET_ERROR", payload: "Erro ao carregar perfil do usuário" });
        return;
      }

      if (data) {
        console.log("Profile loaded successfully:", data);
        
        if (data.status === 'pending_activation') {
          console.log("Activating user...");
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ status: 'active' })
            .eq("id", userId);
            
          if (updateError) {
            console.error("Error activating user:", updateError);
          } else {
            data.status = 'active';
          }
        }
        
        const userProfile: UserProfile = {
          ...data,
          role: data.role as UserRole,
        };
        console.log("Setting user profile with role:", userProfile.role);
        dispatch({ type: "SET_PROFILE", payload: userProfile });
        
        const needsChange = await AuthManager.needsPasswordChange(userId);
        dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: needsChange });
      }
    } catch (error) {
      console.error("Exception loading profile:", error);
      dispatch({ type: "SET_ERROR", payload: "Erro ao carregar perfil do usuário" });
    }
  }, []);

  const refreshSession = React.useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { session, user, error } = await AuthManager.getCurrentSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        dispatch({ type: "SET_SESSION", payload: { user: null, session: null } });
        dispatch({ type: "SET_PROFILE", payload: null });
        return;
      }
      
      dispatch({ type: "SET_SESSION", payload: { user, session } });
      
      if (user) {
        console.log("User found, loading profile for:", user.id);
        await loadUserProfile(user.id);
      } else {
        dispatch({ type: "SET_PROFILE", payload: null });
        dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: false });
      }
    } catch (error) {
      console.error("Error in refreshSession:", error);
      dispatch({ type: "SET_ERROR", payload: "Erro ao atualizar sessão" });
    }
  }, [loadUserProfile]);

  React.useEffect(() => {
    let active = true;
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      
      console.log("Auth state change:", event, session?.user?.id);
      
      dispatch({
        type: "SET_SESSION",
        payload: { user: session?.user || null, session },
      });
      
      if (session?.user) {
        console.log("User authenticated, loading profile");
        await loadUserProfile(session.user.id);
      } else {
        console.log("No user, clearing profile");
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
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const result = await AuthManager.login({ email, password });
      if (result.error) {
        dispatch({ type: "SET_ERROR", payload: result.error.message });
      }
      return result;
    } catch (err: any) {
      const errorObj = new Error(err.message || "Erro durante o login");
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
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await AuthManager.logout();
      if (!result.error) {
        dispatch({ type: "LOGOUT" });
      }
      return result;
    } catch (err: any) {
      const errorObj = new Error("Erro durante o logout");
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
