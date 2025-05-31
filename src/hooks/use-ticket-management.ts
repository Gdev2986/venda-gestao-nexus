
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { updateTicket } from "@/services/support/ticket-api";
import { SupportTicket, TicketStatus } from "@/types/support.types";

export const useTicketManagement = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Update ticket status
  const updateTicketStatus = useCallback(async (ticketId: string, status: TicketStatus): Promise<void> => {
    setIsUpdating(true);
    try {
      const { data, error } = await updateTicket(ticketId, { status });
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Status do ticket atualizado",
      });
    } catch (error) {
      console.error('Erro ao atualizar status do ticket:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do ticket",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [toast]);

  // Assign ticket to current user (admin/logistics)
  const assignTicketToMe = useCallback(async (ticketId: string): Promise<void> => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    try {
      const { data, error } = await updateTicket(ticketId, { 
        assigned_to: user.id,
        status: TicketStatus.IN_PROGRESS
      });
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Você assumiu o atendimento deste ticket",
      });
    } catch (error) {
      console.error('Erro ao assumir ticket:', error);
      toast({
        title: "Erro",
        description: "Não foi possível assumir o ticket",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [user?.id, toast]);

  return {
    isUpdating,
    updateTicketStatus,
    assignTicketToMe
  };
};
