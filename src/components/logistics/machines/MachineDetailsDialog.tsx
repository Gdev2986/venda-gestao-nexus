
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Machine, MachineStatus } from "@/types/machine.types";
import { updateMachine } from "@/services/machine.service";
import { getAllClients } from "@/services/client.service";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  business_name: string;
}

interface MachineDetailsDialogProps {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  mode: 'view' | 'edit';
}

export const MachineDetailsDialog = ({ 
  machine, 
  open, 
  onOpenChange, 
  onUpdate, 
  mode 
}: MachineDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    serial_number: '',
    model: '',
    status: MachineStatus.STOCK,
    client_id: '',
    notes: ''
  });
  const { toast } = useToast();

  const MACHINE_MODELS = [
    { value: "PagBank", label: "PagBank" },
    { value: "CeoPag", label: "CeoPag" },
    { value: "Rede", label: "Rede" }
  ];

  useEffect(() => {
    if (machine) {
      setFormData({
        serial_number: machine.serial_number || '',
        model: machine.model || '',
        status: machine.status || MachineStatus.STOCK,
        client_id: machine.client_id || '',
        notes: machine.notes || ''
      });
    }
  }, [machine]);

  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = async () => {
    try {
      const clientsData = await getAllClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleSave = async () => {
    if (!machine) return;
    
    setIsLoading(true);
    try {
      await updateMachine(machine.id, formData);
      toast({
        title: "Máquina atualizada",
        description: "As alterações foram salvas com sucesso."
      });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating machine:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800">Operando</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-100 text-blue-800">Em Estoque</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-100 text-yellow-800">Em Manutenção</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>;
      case MachineStatus.BLOCKED:
        return <Badge className="bg-red-100 text-red-800">Bloqueada</Badge>;
      case MachineStatus.TRANSIT:
        return <Badge className="bg-purple-100 text-purple-800">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClientName = () => {
    if (formData.client_id) {
      const client = clients.find(c => c.id === formData.client_id);
      return client?.business_name || "Cliente não encontrado";
    }
    return "Não Vinculada";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Máquina" : "Detalhes da Máquina"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="serial_number">Número de Série</Label>
            {isEditing ? (
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {machine?.serial_number}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="model">Modelo</Label>
            {isEditing ? (
              <Select 
                value={formData.model} 
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {MACHINE_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {machine?.model}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
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
            ) : (
              <div className="mt-1">
                {getStatusBadge(machine?.status as MachineStatus)}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="client">Cliente</Label>
            {isEditing ? (
              <Select 
                value={formData.client_id} 
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Não Vinculada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Não Vinculada</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {getClientName()}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Adicione observações sobre a máquina..."
                rows={3}
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-50 rounded-md min-h-[60px]">
                {machine?.notes || "Nenhuma observação"}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
