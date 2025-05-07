
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
  clientId: z.string().min(1, "Novo cliente é obrigatório"),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MachineTransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  machine: any;
  onTransferred: () => void;
}

export function MachineTransferDialog({
  isOpen,
  onClose,
  machine,
  onTransferred,
}: MachineTransferDialogProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      location: "",
    },
  });

  useEffect(() => {
    if (isOpen && machine) {
      fetchClients();
    }
  }, [isOpen, machine]);

  const fetchClients = async () => {
    try {
      // In a real implementation, you would fetch actual clients from Supabase
      // For now, we'll use mock data
      setClients([
        { id: "1", business_name: "Supermercado ABC" },
        { id: "2", business_name: "Farmácia Central" },
        { id: "3", business_name: "Padaria Sabor" },
      ]);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de clientes.",
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!machine) return;

    setIsLoading(true);
    try {
      // 1. Create a transfer record
      const { error: transferError } = await supabase
        .from("machine_transfers")
        .insert({
          machine_id: machine.id,
          from_client_id: machine.clientId,
          to_client_id: values.clientId,
          transfer_date: new Date().toISOString(),
          created_by: 'current-user-id', // This should be replaced with actual user ID
        });

      if (transferError) throw transferError;

      // 2. Update the machine's client_id
      const { error: updateError } = await supabase
        .from("machines")
        .update({
          client_id: values.clientId,
        })
        .eq("id", machine.id);

      if (updateError) throw updateError;

      // Handle location separately if needed
      if (values.location) {
        // In a real app, you would have a proper location table
        // or store location in machine_transfers directly if supported by schema
        console.log("Location information:", values.location);
      }

      toast({
        title: "Máquina transferida",
        description: "A máquina foi transferida para o novo cliente com sucesso.",
      });

      onTransferred();
    } catch (error) {
      console.error("Error transferring machine:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível transferir a máquina para o novo cliente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
          <DialogDescription>
            {machine && (
              <>
                Serial: {machine.serialNumber} - Modelo: {machine.model}
                <br />
                Cliente Atual: {machine.clientName || "Não associada"}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Cliente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients
                        .filter((client) => client.id !== machine?.clientId)
                        .map((client) => (
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Transferindo..." : "Transferir Máquina"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
