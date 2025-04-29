
// This component already exists in your project, but I'll make sure it's correctly defined
// to support machine transfers properly.

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  business_name: string;
}

interface Machine {
  id: string;
  model: string;
  serialNumber: string;
  clientId?: string;
}

interface MachineTransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  clients: Client[];
  machines: Machine[];
  currentClientId?: string;
}

const MachineTransferForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  clients, 
  machines,
  currentClientId 
}: MachineTransferFormProps) => {
  const [machineId, setMachineId] = useState("");
  const [toClientId, setToClientId] = useState("");
  const [transferDate, setTransferDate] = useState<Date>(new Date());
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (currentClientId) {
        const machine = machines.find(m => m.clientId === currentClientId);
        if (machine) {
          setMachineId(machine.id);
        }
        
        const client = clients.find(c => c.id === currentClientId);
        if (client) {
          setCurrentClient(client);
        }
      } else {
        setMachineId("");
        setCurrentClient(null);
      }
      
      setToClientId("");
      setTransferDate(new Date());
    }
  }, [isOpen, currentClientId, machines, clients]);
  
  // Update current client when machine selection changes
  useEffect(() => {
    if (machineId) {
      const machine = machines.find(m => m.id === machineId);
      if (machine?.clientId) {
        const client = clients.find(c => c.id === machine.clientId);
        setCurrentClient(client || null);
      } else {
        setCurrentClient(null);
      }
    } else {
      setCurrentClient(null);
    }
  }, [machineId, machines, clients]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      machineId,
      toClientId,
      transferDate: format(transferDate, "yyyy-MM-dd")
    };
    
    onSubmit(formData);
  };
  
  // Filter out the current client from the destination options
  const destinationClients = currentClient 
    ? clients.filter(client => client.id !== currentClient.id) 
    : clients;
  
  // Get machines that are assigned to clients
  const availableMachines = machines.filter(machine => machine.clientId);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="machine">Máquina</Label>
              <Select value={machineId} onValueChange={setMachineId} required>
                <SelectTrigger id="machine">
                  <SelectValue placeholder="Selecione uma máquina" />
                </SelectTrigger>
                <SelectContent>
                  {availableMachines.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.model} - {machine.serialNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {currentClient && (
              <div className="grid gap-2">
                <Label>Cliente Atual</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {currentClient.business_name}
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="toClient">Cliente Destino</Label>
              <Select value={toClientId} onValueChange={setToClientId} required>
                <SelectTrigger id="toClient">
                  <SelectValue placeholder="Selecione o cliente destino" />
                </SelectTrigger>
                <SelectContent>
                  {destinationClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Data de Transferência</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !transferDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {transferDate ? format(transferDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={transferDate}
                    onSelect={(date) => date && setTransferDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!machineId || !toClientId || !transferDate}
            >
              Transferir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MachineTransferForm;
