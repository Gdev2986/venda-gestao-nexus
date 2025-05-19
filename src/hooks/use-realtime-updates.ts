
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type TableName = 'clients' | 'machines' | 'sales' | 'payment_requests' | 'notifications';
type EventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeUpdatesProps {
  tableName: TableName;
  eventType?: EventType;
  onDataChange?: (payload: any) => void;
  showToast?: boolean;
  toastMessages?: {
    insert?: string;
    update?: string;
    delete?: string;
  };
}

export function useRealtimeUpdates({
  tableName,
  eventType = '*',
  onDataChange,
  showToast = false,
  toastMessages = {
    insert: 'Novo registro adicionado',
    update: 'Registro atualizado',
    delete: 'Registro removido',
  },
}: UseRealtimeUpdatesProps) {
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [isListening, setIsListening] = useState(true);
  const { toast } = useToast();

  // Handle data changes coming from realtime subscription
  const handleRealtimeChange = useCallback((payload: any) => {
    setLastEvent(payload);
    
    // Call the provided callback if it exists
    if (onDataChange) {
      onDataChange(payload);
    }

    // Show toast notification if enabled
    if (showToast) {
      const event = payload.eventType;
      let toastTitle = '';
      
      switch (event) {
        case 'INSERT':
          toastTitle = toastMessages.insert || 'Novo registro adicionado';
          break;
        case 'UPDATE':
          toastTitle = toastMessages.update || 'Registro atualizado';
          break;
        case 'DELETE':
          toastTitle = toastMessages.delete || 'Registro removido';
          break;
        default:
          toastTitle = 'Dado modificado';
      }

      toast({
        title: toastTitle,
        description: `Tabela ${tableName} teve alterações.`,
      });
    }
  }, [onDataChange, showToast, tableName, toast, toastMessages]);

  // Set up and tear down the realtime subscription
  useEffect(() => {
    if (!isListening) return;

    const channelName = `realtime:${tableName}:${eventType}`;
    
    // Create channel with correct syntax for Supabase JS v2
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', // This is a channel filter, not an event name
        {
          event: eventType,
          schema: 'public',
          table: tableName,
        },
        handleRealtimeChange
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, eventType, handleRealtimeChange, isListening]);

  // Function to pause/resume listening
  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  return {
    lastEvent,
    isListening,
    toggleListening,
  };
}
