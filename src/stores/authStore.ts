
import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  isLoading: boolean;
  authLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setAuthLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserRole: (role: UserRole | null) => void;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  userRole: null,
  isLoading: true,
  authLoading: false,
  isAuthenticated: false,
  
  setAuthLoading: (loading: boolean) => {
    set({ authLoading: loading });
  },
  
  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user 
    });
  },
  
  setSession: (session: Session | null) => {
    set({ 
      session,
      user: session?.user || null,
      isAuthenticated: !!session?.user
    });
  },
  
  setUserRole: (role: UserRole | null) => {
    set({ userRole: role });
  },
  
  signOut: async () => {
    const { setAuthLoading, setUser, setSession, setUserRole } = get();
    
    try {
      setAuthLoading(true);
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clean up any remaining auth data
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Force redirect to login after cleanup
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if signout fails
      window.location.href = '/login';
    } finally {
      setAuthLoading(false);
    }
  },
  
  initializeAuth: async () => {
    const { setUser, setSession, setUserRole } = get();
    
    try {
      set({ isLoading: true });
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        
        // Fetch user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profile?.role) {
          setUserRole(profile.role as UserRole);
        }
      } else {
        setSession(null);
        setUser(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setSession(null);
      setUser(null);
      setUserRole(null);
    } finally {
      set({ isLoading: false });
    }
  },
}));
