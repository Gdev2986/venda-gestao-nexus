// src/providers/AuthProvider.tsx
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
        isLoading: false,
        error: null,
      };
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload,
        userRole: action.payload?.role || null,
      };
    case "SET_NEEDS_PASSWORD_CHANGE":
      return { ...state, needsPasswordChange: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "LOGOUT":
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
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  const [roleLoadingTimeout, setRoleLoadingTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const loadUserProfile = React.useCallback(
    async (userId: string) => {
      try {
        if (roleLoadingTimeout) clearTimeout(roleLoadingTimeout);
        await new Promise((r) => setTimeout(r, 500));
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error || !data) {
          const timeout = setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .single();
            if (!retryError && retryData) {
              const userProfile: UserProfile = {
                ...retryData,
                role: retryData.role as UserRole,
              };
              dispatch({ type: "SET_PROFILE", payload: userProfile });
              const needsChange = await AuthManager.needsPasswordChange(userId);
              dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: needsChange });
            } else {
              dispatch({
                type: "SET_ERROR",
                payload: "Erro ao carregar perfil do usuário",
              });
            }
          }, 1000);
          setRoleLoadingTimeout(timeout);
          return;
        }

        const userProfile: UserProfile = {
          ...data,
          role: data.role as UserRole,
        };
        dispatch({ type: "SET_PROFILE", payload: userProfile });
        const needsChange = await AuthManager.needsPasswordChange(userId);
        dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: needsChange });
      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Erro ao carregar perfil do usuário",
        });
      }
    },
    [roleLoadingTimeout]
  );

  const refreshSession = React.useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { session, user, error } = await AuthManager.getCurrentSession();
      if (error) throw error;
      dispatch({ type: "SET_SESSION", payload: { user, session } });
      if (user) setTimeout(() => loadUserProfile(user.id), 300);
      else {
        dispatch({ type: "SET_PROFILE", payload: null });
        dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: false });
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Erro ao atualizar sessão" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [loadUserProfile]);

  React.useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!active) return;
      dispatch({
        type: "SET_SESSION",
        payload: { user: newSession?.user || null, session: newSession },
      });
      if (newSession?.user) setTimeout(() => loadUserProfile(newSession.user.id), 600);
      else {
        dispatch({ type: "SET_PROFILE", payload: null });
        dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: false });
      }
    });
    setTimeout(() => {
      if (active) refreshSession();
    }, 100);
    return () => {
      active = false;
      subscription.unsubscribe();
      if (roleLoadingTimeout) clearTimeout(roleLoadingTimeout);
    };
  }, []);

  React.useEffect(
    () => () => roleLoadingTimeout && clearTimeout(roleLoadingTimeout),
    [roleLoadingTimeout]
  );

  const signIn = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const result = await AuthManager.login({ email, password });
      if (result.error) dispatch({ type: "SET_ERROR", payload: result.error.message });
      return result;
    } catch (err: any) {
      const msg = err.message || "Erro durante o login";
      dispatch({ type: "SET_ERROR", payload: msg });
      return { data: null, error: { message: msg } };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const result = await AuthManager.signUp({ email, password, metadata });
      if (result.error) dispatch({ type: "SET_ERROR", payload: result.error.message });
      return result;
    } catch (err: any) {
      const msg = err.message || "Erro durante o cadastro";
      dispatch({ type: "SET_ERROR", payload: msg });
      return { data: null, error: { message: msg } };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const signOut = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      if (roleLoadingTimeout) clearTimeout(roleLoadingTimeout);
      const result = await AuthManager.logout();
      if (!result.error) dispatch({ type: "LOGOUT" });
      return result;
    } catch {
      return { error: { message: "Erro durante o logout" } };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
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
