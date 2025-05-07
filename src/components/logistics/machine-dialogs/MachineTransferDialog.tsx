
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface MachineTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine: any; // Machine type
  onTransferred: () => void;
}

const MachineTransferDialog = ({
  open,
  onOpenChange,
  machine,
  onTransferred
}: MachineTransferDialogProps) => {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [transferDate, setTransferDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedClient) {
      toast({
        title: "Erro",
        description: "Selecione um cliente para a transferência",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      
      toast({
        title: "Máquina transferida",
        description: `Máquina ${machine.serial_number} transferida com sucesso para o cliente selecionado.`
      });
      
      onTransferred();
    }, 1000);
  };

  // Mock clients data
  const clients = [
    { id: "1", name: "Cliente A" },
    { id: "2", name: "Cliente B" },
    { id: "3", name: "Cliente C" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir máquina</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="machine-info">Máquina selecionada</Label>
            <div className="px-4 py-3 bg-muted rounded-md text-sm">
              <p><span className="font-semibold">Número de série:</span> {machine?.serial_number}</p>
              <p><span className="font-semibold">Modelo:</span> {machine?.model}</p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="client">Cliente de destino</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="transfer-date">Data da transferência</Label>
            <Input 
              id="transfer-date" 
              type="date" 
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Transferindo..." : "Confirmar transferência"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MachineTransferDialog;
