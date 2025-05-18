
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
import { Loader2 } from "lucide-react";
import { Machine, transferMachine } from "@/services/machine.service";

interface MachineTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine: Machine | null;
  clients: Array<{ id: string; business_name: string }>;
  onTransferComplete: () => void;
}

export function MachineTransferDialog({
  open,
  onOpenChange,
  machine,
  clients,
  onTransferComplete,
}: MachineTransferDialogProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!machine || !selectedClientId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cliente destino",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await transferMachine({
        machine_id: machine.id,
        from_client_id: machine.client_id || null,
        to_client_id: selectedClientId,
        created_by: "current_user", // This would be the actual user ID in a real app
      });

      if (result) {
        toast({
          title: "Transferência concluída",
          description: `Máquina transferida com sucesso`,
        });
        onTransferComplete();
        onOpenChange(false);
      } else {
        throw new Error("Falha na transferência da máquina");
      }
    } catch (error) {
      console.error("Error transferring machine:", error);
      toast({
        title: "Erro",
        description: "Falha ao transferir a máquina. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset selected client when dialog opens or machine changes
  useState(() => {
    if (open) {
      setSelectedClientId("");
    }
  }, [open, machine]);

  // Filter out the current client from the options
  const availableClients = clients.filter(
    (client) => client.id !== machine?.client_id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="machine-info">Máquina</Label>
            <div id="machine-info" className="p-2 bg-muted rounded-md">
              <p className="font-medium">{machine?.serial_number}</p>
              <p className="text-sm text-muted-foreground">{machine?.model}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-client">Cliente Atual</Label>
            <div id="current-client" className="p-2 bg-muted rounded-md">
              <p>
                {machine?.client?.business_name || "Não atribuído"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-client">Novo Cliente</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger id="new-client">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {availableClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Button onClick={handleTransfer} disabled={isSubmitting || !selectedClientId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transferindo...
              </>
            ) : (
              "Transferir Máquina"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
