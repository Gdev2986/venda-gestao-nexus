
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useSupportTickets } from "@/hooks/logistics/use-support-tickets";
import { getMachinesByClient } from "@/services/machine.service";
import { supabase } from "@/integrations/supabase/client";

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const formSchema = z.object({
  type: z.enum(["INSTALLATION", "MAINTENANCE", "REMOVAL", "REPLACEMENT", "PAPER", "OTHER"], {
    required_error: "Please select a request type",
  }),
  client_id: z.string({
    required_error: "Please select a client",
  }),
  machine_id: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    required_error: "Please select a priority level",
  }),
  scheduled_date: z.date({
    required_error: "Please select a date",
  }).refine(date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    message: "Date cannot be in the past",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewRequestDialog: React.FC<NewRequestDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addTicket } = useSupportTickets();
  const [clients, setClients] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      client_id: undefined,
      machine_id: undefined,
      priority: "MEDIUM",
      description: "",
    },
  });

  const watchClientId = form.watch("client_id");
  
  // Fetch clients with machines
  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("id, business_name")
          .order("business_name");
        
        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }
    
    fetchClients();
  }, []);
  
  // Fetch machines when client changes
  useEffect(() => {
    if (!watchClientId) {
      setMachines([]);
      return;
    }
    
    async function fetchMachines() {
      try {
        const clientMachines = await getMachinesByClient(watchClientId);
        setMachines(clientMachines);
      } catch (error) {
        console.error("Error fetching machines for client:", error);
      }
    }
    
    fetchMachines();
  }, [watchClientId]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await addTicket({
        client_id: data.client_id,
        machine_id: data.machine_id,
        type: data.type,
        priority: data.priority,
        description: data.description,
        scheduled_date: data.scheduled_date.toISOString(),
        created_by: user.id,
      });
      
      form.reset();
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
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
          <DialogTitle>Nova Solicitação</DialogTitle>
          <DialogDescription>
            Crie uma nova solicitação de atendimento técnico.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Solicitação</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INSTALLATION">Instalação</SelectItem>
                      <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                      <SelectItem value="REMOVAL">Retirada</SelectItem>
                      <SelectItem value="REPLACEMENT">Troca</SelectItem>
                      <SelectItem value="PAPER">Troca de Bobina</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
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
                  <FormLabel>Cliente</FormLabel>
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
              name="machine_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máquina (Opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!watchClientId || machines.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={machines.length > 0 ? "Selecione a máquina" : "Cliente sem máquinas"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {machines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.id}>
                          {machine.serial_number} - {machine.model}
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
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Baixa</SelectItem>
                      <SelectItem value="MEDIUM">Média</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="scheduled_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data Agendada</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
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
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhes da solicitação..." 
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
              <Button type="submit" disabled={loading}>
                Criar Solicitação
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequestDialog;
