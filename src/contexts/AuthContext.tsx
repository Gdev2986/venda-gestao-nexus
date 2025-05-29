import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { AuthManager } from "@/services/AuthManager";
import {
  AuthState,
  AuthAction,
  AuthContextType,
  UserProfile,
} from "./auth-types";

// Estado inicial
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

// Reducer
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

// Context + Hook
export const AuthContext = React.createContext<AuthContextType>({
  ...initialState,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  refreshSession: async () => {},
  changePasswordAndActivate: async () => false,
});
export const useAuth = () => React.useContext(AuthContext);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  const [timeoutId, setTimeoutId] = React.useState<number>();

  // Busca perfil + role com retry
  const loadUserProfile = React.useCallback(
    async (userId: string) => {
      if (timeoutId) clearTimeout(timeoutId);
      for (let i = 0; i < 10; i++) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (!error && data?.role) {
          const profile: UserProfile = { ...data, role: data.role as UserRole };
          dispatch({ type: "SET_PROFILE", payload: profile });
          const needs = await AuthManager.needsPasswordChange(userId);
          dispatch({ type: "SET_NEEDS_PASSWORD_CHANGE", payload: needs });
          return;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      // se falhar
      await supabase.auth.signOut();
      dispatch({ type: "LOGOUT" });
    },
    [timeoutId]
  );

  // Atualiza sessão + dispara perfil
  const refreshSession = React.useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { session, user, error } = await AuthManager.getCurrentSession();
      if (error) throw error;
      dispatch({ type: "SET_SESSION", payload: { user, session } });
      if (user) loadUserProfile(user.id);
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Erro ao atualizar sessão" });
    }
  }, [loadUserProfile]);

  // Listener de auth
  React.useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_, sess) => {
      dispatch({ type: "SET_SESSION", payload: { user: sess?.user || null, session: sess } });
      if (sess?.user) loadUserProfile(sess.user.id);
    }).subscription;

    // inicia ao montar
    refreshSession();

    return () => {
      sub.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Métodos de sign in / up / out
  const signIn = async (email: string, pass: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const res = await AuthManager.login({ email, password: pass });
    if (res.error) dispatch({ type: "SET_ERROR", payload: res.error.message });
    return res;
  };
  const signUp = async (email: string, pass: string, md?: any) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const res = await AuthManager.signUp({ email, password: pass, metadata: md });
    if (res.error) dispatch({ type: "SET_ERROR", payload: res.error.message });
    return res;
  };
  const signOut = async () => {
    await AuthManager.logout();
    dispatch({ type: "LOGOUT" });
  };
  const changePasswordAndActivate = (pw: string) =>
    AuthManager.changePasswordAndActivate(pw);

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
