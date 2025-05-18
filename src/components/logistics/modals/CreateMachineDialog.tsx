import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMachines } from "@/hooks/logistics/use-machines";
import { useClients } from "@/hooks/use-clients";
import { Machine, MachineStatus, MachineCreateParams, MachineUpdateParams } from "@/types/machine.types";

const machineFormSchema = z.object({
  serial_number: z.string().min(1, "Número de série obrigatório"),
  model: z.string().min(1, "Modelo obrigatório"),
  client_id: z.string().optional(),
  notes: z.string().optional(),
});

interface CreateMachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  machine?: Machine; // Optional machine for editing
}

export type MachineFormValues = z.infer<typeof machineFormSchema>;

const CreateMachineDialog = ({
  open,
  onOpenChange,
  onSuccess,
  machine,
}: CreateMachineDialogProps) => {
  const { toast } = useToast();
  const { addMachine, updateMachine } = useMachines({});
  const { isLoading: isLoadingClients, clients } = useClients();
  const [loading, setLoading] = useState(false);
  const [availableClients, setAvailableClients] = useState<{ id: string; business_name: string }[]>([]);
  const isEditMode = !!machine;

  // Form setup
  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: {
      serial_number: machine?.serial_number || "",
      model: machine?.model || "",
      client_id: machine?.client_id || "",
      notes: machine?.notes || "",
    },
  });

  // Update form values when machine changes (for edit mode)
  useEffect(() => {
    if (machine) {
      form.reset({
        serial_number: machine.serial_number,
        model: machine.model,
        client_id: machine.client_id || "",
        notes: machine.notes || "",
      });
    } else {
      form.reset({
        serial_number: "",
        model: "",
        client_id: "",
        notes: "",
      });
    }
  }, [machine, form, open]);

  // Load clients for the dropdown
  useEffect(() => {
    if (clients && clients.length > 0) {
      setAvailableClients(clients.map(client => ({
        id: client.id,
        business_name: client.business_name
      })));
    }
  }, [clients]);

  const onSubmit = async (values: MachineFormValues) => {
    setLoading(true);
    
    try {
      // Determine machine status based on client selection
      const status = values.client_id 
        ? MachineStatus.ACTIVE  // If client is selected, machine is active
        : MachineStatus.STOCK;  // If no client, machine is in stock
      
      if (isEditMode && machine) {
        // Update existing machine
        const updateData: MachineUpdateParams = {
          serial_number: values.serial_number,
          model: values.model,
          client_id: values.client_id || null,
          status,
          notes: values.notes
        };
        
        await updateMachine(machine.id, updateData);
        
        toast({
          title: "Máquina atualizada",
          description: "As informações da máquina foram atualizadas com sucesso.",
        });
      } else {
        // Create new machine
        const createData: MachineCreateParams = {
          serial_number: values.serial_number,
          model: values.model,
          client_id: values.client_id,
          status,
          notes: values.notes
        };
        
        await addMachine(createData);
        
        toast({
          title: "Máquina cadastrada",
          description: "A máquina foi cadastrada com sucesso.",
        });
      }
      
      // Close dialog and reset form
      onOpenChange(false);
      form.reset();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a máquina.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Máquina" : "Cadastrar Nova Máquina"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Atualize as informações da máquina abaixo."
              : "Preencha os dados para cadastrar uma nova máquina."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Série *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="SN-000123" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Número único que identifica a máquina
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo *</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Mini">Mini</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direcionar para</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none_stock">Em Estoque</SelectItem>
                      {availableClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Se nenhum cliente for selecionado, a máquina será mantida em estoque
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas / Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informações relevantes sobre a máquina" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : isEditMode ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMachineDialog;
