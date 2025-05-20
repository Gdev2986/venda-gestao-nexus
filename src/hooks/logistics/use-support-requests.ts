import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  SupportRequest,
  createSupportRequest,
  updateSupportRequest,
  getSupportRequests
} from "@/services/support-request";
import { UserRole } from "@/types";
import { playNotificationSoundIfEnabled } from "@/services/notificationSoundService";
import { NotificationType } from "@/types/notification.types";
import { TicketStatus, TicketType, TicketPriority } from "@/types/support-ticket.types";

interface UseSupportRequestsOptions {
  enableRealtime?: boolean;
  initialFetch?: boolean;
  filters?: {
    status?: TicketStatus;
    type?: TicketType;
    priority?: TicketPriority;
    client_id?: string;
    technician_id?: string;
    date_from?: string;
    date_to?: string;
  };
}

export function useSupportRequests(options: UseSupportRequestsOptions = {}) {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Load sound preference from localStorage on initial load
  useEffect(() => {
    const savedSoundPreference = localStorage.getItem("notification_sound_enabled");
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === "true");
    }
  }, []);
  
  const fetchRequests = useCallback(async (filters = options.filters) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let requestFilters = { ...filters };
      
      // If user is a client, only show their requests
      if (profile?.role === UserRole.CLIENT) {
        const { data: clientData } = await supabase
          .from('user_client_access')
          .select('client_id')
          .eq('user_id', user.id)
          .single();
          
        if (clientData) {
          requestFilters.client_id = clientData.client_id;
        }
      }
      
      const { data, error } = await getSupportRequests(requestFilters);
      
      if (error) throw error;
      
      setRequests(data || []);
    } catch (err: any) {
      console.error('Error fetching support requests:', err);
      setError(err.message || 'Failed to fetch support requests');
      toast({
        title: 'Error',
        description: 'Failed to fetch support requests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, profile, options.filters, toast]);
  
  // Initial fetch
  useEffect(() => {
    if (options.initialFetch) {
      fetchRequests();
    }
  }, [fetchRequests, options.initialFetch]);
  
  // Set up realtime subscription
  useEffect(() => {
    if (!options.enableRealtime || !user) return;
    
    const channel = supabase
      .channel('support-requests-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'support_requests'
        },
        (payload) => {
          console.log('Support request change received:', payload);
          
          // Refresh the list when there's any change
          fetchRequests();
          
          // Show toast notifications for new requests
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'Nova Solicitação',
              description: 'Uma nova solicitação técnica foi criada',
              variant: 'default',
            });
            
            // Play notification sound
            playNotificationSoundIfEnabled(NotificationType.SUPPORT, soundEnabled);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchRequests, options.enableRealtime, toast, soundEnabled]);
  
  // Function to create a new support request
  const createRequest = async (request: Omit<SupportRequest, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await createSupportRequest(request as SupportRequest);
      
      if (error) throw error;
      
      toast({
        title: 'Solicitação Criada',
        description: 'Sua solicitação foi criada com sucesso',
      });
      
      fetchRequests();
      return data;
    } catch (err: any) {
      console.error('Error creating support request:', err);
      setError(err.message || 'Failed to create support request');
      toast({
        title: 'Error',
        description: 'Failed to create support request',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update a support request
  const updateRequest = async (id: string, updates: Partial<SupportRequest>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await updateSupportRequest(id, updates);
      
      if (error) throw error;
      
      toast({
        title: 'Solicitação Atualizada',
        description: 'A solicitação foi atualizada com sucesso',
      });
      
      fetchRequests();
      return data;
    } catch (err: any) {
      console.error('Error updating support request:', err);
      setError(err.message || 'Failed to update support request');
      toast({
        title: 'Error',
        description: 'Failed to update support request',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPendingRequestsCount = useCallback(() => {
    return requests.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length;
  }, [requests]);
  
  return {
    requests,
    isLoading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    getPendingRequestsCount
  };
}
