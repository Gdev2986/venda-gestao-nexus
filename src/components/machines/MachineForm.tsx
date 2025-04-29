
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MachineFormProps {
  machine?: any;
  onClose: () => void;
}

export function MachineForm({ machine, onClose }: MachineFormProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!machine;
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serial_number: machine?.serial_number || "",
      model: machine?.model || "",
      status: machine?.status || "ACTIVE",
      client_id: machine?.client_id || "",
    },
  });
  
  const currentStatus = watch("status");
  
  useEffect(() => {
    fetchClients();
    
    if (machine) {
      setValue("serial_number", machine.serial_number);
      setValue("model", machine.model);
      setValue("status", machine.status);
      setValue("client_id", machine.client_id);
    }
  }, [machine, setValue]);
  
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name');
        
      if (error) {
        throw error;
      }
      
      setClients(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
      });
    }
  };
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      if (isEditing) {
        // Atualizando máquina existente
        const { error } = await supabase
          .from('machines')
          .update({
            serial_number: data.serial_number,
            model: data.model,
            status: data.status,
            client_id: data.client_id || null,
            updated_at: new Date(),
          })
          .eq('id', machine.id);
          
        if (error) throw error;
        
        toast({
          title: "Máquina atualizada",
          description: "A máquina foi atualizada com sucesso.",
        });
      } else {
        // Criando nova máquina
        const { error } = await supabase
          .from('machines')
          .insert({
            serial_number: data.serial_number,
            model: data.model,
            status: data.status,
            client_id: data.client_id || null,
          });
          
        if (error) throw error;
        
        toast({
          title: "Máquina cadastrada",
          description: "A máquina foi cadastrada com sucesso.",
        });
      }
      
      reset();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar máquina:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar a máquina.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Máquina" : "Nova Máquina"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="serial_number">Número de Série</Label>
              <Input
                id="serial_number"
                {...register("serial_number", { required: "Este campo é obrigatório" })}
                placeholder="Ex: ABC-0001"
                disabled={isEditing}
              />
              {errors.serial_number && (
                <p className="text-sm text-destructive">{errors.serial_number.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                {...register("model", { required: "Este campo é obrigatório" })}
                placeholder="Ex: Modelo A"
              />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativa</SelectItem>
                  <SelectItem value="INACTIVE">Inativa</SelectItem>
                  <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                  <SelectItem value="BLOCKED">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="client_id">Cliente</Label>
              <Select
                value={watch("client_id") || ""}
                onValueChange={(value) => setValue("client_id", value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
