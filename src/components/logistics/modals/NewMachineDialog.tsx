
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/use-clients";
import { useMachines } from "@/hooks/logistics/use-machines";
import { useAuth } from "@/hooks/use-auth";
import { MachineStatus } from "@/types/machine.types";
import { useToast } from "@/hooks/use-toast";

interface NewMachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const NewMachineDialog = ({ open, onOpenChange, onSuccess }: NewMachineDialogProps) => {
  const { createMachine } = useMachines();
  const { clients, isLoading: isClientsLoading } = useClients();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState<string>("STOCK"); // Use string instead of enum
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [observations, setObservations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setSerialNumber("");
    setModel("");
    setStatus("STOCK");
    setClientId(undefined);
    setObservations("");
    setErrors({});
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!serialNumber.trim()) {
      newErrors.serialNumber = "O número de série é obrigatório";
    }
    
    if (!model.trim()) {
      newErrors.model = "O modelo é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // If status is not STOCK, we need a client
      if (status !== "STOCK" && !clientId) {
        setErrors({
          ...errors,
          clientId: "Selecione um cliente para máquinas que não estão em estoque"
        });
        setIsSubmitting(false);
        return;
      }
      
      // If status is STOCK, clear client selection
      const finalClientId = status === "STOCK" ? undefined : clientId;
      
      await createMachine({
        serial_number: serialNumber,
        model,
        status: status as any, // Cast to satisfy type requirements
        client_id: finalClientId,
        notes: observations
      });
      
      resetForm();
      onOpenChange(false);
      if (onSuccess) onSuccess();
      
      toast({
        title: "Máquina cadastrada com sucesso",
        description: `A máquina ${serialNumber} foi adicionada ao sistema.`,
      });
    } catch (error: any) {
      console.error("Error creating machine:", error);
      toast({
        title: "Erro ao cadastrar máquina",
        description: error.message || "Ocorreu um erro ao cadastrar a máquina",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Máquina</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="serial-number" className={errors.serialNumber ? "text-destructive" : ""}>
              Número de Série *
            </Label>
            <Input
              id="serial-number"
              placeholder="Ex: SN-123456"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className={errors.serialNumber ? "border-destructive" : ""}
            />
            {errors.serialNumber && (
              <p className="text-xs text-destructive">{errors.serialNumber}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="model" className={errors.model ? "text-destructive" : ""}>
              Modelo *
            </Label>
            <Input
              id="model"
              placeholder="Ex: Terminal Pro"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={errors.model ? "border-destructive" : ""}
            />
            {errors.model && (
              <p className="text-xs text-destructive">{errors.model}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="status">Status Inicial</Label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STOCK">Em Estoque</SelectItem>
                <SelectItem value="ACTIVE">Operando</SelectItem>
                <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                <SelectItem value="INACTIVE">Inativa</SelectItem>
                <SelectItem value="TRANSIT">Em Trânsito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {status !== "STOCK" && (
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="client" className={errors.clientId ? "text-destructive" : ""}>
                Cliente
              </Label>
              <Select
                value={clientId}
                onValueChange={setClientId}
                disabled={isClientsLoading}
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-xs text-destructive">{errors.clientId}</p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="observations">Observações (opcional)</Label>
            <Textarea
              id="observations"
              placeholder="Informações adicionais sobre a máquina"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar Máquina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMachineDialog;
