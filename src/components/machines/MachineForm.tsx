
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Client {
  id: string;
  business_name: string;
}

interface MachineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: {
    id?: string;
    model: string;
    serialNumber: string;
    status: string;
    clientId?: string;
  };
  title: string;
  clients: Client[];
}

const MachineForm = ({ isOpen, onClose, onSubmit, initialData, title, clients }: MachineFormProps) => {
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [clientId, setClientId] = useState("");
  
  useEffect(() => {
    if (initialData) {
      setModel(initialData.model || "");
      setSerialNumber(initialData.serialNumber || "");
      setStatus(initialData.status || "ACTIVE");
      setClientId(initialData.clientId || "");
    } else {
      setModel("");
      setSerialNumber("");
      setStatus("ACTIVE");
      setClientId("");
    }
  }, [initialData, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Define formData with an optional id property
    const formData: {
      model: string;
      serialNumber: string;
      status: string;
      clientId: string | null;
      id?: string;
    } = {
      model,
      serialNumber,
      status,
      clientId: clientId || null
    };
    
    if (initialData?.id) {
      formData.id = initialData.id;
    }
    
    onSubmit(formData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serialNumber">Número de Série</Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativa</SelectItem>
                  <SelectItem value="INACTIVE">Inativa</SelectItem>
                  <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                  <SelectItem value="BLOCKED">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem cliente</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MachineForm;
