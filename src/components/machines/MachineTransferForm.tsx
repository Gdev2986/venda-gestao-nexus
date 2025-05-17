
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Machine, Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const FormSchema = z.object({
  clientId: z.string().min(1, { message: "Cliente é obrigatório" }),
  clientName: z.string().optional(),
  notes: z.string().optional(),
});

export interface MachineTransferFormProps {
  machine: Machine;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
  isSubmitting: boolean;
}

const MachineTransferForm = ({
  machine,
  onSubmit,
  isSubmitting,
}: MachineTransferFormProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientId: "",
      clientName: "",
      notes: "",
    },
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      // In a real app, fetch from API
      // For now, mock data
      setTimeout(() => {
        const mockClients: Client[] = [
          {
            id: "1",
            business_name: "Client 1",
            status: "ACTIVE",
          },
          {
            id: "2",
            business_name: "Client 2",
            status: "ACTIVE",
          },
          {
            id: "3",
            business_name: "Client 3",
            status: "ACTIVE",
          },
        ];
        setClients(mockClients);
        setIsLoadingClients(false);
      }, 500);
    } catch (error) {
      console.error("Error loading clients:", error);
      setIsLoadingClients(false);
    }
  };

  const handleSelectClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      form.setValue("clientName", client.business_name);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalhes da Máquina</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Número de Série</p>
                <p className="text-sm">{machine.serial_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modelo</p>
                <p className="text-sm">{machine.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-sm">{machine.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cliente Atual</p>
                <p className="text-sm">{machine.client_name || "Não associado"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Novo Cliente</h3>
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    disabled={isLoadingClients || isSubmitting}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleSelectClient(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Observações sobre a transferência"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Transferindo..." : "Transferir Máquina"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MachineTransferForm;
