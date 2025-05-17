
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Machine, Client } from "@/types";

interface MachineTransferFormProps {
  machine: Machine;
  clients: Client[];
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
}

// Define the form schema
const formSchema = z.object({
  machineId: z.string(),
  toClientId: z.string(),
  transferDate: z.date(),
  cutoffDate: z.date().optional(),
});

export default function MachineTransferForm({ machine, clients, onSubmit, isSubmitting }: MachineTransferFormProps) {
  const [availableClients, setAvailableClients] = useState<Client[]>([]);

  // Filter out the current client from the available clients
  useEffect(() => {
    if (clients && machine) {
      const filteredClients = clients.filter(client => client.id !== machine.client_id);
      setAvailableClients(filteredClients);
    }
  }, [clients, machine]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineId: machine?.id || "",
      toClientId: "",
      transferDate: new Date(),
      cutoffDate: new Date(),
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  // Get current client if exists
  const currentClient = machine?.client_id
    ? clients.find(c => c.id === machine.client_id)
    : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Machine Info */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Informações da Máquina</h3>
          <p><span className="text-muted-foreground">Modelo:</span> {machine?.model}</p>
          <p><span className="text-muted-foreground">Serial:</span> {machine?.serial_number}</p>
          <p>
            <span className="text-muted-foreground">Cliente Atual:</span>{" "}
            {currentClient ? currentClient.business_name : "Sem Cliente"}
          </p>
        </div>

        {/* Select new client */}
        <FormField
          control={form.control}
          name="toClientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transferir Para</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente destino" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableClients.map((client) => (
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

        {/* Transfer Date */}
        <FormField
          control={form.control}
          name="transferDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Transferência</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date("1900-01-01") ||
                      date > new Date("2100-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cutoff Date */}
        <FormField
          control={form.control}
          name="cutoffDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Corte (Opcional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date("1900-01-01") ||
                      date > new Date("2100-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : "Confirmar Transferência"}
        </Button>
      </form>
    </Form>
  );
}
