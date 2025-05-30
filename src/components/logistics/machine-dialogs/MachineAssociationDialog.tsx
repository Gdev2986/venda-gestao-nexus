
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório"),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MachineAssociationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  machine: any;
  onAssociated: () => void;
}

export function MachineAssociationDialog({
  isOpen,
  onClose,
  machine,
  onAssociated,
}: MachineAssociationDialogProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      location: "",
    },
  });

  // Fetch clients when modal opens
  useEffect(() => {
    if (isOpen && machine) {
      fetchClients();
    }
  }, [isOpen, machine]);

  const fetchClients = async () => {
    setIsLoadingClients(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name, status')
        .eq('status', 'ACTIVE')
        .order('business_name', { ascending: true });

      if (error) throw error;

      console.log("Fetched clients:", data);
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

  const onSubmit = async (values: FormValues) => {
    if (!machine) return;

    setIsLoading(true);
    try {
      // 1. Update the machine's client_id
      const { error: updateError } = await supabase
        .from("machines")
        .update({
          client_id: values.clientId,
          status: "ACTIVE", // Change status to active since it's now associated
        })
        .eq("id", machine.id);

      if (updateError) throw updateError;

      // 2. Create a transfer record (even for first association)
      const { error: transferError } = await supabase
        .from("machine_transfers")
        .insert({
          machine_id: machine.id,
          from_client_id: null, // null for first association
          to_client_id: values.clientId,
          transfer_date: new Date().toISOString(),
          created_by: 'current-user-id', // This should be replaced with actual user ID
        });

      if (transferError) throw transferError;
      
      toast({
        title: "Máquina associada",
        description: "A máquina foi associada ao cliente com sucesso.",
      });

      form.reset();
      onAssociated();
      onClose();
    } catch (error) {
      console.error("Error associating machine:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível associar a máquina ao cliente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Associar Máquina ao Cliente</DialogTitle>
          <DialogDescription>
            {machine && `Serial: ${machine.serial_number || machine.serialNumber} - Modelo: ${machine.model}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingClients}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingClients ? "Carregando..." : "Selecione o cliente"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.length === 0 && !isLoadingClients ? (
                        <SelectItem value="no-clients" disabled>
                          Nenhum cliente ativo encontrado
                        </SelectItem>
                      ) : (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.business_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Filial Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || clients.length === 0}>
                {isLoading ? "Associando..." : "Associar Máquina"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
