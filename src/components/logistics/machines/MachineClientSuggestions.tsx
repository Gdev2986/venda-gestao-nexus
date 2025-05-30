
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, User } from "lucide-react";
import { useMachines } from "@/hooks/use-machines";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClientSuggestion {
  suggested_client_id: string;
  suggested_client_name: string;
  confidence_score: number;
}

interface MachineClientSuggestionsProps {
  machineId: string;
  onClientAssigned: () => void;
}

export const MachineClientSuggestions: React.FC<MachineClientSuggestionsProps> = ({
  machineId,
  onClientAssigned
}) => {
  const [suggestions, setSuggestions] = useState<ClientSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState<string | null>(null);
  const { getClientSuggestions, updateMachineClient } = useMachines();
  const { toast } = useToast();

  useEffect(() => {
    loadSuggestions();
  }, [machineId]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      // Usar a função RPC do Supabase para buscar sugestões
      const { data, error } = await supabase.rpc('suggest_client_for_machine', {
        p_machine_id: machineId
      });

      if (error) {
        console.error('Error loading suggestions:', error);
        setSuggestions([]);
      } else {
        setSuggestions(data || []);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const notifyClientOfAssignment = async (clientId: string, machineSerial: string) => {
    try {
      // Get client user ID
      const { data: clientAccess, error: accessError } = await supabase
        .from('user_client_access')
        .select('user_id')
        .eq('client_id', clientId)
        .single();

      if (accessError || !clientAccess) {
        console.error('Error finding client user:', accessError);
        return;
      }

      // Get machine details
      const { data: machine, error: machineError } = await supabase
        .from('machines')
        .select('serial_number, model')
        .eq('id', machineId)
        .single();

      if (machineError || !machine) {
        console.error('Error finding machine:', machineError);
        return;
      }

      // Create notification for the client
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: clientAccess.user_id,
          title: 'Nova Máquina Vinculada',
          message: `A máquina ${machine.serial_number} (${machine.model}) foi vinculada à sua conta.`,
          type: 'LOGISTICS',
          data: {
            machine_id: machineId,
            machine_serial: machine.serial_number,
            machine_model: machine.model,
            assignment_type: 'new_assignment'
          }
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    } catch (error) {
      console.error('Error notifying client:', error);
    }
  };

  const handleAssignClient = async (clientId: string, clientName: string) => {
    setIsAssigning(clientId);
    try {
      // Atualizar a máquina com o novo cliente usando Supabase diretamente
      const { error } = await supabase
        .from('machines')
        .update({ 
          client_id: clientId,
          updated_at: new Date().toISOString()
        })
        .eq('id', machineId);

      if (error) throw error;

      // Notify the client about the new machine assignment
      await notifyClientOfAssignment(clientId, clientName);
      
      toast({
        title: "Cliente vinculado",
        description: `Máquina vinculada ao cliente ${clientName} com sucesso e cliente notificado`
      });
      onClientAssigned();
    } catch (error) {
      console.error('Error assigning client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível vincular o cliente à máquina",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              Buscando sugestões...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Sugestões de Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foram encontradas sugestões baseadas no histórico de vendas desta máquina.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Sugestões de Cliente
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Baseado no histórico de vendas
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.suggested_client_id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {suggestion.suggested_client_name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {suggestion.confidence_score} vendas
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleAssignClient(
                suggestion.suggested_client_id,
                suggestion.suggested_client_name
              )}
              disabled={isAssigning === suggestion.suggested_client_id}
            >
              {isAssigning === suggestion.suggested_client_id ? "Vinculando..." : "Vincular"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
