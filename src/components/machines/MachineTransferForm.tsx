
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  machineId: z.string({
    required_error: "Selecione uma máquina para transferir",
  }),
  toClientId: z.string({
    required_error: "Selecione um cliente de destino",
  }),
  transferDate: z.date({
    required_error: "Selecione uma data de transferência",
  }),
});

type MachineTransferFormValues = z.infer<typeof formSchema>;

type MachineTransferFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MachineTransferFormValues) => void;
  clients?: { id: string; business_name: string }[];
  machines?: { id: string; model: string; serialNumber: string; clientId?: string }[];
  currentClientId?: string;
};

const MachineTransferForm = ({
  isOpen,
  onClose,
  onSubmit,
  clients = [],
  machines = [],
  currentClientId,
}: MachineTransferFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Filter out machines that do not belong to the current client
  const availableMachines = machines.filter(
    (machine) => !currentClientId || machine.clientId === currentClientId
  );

  const defaultValues: Partial<MachineTransferFormValues> = {
    transferDate: new Date(),
  };

  const form = useForm<MachineTransferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: MachineTransferFormValues) => {
    try {
      setIsLoading(true);
      onSubmit(data);
      toast({
        title: "Transferência solicitada",
        description: "A transferência da máquina foi solicitada com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao transferir máquina:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao solicitar a transferência. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
          <DialogDescription>
            Selecione a máquina e o cliente para transferência
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="machineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máquina</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a máquina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableMachines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.id}>
                          {machine.model} - {machine.serialNumber}
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
              name="toClientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente Destino</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente destino" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients
                        .filter((client) => client.id !== currentClientId)
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
              name="transferDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Transferência</FormLabel>
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
                            format(field.value, "PPP", { locale: pt })
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
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Data em que a transferência será realizada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MachineTransferForm;
