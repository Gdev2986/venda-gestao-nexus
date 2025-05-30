import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { updateMachine } from "@/services/machine.service";
import { Machine, MachineStatus } from "@/types/machine.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MachineTransferModal } from '@/components/machines/MachineTransferModal';
import { MachineTransferHistory } from '@/components/machines/MachineTransferHistory';
import { ArrowRightLeft } from 'lucide-react';

export interface MachineDetailsDialogProps {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
  mode?: 'view' | 'edit';
}

export const MachineDetailsDialog: React.FC<MachineDetailsDialogProps> = ({
  machine,
  open,
  onOpenChange,
  onUpdate,
  mode = 'view'
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
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    if (machine) {
      setFormData({
        serial_number: machine.serial_number || "",
        model: machine.model || "",
        status: machine.status || MachineStatus.STOCK,
        client_id: machine.client_id || "",
        notes: machine.notes || "",
      });
    }
  }, [machine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!machine) return;

    setIsSubmitting(true);
    
    try {
      await updateMachine(machine.id, formData);
      
      toast({
        title: "Sucesso",
        description: "Máquina atualizada com sucesso",
      });
      
      onUpdate?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar máquina",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  if (!machine) return null;

  const isInStock = machine.status === MachineStatus.STOCK;
  const hasClient = machine.client_id && machine.client_id !== "";
  const canEditSerialModel = isInStock || !hasClient;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Editar Máquina' : 'Detalhes da Máquina'}
            </DialogTitle>
          </DialogHeader>
          
          {mode === 'view' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Número de Série</Label>
                  <p className="text-sm">{machine.serial_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Modelo</Label>
                  <p className="text-sm">{machine.model}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <div className="mt-1">
                  {getStatusBadge(machine.status)}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Cliente</Label>
                <p className="text-sm">{machine.client?.business_name || "Não vinculada"}</p>
              </div>
              
              {machine.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Notas</Label>
                  <p className="text-sm">{machine.notes}</p>
                </div>
              )}
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <Label className="text-xs font-medium">Criado em</Label>
                  <p>{formatDate(machine.created_at)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium">Atualizado em</Label>
                  <p>{formatDate(machine.updated_at)}</p>
                </div>
              </div>

              {/* Histórico de Transferências */}
              <MachineTransferHistory machineId={machine.id} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Condicional: só permite editar série/modelo se for estoque ou sem cliente */}
              <div>
                <Label htmlFor="serial_number">Número de Série *</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  placeholder="Digite o número de série"
                  required
                  disabled={!canEditSerialModel}
                />
                {!canEditSerialModel && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Não é possível editar o número de série de máquinas com cliente vinculado
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Digite o modelo da máquina"
                  required
                  disabled={!canEditSerialModel}
                />
                {!canEditSerialModel && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Não é possível editar o modelo de máquinas com cliente vinculado
                  </p>
                )}
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

              {/* Condicional: se for estoque, permite selecionar cliente. Se já tem cliente, só permite transferir */}
              {isInStock ? (
                <div>
                  <Label htmlFor="client">Cliente</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => setFormData({ ...formData, client_id: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Manter em estoque</SelectItem>
                      {clients?.filter(c => c.status === 'ACTIVE').map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.business_name || client.contact_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : hasClient ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Cliente Atual</Label>
                  <p className="text-sm">{machine.client?.business_name}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTransferModalOpen(true)}
                    className="w-full"
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Transferir para outro cliente
                  </Button>
                </div>
              ) : null}

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações sobre a máquina"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Transferência */}
      <MachineTransferModal
        machine={machine}
        open={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
        onTransferComplete={() => {
          onUpdate?.();
          setIsTransferModalOpen(false);
        }}
      />
    </>
  );
};
