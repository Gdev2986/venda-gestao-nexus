
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { supabase } from "@/integrations/supabase/client";
import { MachineStatus } from "@/types/machine.types";

interface CreateMachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateMachineDialog: React.FC<CreateMachineDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const { clients } = useClients();
  
  const [formData, setFormData] = useState({
    serial_number: "",
    model: "",
    status: MachineStatus.STOCK,
    client_id: "",
    notes: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serial_number.trim() || !formData.model.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Número de série e modelo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('machines')
        .insert({
          serial_number: formData.serial_number.trim(),
          model: formData.model.trim(),
          status: formData.status,
          client_id: formData.client_id || null,
          notes: formData.notes.trim() || null
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Máquina criada com sucesso",
      });
      
      // Reset form
      setFormData({
        serial_number: "",
        model: "",
        status: MachineStatus.STOCK,
        client_id: "",
        notes: "",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating machine:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar máquina",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Máquina</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="serial_number">Número de Série *</Label>
            <Input
              id="serial_number"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              placeholder="Digite o número de série"
              required
            />
          </div>

          <div>
            <Label htmlFor="model">Modelo *</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="Digite o modelo da máquina"
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as MachineStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MachineStatus.STOCK}>Em Estoque</SelectItem>
                <SelectItem value={MachineStatus.ACTIVE}>Operando</SelectItem>
                <SelectItem value={MachineStatus.MAINTENANCE}>Em Manutenção</SelectItem>
                <SelectItem value={MachineStatus.INACTIVE}>Inativa</SelectItem>
                <SelectItem value={MachineStatus.BLOCKED}>Bloqueada</SelectItem>
                <SelectItem value={MachineStatus.TRANSIT}>Em Trânsito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="client">Cliente</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) => setFormData({ ...formData, client_id: value === "none" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem cliente</SelectItem>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.business_name || client.contact_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações sobre a máquina..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Máquina"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
