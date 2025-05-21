
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useClients } from "@/hooks/use-clients";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMachines } from "@/hooks/logistics/use-machines";
import { cn } from "@/lib/utils";
import { TicketType, TicketPriority, TicketStatus, SupportTicket } from "@/types/support-ticket.types"; 

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const NewRequestDialog = ({ open, onOpenChange, onSuccess }: NewRequestDialogProps) => {
  const { clients, isLoading: isClientsLoading } = useClients();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [clientId, setClientId] = useState("");
  const [machineId, setMachineId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TicketType>(TicketType.MAINTENANCE);
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get machines for the selected client
  const { machines, isLoading: isMachinesLoading } = useMachines({
    clientId: clientId || undefined,
    initialFetch: !!clientId
  });
  
  // Reset form fields
  const resetForm = () => {
    setClientId("");
    setMachineId("");
    setTitle("");
    setType(TicketType.MAINTENANCE);
    setPriority(TicketPriority.MEDIUM);
    setDescription("");
    setScheduledDate(undefined);
    setErrors({});
  };
  
  // Close handler that resets the form
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!clientId) {
      newErrors.clientId = "Selecione um cliente";
    }
    
    if (!title) {
      newErrors.title = "Digite um título para a solicitação";
    }
    
    if (!type) {
      newErrors.type = "Selecione o tipo de solicitação";
    }
    
    if (!description.trim()) {
      newErrors.description = "Digite uma descrição para a solicitação";
    }
    
    if (scheduledDate && scheduledDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.scheduledDate = "A data não pode ser no passado";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the support request
      const newRequest: SupportTicket = {
        client_id: clientId,
        title: title,
        type: type,
        priority: priority,
        status: TicketStatus.PENDING,
        description: description,
        scheduled_date: scheduledDate ? scheduledDate.toISOString() : null,
      };
      
      // Here we would typically save the request to the database
      console.log('Creating support request:', newRequest);
      
      // For now this is a mock - in real implementation it would save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Solicitação criada",
        description: "A solicitação técnica foi criada com sucesso."
      });
      
      resetForm();
      handleOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao criar solicitação",
        description: error.message || "Ocorreu um erro ao criar a solicitação técnica",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Solicitação Técnica</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="client" className={errors.clientId ? "text-destructive" : ""}>
              Cliente *
            </Label>
            <Select
              value={clientId}
              onValueChange={setClientId}
              disabled={isClientsLoading}
            >
              <SelectTrigger id="client" className={errors.clientId ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients?.filter(client => client.status !== "INACTIVE").map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-xs text-destructive">{errors.clientId}</p>
            )}
          </div>
          
          {clientId && (
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="machine">Máquina (opcional)</Label>
              <Select
                value={machineId}
                onValueChange={setMachineId}
                disabled={isMachinesLoading || !machines.length}
              >
                <SelectTrigger id="machine">
                  <SelectValue placeholder="Selecione uma máquina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma máquina específica</SelectItem>
                  {machines.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.serial_number} - {machine.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
              Título *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="type" className={errors.type ? "text-destructive" : ""}>
              Tipo de Solicitação *
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as TicketType)}
            >
              <SelectTrigger id="type" className={errors.type ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TicketType.INSTALLATION}>Instalação</SelectItem>
                <SelectItem value={TicketType.MAINTENANCE}>Manutenção</SelectItem>
                <SelectItem value={TicketType.REMOVAL}>Retirada</SelectItem>
                <SelectItem value={TicketType.REPLACEMENT}>Substituição</SelectItem>
                <SelectItem value={TicketType.SUPPLIES}>Suprimentos</SelectItem>
                <SelectItem value={TicketType.OTHER}>Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-destructive">{errors.type}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TicketPriority)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TicketPriority.LOW}>Baixa</SelectItem>
                <SelectItem value={TicketPriority.MEDIUM}>Média</SelectItem>
                <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="scheduled-date">Data Programada (opcional)</Label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="scheduled-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground",
                    errors.scheduledDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={(date) => {
                    setScheduledDate(date);
                    setIsOpen(false);
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.scheduledDate && (
              <p className="text-xs text-destructive">{errors.scheduledDate}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
              Descrição *
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva a solicitação em detalhes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? "border-destructive" : ""}
              rows={4}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Solicitação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequestDialog;
