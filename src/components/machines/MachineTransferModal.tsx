
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/use-clients';
import { transferMachine } from '@/services/machine.service';
import { Machine } from '@/types/machine.types';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface MachineTransferModalProps {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransferComplete?: () => void;
}

export const MachineTransferModal: React.FC<MachineTransferModalProps> = ({
  machine,
  open,
  onOpenChange,
  onTransferComplete
}) => {
  const { toast } = useToast();
  const { clients } = useClients();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    to_client_id: "",
    cutoff_date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM format
    notes: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notifyClientOfTransfer = async (clientId: string, machineSerial: string, notes?: string) => {
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

      // Create notification for the client
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: clientAccess.user_id,
          title: 'Nova Máquina Transferida',
          message: `A máquina ${machineSerial} foi transferida para sua conta.${notes ? ` Observações: ${notes}` : ''}`,
          type: 'LOGISTICS',
          data: {
            machine_id: machine?.id,
            machine_serial: machineSerial,
            transfer_type: 'received',
            notes: notes
          }
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    } catch (error) {
      console.error('Error notifying client:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!machine || !formData.to_client_id) {
      toast({
        title: "Erro",
        description: "Selecione um cliente de destino",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await transferMachine({
        machine_id: machine.id,
        from_client_id: machine.client_id || null,
        to_client_id: formData.to_client_id,
        cutoff_date: new Date(formData.cutoff_date).toISOString(),
        created_by: user?.id || null,
        notes: formData.notes
      });

      // Notify the client about the transfer
      await notifyClientOfTransfer(formData.to_client_id, machine.serial_number, formData.notes);
      
      toast({
        title: "Sucesso",
        description: "Máquina transferida com sucesso e cliente notificado",
      });
      
      onTransferComplete?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        to_client_id: "",
        cutoff_date: new Date().toISOString().slice(0, 16),
        notes: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao transferir máquina",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentClient = machine?.client;
  const availableClients = clients?.filter(client => 
    client.id !== machine?.client_id && client.status === 'ACTIVE'
  ) || [];

  if (!machine) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">Máquina</Label>
            <p className="text-sm font-medium">{machine.serial_number} - {machine.model}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">Cliente Atual</Label>
            <p className="text-sm">{currentClient?.business_name || "Em Estoque"}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to_client">Novo Cliente *</Label>
            <Select
              value={formData.to_client_id}
              onValueChange={(value) => setFormData({ ...formData, to_client_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente de destino" />
              </SelectTrigger>
              <SelectContent>
                {availableClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.business_name || client.contact_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cutoff_date">Data de Corte *</Label>
            <Input
              id="cutoff_date"
              type="datetime-local"
              value={formData.cutoff_date}
              onChange={(e) => setFormData({ ...formData, cutoff_date: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Vendas antes desta data pertencerão ao cliente atual. Vendas após esta data pertencerão ao novo cliente.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Motivo da transferência, observações..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Estas observações serão incluídas na notificação enviada ao cliente.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Transferindo..." : "Transferir"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
