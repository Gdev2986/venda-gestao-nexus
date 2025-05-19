
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

// Generate a unique device ID for session management
export const getDeviceId = (): string => {
  let deviceId = sessionStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// Track user session in our database
export const trackUserSession = async (userId: string): Promise<void> => {
  try {
    const deviceId = getDeviceId();
    await supabase.from('user_sessions').upsert({
      user_id: userId,
      device_id: deviceId,
      last_active: new Date().toISOString(),
      metadata: {
        user_agent: navigator.userAgent,
      }
    }, { onConflict: 'user_id, device_id' });
  } catch (error) {
    console.error("Error tracking session:", error);
  }
};

// Get current session
export const getCurrentSession = async (): Promise<{ 
  session: Session | null; 
  user: User | null; 
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      return { session: null, user: null, error };
    }
    
    // Update the last_active timestamp for the session
    if (data.session?.user) {
      await trackUserSession(data.session.user.id);
    }
    
    return { 
      session: data.session, 
      user: data.session?.user ?? null, 
      error: null 
    };
  } catch (error) {
    console.error("Error during session check:", error);
    return { 
      session: null, 
      user: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

// Fetch user role directly from database
export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data?.role as UserRole || null;
  } catch (error) {
    console.error('Exception fetching user role:', error);
    return null;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<{
  user: User | null;
  error: Error | null;
}> => {
  try {
    // Clear existing auth data before sign in
    clearAllAuthData();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      let errorMessage = "An error occurred during authentication";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
      } else if (error.message.includes("Database error")) {
        errorMessage = "Erro de conexão com o servidor. Tente novamente mais tarde.";
      }
      
      return { user: null, error: new Error(errorMessage) };
    }
    
    return { user: data.user, error: null };
  } catch (error) {
    console.error("Error during login:", error);
    return { 
      user: null, 
      error: error instanceof Error ? error : new Error("Unknown error during login") 
    };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: { name: string }
): Promise<{
  user: User | null;
  error: Error | null;
}> => {
  try {
    // Clear existing auth data before sign up
    clearAllAuthData();
    
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

    if (error) {
      let errorMessage = "Ocorreu um erro durante o cadastro";
      
      if (error.message.includes("already registered")) {
        errorMessage = "Este email já está registrado. Tente fazer login.";
      }
      
      return { user: null, error: new Error(errorMessage) };
    }
    
    return { user: data?.user || null, error: null };
  } catch (error) {
    console.error("Error during registration:", error);
    return { 
      user: null, 
      error: error instanceof Error ? error : new Error("Unknown error during registration") 
    };
  }
};

// Sign out
export const signOutUser = async (): Promise<{ error: Error | null }> => {
  try {
    // Clear auth data first
    clearAllAuthData();
    
    // Attempt global sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      console.error("Error during sign out:", error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Error during sign out:", error);
    return { 
      error: error instanceof Error ? error : new Error("Unknown error during sign out") 
    };
  }
};

// Clear all authentication data from storage
export const clearAuthData = (): void => {
  clearAllAuthData();
};

// Helper function to clear all auth data
export const clearAllAuthData = (): void => {
  try {
    // Clear session data
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    localStorage.removeItem('userRole');
    
    // Remove all Supabase auth related items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log("Auth data cleared");
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};
