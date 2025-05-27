
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthAuditLog, SecurityEvent, EnhancedUserSession, DeviceInfo } from '@/types/auth.types';
import { useToast } from '@/hooks/use-toast';

export const useEnterpriseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  // Função para obter informações do dispositivo
  const getDeviceInfo = useCallback((): DeviceInfo => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    let browser = 'Unknown';
    let os = 'Unknown';
    
    // Detectar browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    // Detectar OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    // Gerar fingerprint simples
    const fingerprint = btoa(`${browser}-${os}-${screen.width}x${screen.height}-${navigator.language}`);
    
    return { browser, os, isMobile, userAgent, fingerprint };
  }, []);

  // Função para registrar evento de auditoria
  const logAuditEvent = useCallback(async (eventType: string, metadata: Record<string, any> = {}) => {
    if (!user) return;
    
    const deviceInfo = getDeviceInfo();
    
    try {
      await supabase
        .from('auth_audit_logs')
        .insert({
          user_id: user.id,
          event_type: eventType,
          user_agent: deviceInfo.userAgent,
          device_fingerprint: deviceInfo.fingerprint,
          metadata: {
            ...metadata,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            is_mobile: deviceInfo.isMobile,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Erro ao registrar evento de auditoria:', error);
    }
  }, [user, getDeviceInfo]);

  // Função para registrar evento de segurança
  const logSecurityEvent = useCallback(async (
    eventType: string, 
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata: Record<string, any> = {}
  ) => {
    try {
      await supabase
        .from('security_events')
        .insert({
          user_id: user?.id,
          event_type: eventType,
          severity,
          description,
          metadata: {
            ...metadata,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error);
    }
  }, [user]);

  // Função para atualizar sessão do usuário
  const updateUserSession = useCallback(async () => {
    if (!user) return;
    
    const deviceInfo = getDeviceInfo();
    const deviceId = localStorage.getItem('device_id') || 
      `device_${Math.random().toString(36).substring(2, 15)}`;
    
    if (!localStorage.getItem('device_id')) {
      localStorage.setItem('device_id', deviceId);
    }
    
    try {
      await supabase
        .from('user_sessions')
        .upsert({
          user_id: user.id,
          device_id: deviceId,
          browser_info: deviceInfo.browser,
          os_info: deviceInfo.os,
          is_mobile: deviceInfo.isMobile,
          last_active: new Date().toISOString(),
          metadata: {
            user_agent: deviceInfo.userAgent,
            fingerprint: deviceInfo.fingerprint
          }
        }, {
          onConflict: 'user_id,device_id'
        });
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
    }
  }, [user, getDeviceInfo]);

  // Função para revogar sessão
  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      await supabase
        .from('user_sessions')
        .update({
          is_revoked: true,
          revoked_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      await logAuditEvent('session_revoked', { revoked_session_id: sessionId });
      
      toast({
        title: 'Sessão revogada',
        description: 'A sessão foi revogada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao revogar sessão:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao revogar sessão.',
        variant: 'destructive',
      });
    }
  }, [logAuditEvent, toast]);

  // Função para obter role do usuário via JWT
  const getUserRoleFromJWT = useCallback((session: Session | null): string | null => {
    if (!session?.user) return null;
    
    // Tentar obter do JWT claims primeiro
    const jwtRole = session.user.app_metadata?.role;
    if (jwtRole) return jwtRole;
    
    // Fallback para user_metadata
    const userRole = session.user.user_metadata?.role;
    return userRole || null;
  }, []);

  // Configurar listener de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Obter role do JWT
        const role = getUserRoleFromJWT(session);
        setUserRole(role);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Aguardar um tick para evitar problemas de concorrência
          setTimeout(async () => {
            await updateUserSession();
            await logAuditEvent('login');
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          await logAuditEvent('logout');
          setUserRole(null);
          localStorage.removeItem('device_id');
        }
        
        if (event === 'TOKEN_REFRESHED') {
          // Atualizar role quando token é renovado
          const newRole = getUserRoleFromJWT(session);
          setUserRole(newRole);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      const role = getUserRoleFromJWT(session);
      setUserRole(role);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [getUserRoleFromJWT, updateUserSession, logAuditEvent]);

  // Atualizar sessão periodicamente
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(updateUserSession, 5 * 60 * 1000); // 5 minutos
    return () => clearInterval(interval);
  }, [user, updateUserSession]);

  return {
    user,
    session,
    isLoading,
    userRole,
    isAuthenticated: !!user,
    logAuditEvent,
    logSecurityEvent,
    revokeSession,
    getDeviceInfo
  };
};
