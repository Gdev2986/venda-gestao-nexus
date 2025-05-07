
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Input } from "@/components/ui/input";

interface MachineTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machineId?: string;
}

export function MachineTransferDialog({
  open,
  onOpenChange,
  machineId,
}: MachineTransferDialogProps) {
  const [clientId, setClientId] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um cliente para transferir a máquina.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Sucesso",
        description: "Máquina transferida com sucesso.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error transferring machine:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível transferir a máquina.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock clients for demo
  const clients = [
    { id: "1", name: "Supermercado ABC" },
    { id: "2", name: "Farmácia Central" },
    { id: "3", name: "Padaria Sabor" },
    { id: "4", name: "Restaurante Delícia" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select
              value={clientId}
              onValueChange={setClientId}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local (opcional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Filial Sul, Matriz, etc."
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Transferindo..." : "Transferir"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
