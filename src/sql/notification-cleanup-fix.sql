
-- Este arquivo contém as funções de limpeza sem usar pg_cron
-- Execute manualmente no SQL Editor do Supabase se precisar recriar as funções

-- Criar índice para otimizar consultas de limpeza por data (se não existir)
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- Função para limpar notificações expiradas (mais de 120 horas)
CREATE OR REPLACE FUNCTION public.clean_expired_notifications()
RETURNS TABLE(deleted_count INTEGER, execution_time TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_rows INTEGER := 0;
  cutoff_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calcular o tempo limite (120 horas = 5 dias atrás)
  cutoff_time := NOW() - INTERVAL '120 hours';
  
  -- Deletar notificações expiradas
  DELETE FROM public.notifications 
  WHERE created_at < cutoff_time;
  
  -- Obter número de linhas deletadas
  GET DIAGNOSTICS deleted_rows = ROW_COUNT;
  
  -- Log da operação
  RAISE NOTICE 'Limpeza de notificações executada: % notificações removidas (cutoff: %)', deleted_rows, cutoff_time;
  
  -- Retornar resultado
  RETURN QUERY SELECT deleted_rows, NOW();
END;
$$;

-- Função para limpeza manual de notificações específicas por usuário (opcional)
CREATE OR REPLACE FUNCTION public.clean_user_expired_notifications(target_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_rows INTEGER := 0;
  cutoff_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calcular o tempo limite (120 horas = 5 dias atrás)
  cutoff_time := NOW() - INTERVAL '120 hours';
  
  -- Deletar notificações expiradas do usuário específico
  DELETE FROM public.notifications 
  WHERE user_id = target_user_id 
  AND created_at < cutoff_time;
  
  -- Obter número de linhas deletadas
  GET DIAGNOSTICS deleted_rows = ROW_COUNT;
  
  RETURN deleted_rows;
END;
$$;

-- Função para verificar estatísticas de notificações (útil para monitoramento)
CREATE OR REPLACE FUNCTION public.get_notifications_stats()
RETURNS TABLE(
  total_notifications BIGINT,
  notifications_last_24h BIGINT,
  notifications_last_week BIGINT,
  oldest_notification TIMESTAMP WITH TIME ZONE,
  newest_notification TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_notifications,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as notifications_last_24h,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as notifications_last_week,
    MIN(created_at) as oldest_notification,
    MAX(created_at) as newest_notification
  FROM public.notifications;
END;
$$;
