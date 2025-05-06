
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { saveMachine } from "@/hooks/use-machines";

const formSchema = z.object({
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  clientId: z.string().optional(),
});

interface MachineFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine?: any; // For editing existing machine
  onSave: (machine: any) => void;
}

const MachineFormModal = ({ open, onOpenChange, machine, onSave }: MachineFormModalProps) => {
  const { toast } = useToast();
  const { clients } = useClients();
  
  // Reset form when modal opens or closes
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNumber: machine?.serialNumber || "",
      model: machine?.model || "",
      status: machine?.status || "ACTIVE",
      clientId: machine?.clientId || undefined,
    },
  });
  
  // Reset form when modal opens with new data
  React.useEffect(() => {
    if (open) {
      form.reset({
        serialNumber: machine?.serialNumber || "",
        model: machine?.model || "",
        status: machine?.status || "ACTIVE",
        clientId: machine?.clientId || undefined,
      });
    }
  }, [open, machine, form]);
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const savedMachine = await saveMachine(data);
      
      toast({
        title: "Máquina salva com sucesso",
        description: "A máquina foi adicionada ao sistema.",
      });
      
      onSave(savedMachine);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a máquina. Tente novamente.",
      });
      console.error(error);
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Ensure clean state when closing the modal
      if (!isOpen) {
        // Small delay to allow animation to complete
        setTimeout(() => {
          form.reset();
        }, 100);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {machine ? "Editar Máquina" : "Cadastrar Nova Máquina"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da máquina abaixo. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Série/ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: SN1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Terminal Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Operando</SelectItem>
                      <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                      <SelectItem value="INACTIVE">Parada</SelectItem>
                      <SelectItem value="REPLACEMENT_REQUESTED">Troca Solicitada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum (estoque)</SelectItem>
                      {clients?.map((client: any) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MachineFormModal;
