
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MachineStatus } from "@/types/machine.types";

interface CreateMachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateMachineDialog = ({ open, onOpenChange, onSuccess }: CreateMachineDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState<MachineStatus>(MachineStatus.STOCK);
  const [notes, setNotes] = useState("");
  
  const resetForm = () => {
    setSerialNumber("");
    setModel("");
    setStatus(MachineStatus.STOCK);
    setNotes("");
  };
  
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serialNumber || !model) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o número de série e o modelo.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('machines')
        .insert({
          serial_number: serialNumber,
          model: model,
          status: status,
          notes: notes
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Máquina cadastrada com sucesso",
        description: `A máquina ${serialNumber} foi adicionada ao sistema.`
      });
      
      resetForm();
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("Error saving machine:", error);
      
      toast({
        title: "Erro ao cadastrar máquina",
        description: error.message || "Ocorreu um erro ao cadastrar a máquina.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Máquina</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Número de Série *</Label>
            <Input
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Ex: SN-123456"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Modelo *</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Terminal Pro">Terminal Pro</SelectItem>
                <SelectItem value="Terminal Standard">Terminal Standard</SelectItem>
                <SelectItem value="Terminal Mini">Terminal Mini</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as MachineStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MachineStatus.STOCK}>Em Estoque</SelectItem>
                <SelectItem value={MachineStatus.ACTIVE}>Operando</SelectItem>
                <SelectItem value={MachineStatus.MAINTENANCE}>Em Manutenção</SelectItem>
                <SelectItem value={MachineStatus.INACTIVE}>Inativa</SelectItem>
                <SelectItem value={MachineStatus.TRANSIT}>Em Trânsito</SelectItem>
                <SelectItem value={MachineStatus.BLOCKED}>Bloqueada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações adicionais sobre a máquina"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMachineDialog;
