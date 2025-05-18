
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MachineStatus } from "@/services/machine.service";
import { useMachines } from "@/hooks/logistics/use-machines";

interface NewMachineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const formSchema = z.object({
  serial_number: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "STOCK", "TRANSIT"] as const),
  client_id: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewMachineDialog: React.FC<NewMachineDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addMachine } = useMachines();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serial_number: "",
      model: "",
      status: "STOCK",
      client_id: undefined,
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    try {
      await addMachine({
        serial_number: data.serial_number,
        model: data.model,
        status: data.status as MachineStatus,
        client_id: data.client_id,
      });
      
      form.reset();
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        // Reset form when dialog closes
        form.reset();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Máquina</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar uma nova máquina ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Série</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: SN-10xxxx" {...field} />
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
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Terminal Pro">Terminal Pro</SelectItem>
                        <SelectItem value="Terminal Standard">Terminal Standard</SelectItem>
                        <SelectItem value="Terminal Mini">Terminal Mini</SelectItem>
                        <SelectItem value="POS">POS</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Status Inicial</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STOCK">Em Estoque</SelectItem>
                        <SelectItem value="ACTIVE">Ativo</SelectItem>
                        <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                        <SelectItem value="INACTIVE">Inativo</SelectItem>
                        <SelectItem value="TRANSIT">Em Trânsito</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Adicione observações sobre a máquina..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Cadastrar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMachineDialog;
