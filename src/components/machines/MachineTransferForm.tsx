
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MachineTransferFormProps {
  machine: any;
  onClose: () => void;
}

export function MachineTransferForm({ machine, onClose }: MachineTransferFormProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const { toast } = useToast();
  
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      machine_id: machine?.id,
      to_client_id: "",
      cutoff_date: new Date(),
    },
  });
  
  const toClientId = watch("to_client_id");
  
  useEffect(() => {
    fetchClients();
    setValue("machine_id", machine?.id);
  }, [machine, setValue]);
  
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name');
        
      if (error) {
        throw error;
      }
      
      // Filtra o cliente atual da máquina da lista
      setClients(data?.filter(client => client.id !== machine?.client_id) || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
      });
    }
  };
  
  const onSubmit = async (data) => {
    if (!data.to_client_id) {
      toast({
        variant: "destructive",
        title: "Selecione um cliente",
        description: "Você precisa selecionar um cliente para transferir a máquina.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Obter o ID do usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Usuário não autenticado");
      
      // Criar registro de transferência
      const { error: transferError } = await supabase
        .from('machine_transfers')
        .insert({
          machine_id: machine.id,
          from_client_id: machine.client_id,
          to_client_id: data.to_client_id,
          transfer_date: new Date().toISOString(),
          cutoff_date: date.toISOString(),
          created_by: user.id,
        });
        
      if (transferError) throw transferError;
      
      // Atualizar o cliente da máquina
      const { error: machineError } = await supabase
        .from('machines')
        .update({
          client_id: data.to_client_id,
          updated_at: new Date(),
        })
        .eq('id', machine.id);
        
      if (machineError) throw machineError;
      
      toast({
        title: "Máquina transferida",
        description: "A máquina foi transferida com sucesso.",
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao transferir máquina:", error);
      toast({
        variant: "destructive",
        title: "Erro na transferência",
        description: error.message || "Não foi possível transferir a máquina.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
          <DialogDescription>
            Transferir a máquina {machine?.serial_number} para outro cliente
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Máquina</Label>
              <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted">
                <span className="font-medium">{machine?.serial_number}</span>
                <span className="text-muted-foreground">({machine?.model})</span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Cliente Atual</Label>
              <div className="p-2 border rounded-md bg-muted">
                {machine?.clients?.business_name || "Não atribuída"}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="to_client_id">Novo Cliente</Label>
              <Select
                value={toClientId}
                onValueChange={(value) => setValue("to_client_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente para transferência" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.to_client_id && (
                <p className="text-sm text-destructive">{errors.to_client_id.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label>Data de Corte</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date || new Date());
                      setValue("cutoff_date", date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Transferindo..." : "Transferir"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
