
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SecurityEvent, AuthAuditLog } from '@/types/auth.types';

export const useSecurityMonitoring = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuthAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unresolvedCount, setUnresolvedCount] = useState(0);

  // Buscar eventos de segurança
  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setSecurityEvents(data || []);
      setUnresolvedCount((data || []).filter(event => !event.resolved).length);
    } catch (error) {
      console.error('Erro ao buscar eventos de segurança:', error);
    }
  };

  // Buscar logs de auditoria
  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('auth_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
    }
  };

  // Resolver evento de segurança
  const resolveSecurityEvent = async (eventId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('security_events')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: userId
        })
        .eq('id', eventId);

      if (error) throw error;
      
      await fetchSecurityEvents();
      return true;
    } catch (error) {
      console.error('Erro ao resolver evento:', error);
      return false;
    }
  };

  // Detectar login suspeito
  const detectSuspiciousLogin = async (userId: string, ipAddress?: string) => {
    try {
      // Buscar logins recentes do usuário
      const { data: recentLogins } = await supabase
        .from('auth_audit_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', 'login')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (recentLogins && recentLogins.length > 5) {
        // Muitos logins em 24h
        await supabase
          .from('security_events')
          .insert({
            user_id: userId,
            event_type: 'multiple_failed_logins',
            severity: 'medium',
            description: `Múltiplos logins detectados para o usuário em 24h (${recentLogins.length} tentativas)`,
            source_ip: ipAddress,
            metadata: { login_count: recentLogins.length }
          });
      }

      // Verificar IPs diferentes
      const uniqueIPs = new Set(recentLogins?.map(log => log.ip_address).filter(Boolean));
      if (uniqueIPs.size > 3) {
        await supabase
          .from('security_events')
          .insert({
            user_id: userId,
            event_type: 'unusual_location',
            severity: 'high',
            description: `Login de múltiplos IPs detectado (${uniqueIPs.size} IPs diferentes)`,
            source_ip: ipAddress,
            metadata: { unique_ips: Array.from(uniqueIPs) }
          });
      }
    } catch (error) {
      console.error('Erro ao detectar login suspeito:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSecurityEvents(), fetchAuditLogs()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Configurar real-time para eventos de segurança
  useEffect(() => {
    const channel = supabase
      .channel('security-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events'
        },
        () => {
          fetchSecurityEvents();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auth_audit_logs'
        },
        () => {
          fetchAuditLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    securityEvents,
    auditLogs,
    isLoading,
    unresolvedCount,
    resolveSecurityEvent,
    detectSuspiciousLogin,
    refetch: () => Promise.all([fetchSecurityEvents(), fetchAuditLogs()])
  };
};
