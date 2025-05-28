
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { AuthManager } from "@/services/AuthManager";
import { AuthState, AuthAction, AuthContextType, UserProfile } from "./auth-types";

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

// Reducer para gerenciar estado
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SESSION':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: !!action.payload.user && !!action.payload.session,
        isLoading: false,
        error: null,
      };
    
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        userRole: action.payload?.role || null,
      };
    
    case 'SET_NEEDS_PASSWORD_CHANGE':
      return { ...state, needsPasswordChange: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

// Context
export const AuthContext = React.createContext<AuthContextType>({
  ...initialState,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  refreshSession: async () => {},
  changePasswordAndActivate: async () => false,
});

// Hook para usar o context
export const useAuth = () => React.useContext(AuthContext);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  // Carregar perfil do usuário
  const loadUserProfile = React.useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          phone: data.phone,
          created_at: data.created_at,
          status: data.status
        };
        
        dispatch({ type: 'SET_PROFILE', payload: userProfile });
        
        // Verificar se precisa trocar senha
        const needsChange = await AuthManager.needsPasswordChange(userId);
        dispatch({ type: 'SET_NEEDS_PASSWORD_CHANGE', payload: needsChange });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      dispatch({ type: 'SET_ERROR', payload: "Erro ao carregar perfil do usuário" });
    }
  }, []);

  // Refresh da sessão
  const refreshSession = React.useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { session, user, error } = await AuthManager.getCurrentSession();
      
      if (error) throw error;
      
      dispatch({ type: 'SET_SESSION', payload: { user, session } });
      
      if (user) {
        // Usar setTimeout para evitar deadlocks
        setTimeout(async () => {
          await loadUserProfile(user.id);
        }, 0);
      } else {
        dispatch({ type: 'SET_PROFILE', payload: null });
        dispatch({ type: 'SET_NEEDS_PASSWORD_CHANGE', payload: false });
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      dispatch({ type: 'SET_ERROR', payload: "Erro ao atualizar sessão" });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadUserProfile]);

  // Setup inicial e listener de auth
  React.useEffect(() => {
    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        
        dispatch({ type: 'SET_SESSION', payload: { 
          user: newSession?.user || null, 
          session: newSession 
        }});
        
        if (newSession?.user) {
          // Usar setTimeout para evitar deadlocks
          setTimeout(async () => {
            await loadUserProfile(newSession.user.id);
          }, 0);
        } else {
          dispatch({ type: 'SET_PROFILE', payload: null });
          dispatch({ type: 'SET_NEEDS_PASSWORD_CHANGE', payload: false });
        }
      }
    );

    // Verificar sessão existente
    refreshSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserProfile, refreshSession]);

  // Implementar métodos de auth
  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const result = await AuthManager.login({ email, password });
      
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error.message });
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Erro durante o login";
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { data: null, error: { message: errorMessage } };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const result = await AuthManager.signUp({ email, password, metadata });
      
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error.message });
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Erro durante o cadastro";
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { data: null, error: { message: errorMessage } };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signOut = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await AuthManager.logout();
      
      if (!result.error) {
        dispatch({ type: 'LOGOUT' });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error during sign out:", error);
      return { error: { message: "Erro durante o logout" } };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const changePasswordAndActivate = async (newPassword: string): Promise<boolean> => {
    return AuthManager.changePasswordAndActivate(newPassword);
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
    changePasswordAndActivate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
