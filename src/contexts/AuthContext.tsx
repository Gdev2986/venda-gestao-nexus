
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthState, SignInCredentials, SignUpCredentials, UserProfile } from './auth-types';
import { PATHS } from '@/routes/paths';
import { UserRole } from '@/types';

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
};

export const AuthContext = createContext<AuthState>(initialState);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(initialState.user);
  const [profile, setProfile] = useState<UserProfile | null>(initialState.profile);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);

          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Erro ao buscar perfil:", profileError);
            toast.error('Erro ao buscar perfil', {
              description: profileError.message,
            });
          } else if (profileData) {
            // Convert database role to UserRole enum
            const userRole = profileData.role as UserRole;
            setProfile({
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: userRole,
              avatar_url: profileData.avatar,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
              phone: profileData.phone
            });
          }
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error("Erro ao obter sessão:", error);
        toast.error('Erro ao obter sessão', {
          description: error.message,
        });
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        setIsAuthenticated(true);

        // Fetch user profile
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Erro ao buscar perfil:", profileError);
            toast.error('Erro ao buscar perfil', {
              description: profileError.message,
            });
          } else if (profileData) {
            // Convert database role to UserRole enum
            const userRole = profileData.role as UserRole;
            setProfile({
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: userRole,
              avatar_url: profileData.avatar,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
              phone: profileData.phone
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user || null);
        setIsAuthenticated(!!session?.user);

        // Refetch user profile
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Erro ao buscar perfil:", profileError);
            toast.error('Erro ao buscar perfil', {
              description: profileError.message,
            });
          } else if (profileData) {
            // Convert database role to UserRole enum
            const userRole = profileData.role as UserRole;
            setProfile({
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: userRole,
              avatar_url: profileData.avatar,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
              phone: profileData.phone
            });
          }
        }
      }
    });
  }, [navigate]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Convert UserRole enum to string if present
      const dbUpdates = {
        ...updates,
        role: updates.role ? updates.role.toString() : undefined
      };

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        toast.error('Erro ao atualizar perfil', {
          description: error.message,
        });
        return { error };
      }

      // Update local profile state
      setProfile((prevProfile) => prevProfile ? { ...prevProfile, ...updates } : null);
      toast.success('Perfil atualizado com sucesso');
      return { error: null };
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil', {
        description: error.message,
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials,
        },
      });

      if (error) {
        toast.error('Erro ao criar conta', {
          description: error.message,
        });
        return { error };
      }

      // Create profile after signup (not applicable if using RLS policies)
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: credentials.email,
          name: credentials.name || "",
          role: credentials.role || UserRole.CLIENT
        });

        toast.success('Conta criada com sucesso', {
          description: 'Verifique seu email para confirmar seu cadastro.',
        });
      }

      return { error: null };
    } catch (error: any) {
      toast.error('Erro ao criar conta', {
        description: error.message,
      });
      return { error };
    }
  };

  const signIn = async (credentials: SignInCredentials) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        toast.error('Erro ao fazer login', {
          description: error.message,
        });
        return { error };
      }

      // After login, redirect to the appropriate dashboard based on user role
      if (data.user) {
        // Use HOME instead of DASHBOARD
        navigate(PATHS.HOME);
        toast.success('Login realizado com sucesso');
      }

      return { error: null };
    } catch (error: any) {
      toast.error('Erro ao fazer login', {
        description: error.message,
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      // Redirect to home page after logout
      navigate(PATHS.HOME);
      toast.info('Logout realizado com sucesso');
    } catch (error: any) {
      toast.error('Erro ao fazer logout', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthState = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
