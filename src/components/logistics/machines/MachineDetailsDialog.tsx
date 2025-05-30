import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateMachine } from "@/services/machine.service";
import { Machine, MachineStatus } from "@/types/machine.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MachineTransferModal } from '@/components/machines/MachineTransferModal';
import { MachineTransferHistory } from '@/components/machines/MachineTransferHistory';
import { MachineClientSuggestions } from './MachineClientSuggestions';
import { ArrowRightLeft } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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
  
  const [formData, setFormData] = useState({
    serial_number: "",
    model: "",
    status: MachineStatus.STOCK,
    client_id: "",
    notes: "",
  });
  
  const [clients, setClients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  // Buscar clientes ativos
  const fetchClients = async () => {
    setIsLoadingClients(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name, contact_name, status')
        .eq('status', 'ACTIVE')
        .order('business_name', { ascending: true });

      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }

      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de clientes.",
      });
    } finally {
      setIsLoadingClients(false);
    }
  };

  useEffect(() => {
    if (machine) {
      setFormData({
        serial_number: machine.serial_number || "",
        model: machine.model || "",
        status: machine.status || MachineStatus.STOCK,
        client_id: machine.client_id || "",
        notes: machine.notes || "",
      });
      
      // Show suggestions if machine has no client assigned
      setShowSuggestions(!machine.client_id);
    }
  }, [machine]);

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

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
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">Operando</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">Em Estoque</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">Em Manutenção</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-200 dark:border-gray-700">Inativa</Badge>;
      case MachineStatus.BLOCKED:
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800">Bloqueada</Badge>;
      case MachineStatus.TRANSIT:
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">{status}</Badge>;
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

  const handleClientAssigned = () => {
    setShowSuggestions(false);
    onUpdate?.();
  };

  if (!machine) return null;

  const isInStock = machine.status === MachineStatus.STOCK;
  const hasClient = machine.client_id && machine.client_id !== "";
  const canEditSerialModel = isInStock || !hasClient;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              {mode === 'edit' ? 'Editar Máquina' : 'Detalhes da Máquina'}
            </DialogTitle>
          </DialogHeader>
          
          {mode === 'view' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Número de Série</Label>
                  <p className="text-sm dark:text-gray-200">{machine.serial_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Modelo</Label>
                  <p className="text-sm dark:text-gray-200">{machine.model}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</Label>
                <div className="mt-1">
                  {getStatusBadge(machine.status)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm dark:text-gray-200">{machine.client?.business_name || "Não vinculada"}</p>
                  {hasClient && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsTransferModalOpen(true)}
                      className="ml-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Transferir
                    </Button>
                  )}
                </div>
              </div>
              
              {machine.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notas</Label>
                  <p className="text-sm dark:text-gray-200">{machine.notes}</p>
                </div>
              )}

              {/* Show client suggestions for machines without client */}
              {showSuggestions && (
                <div>
                  <Separator className="my-4 dark:bg-gray-700" />
                  <MachineClientSuggestions
                    machineId={machine.id}
                    onClientAssigned={handleClientAssigned}
                  />
                </div>
              )}
              
              <Separator className="dark:bg-gray-700" />
              
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <Label className="text-xs font-medium">Criado em</Label>
                  <p>{formatDate(machine.created_at)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium">Atualizado em</Label>
                  <p>{formatDate(machine.updated_at)}</p>
                </div>
              </div>

              {/* Transfer History */}
              <MachineTransferHistory machineId={machine.id} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="serial_number" className="dark:text-gray-200">Número de Série *</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  placeholder="Digite o número de série"
                  required
                  disabled={!canEditSerialModel}
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                />
                {!canEditSerialModel && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Não é possível editar o número de série de máquinas com cliente vinculado
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="model" className="dark:text-gray-200">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Digite o modelo da máquina"
                  required
                  disabled={!canEditSerialModel}
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                />
                {!canEditSerialModel && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Não é possível editar o modelo de máquinas com cliente vinculado
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="status" className="dark:text-gray-200">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as MachineStatus })}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                    <SelectItem value={MachineStatus.STOCK} className="dark:text-gray-200 dark:hover:bg-gray-700">Em Estoque</SelectItem>
                    <SelectItem value={MachineStatus.ACTIVE} className="dark:text-gray-200 dark:hover:bg-gray-700">Operando</SelectItem>
                    <SelectItem value={MachineStatus.MAINTENANCE} className="dark:text-gray-200 dark:hover:bg-gray-700">Em Manutenção</SelectItem>
                    <SelectItem value={MachineStatus.INACTIVE} className="dark:text-gray-200 dark:hover:bg-gray-700">Inativa</SelectItem>
                    <SelectItem value={MachineStatus.BLOCKED} className="dark:text-gray-200 dark:hover:bg-gray-700">Bloqueada</SelectItem>
                    <SelectItem value={MachineStatus.TRANSIT} className="dark:text-gray-200 dark:hover:bg-gray-700">Em Trânsito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client assignment section with transfer button */}
              {isInStock ? (
                <div>
                  <Label htmlFor="client" className="dark:text-gray-200">Cliente</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => setFormData({ ...formData, client_id: value === "none" ? "" : value })}
                    disabled={isLoadingClients}
                  >
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                      <SelectValue placeholder={isLoadingClients ? "Carregando clientes..." : "Selecione um cliente"} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="none" className="dark:text-gray-200 dark:hover:bg-gray-700">Manter em estoque</SelectItem>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id} className="dark:text-gray-200 dark:hover:bg-gray-700">
                          {client.business_name || client.contact_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingClients && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Carregando lista de clientes...
                    </p>
                  )}
                </div>
              ) : hasClient ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente Atual</Label>
                  <p className="text-sm dark:text-gray-200">{machine.client?.business_name}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTransferModalOpen(true)}
                    className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Transferir para outro cliente
                  </Button>
                </div>
              ) : (
                showSuggestions && (
                  <MachineClientSuggestions
                    machineId={machine.id}
                    onClientAssigned={handleClientAssigned}
                  />
                )
              )}

              <div>
                <Label htmlFor="notes" className="dark:text-gray-200">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações sobre a máquina"
                  rows={3}
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="dark:bg-primary dark:text-white dark:hover:bg-primary/90">
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Transfer Modal */}
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
