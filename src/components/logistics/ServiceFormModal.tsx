
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { useMachines } from "@/hooks/use-machines";
import { saveService } from "@/hooks/use-services";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório"),
  machineId: z.string().min(1, "Máquina é obrigatória"),
  establishment: z.string().optional(),
  type: z.string().min(1, "Tipo é obrigatório"),
  date: z.date({ required_error: "Data é obrigatória" }),
  time: z.string().min(1, "Hora é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
  notes: z.string().optional(),
});

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: any; // For editing existing service
  onSave: (service: any) => void;
}

const ServiceFormModal = ({ open, onOpenChange, service, onSave }: ServiceFormModalProps) => {
  const { toast } = useToast();
  const { clients } = useClients();
  const { machines: allMachines } = useMachines({});
  const [clientMachines, setClientMachines] = React.useState<any[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: service?.clientId || "",
      machineId: service?.machineId || "",
      establishment: service?.establishment || "",
      type: service?.type || "MAINTENANCE",
      date: service?.scheduledFor ? new Date(service.scheduledFor) : new Date(),
      time: service?.scheduledFor ? format(new Date(service.scheduledFor), "HH:mm") : "09:00",
      status: service?.status || "PENDING",
      notes: service?.notes || "",
    },
  });
  
  // Filter machines when client changes
  React.useEffect(() => {
    const clientId = form.watch("clientId");
    if (clientId) {
      const filtered = allMachines.filter(machine => machine.clientId === clientId);
      setClientMachines(filtered);
    } else {
      setClientMachines([]);
    }
  }, [form.watch("clientId"), allMachines]);
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Combine date and time
      const [hours, minutes] = data.time.split(":");
      const scheduledDate = new Date(data.date);
      scheduledDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      const serviceData = {
        ...data,
        scheduledFor: scheduledDate.toISOString(),
      };
      
      const savedService = await saveService(serviceData);
      
      toast({
        title: "Atendimento agendado com sucesso",
        description: "O atendimento foi adicionado ao sistema.",
      });
      
      onSave(savedService);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao agendar o atendimento. Tente novamente.",
      });
      console.error(error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar Atendimento" : "Agendar Novo Atendimento"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do atendimento abaixo. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
            
            <FormField
              control={form.control}
              name="machineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máquina</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={clientMachines.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a máquina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientMachines.map((machine: any) => (
                        <SelectItem key={machine.id} value={machine.id}>
                          {machine.serialNumber} - {machine.model}
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
              name="establishment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estabelecimento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Matriz, Filial Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Atendimento</FormLabel>
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
                      <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                      <SelectItem value="PAPER_REPLACEMENT">Troca de Bobina</SelectItem>
                      <SelectItem value="INSTALLATION">Instalação</SelectItem>
                      <SelectItem value="PAPER_DELIVERY">Entrega de Bobina</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data</FormLabel>
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
                              <span>Selecione uma data</span>
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
                          disabled={(date) => date < new Date()}
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
                name="time"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Hora</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="pl-8"
                        />
                      </FormControl>
                      <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                      <SelectItem value="COMPLETED">Concluído</SelectItem>
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
                    <Textarea 
                      placeholder="Informações adicionais sobre o atendimento"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Agendar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormModal;
