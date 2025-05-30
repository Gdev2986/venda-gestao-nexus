
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { TaxBlocksService } from "@/services/tax-blocks.service";
import { AlertTriangle } from "lucide-react";

interface TaxBlockTransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientId: string;
  clientName: string;
  currentBlock: { id: string; name: string };
  targetBlock: { id: string; name: string };
}

const TaxBlockTransferDialog = ({
  isOpen,
  onClose,
  onSuccess,
  clientId,
  clientName,
  currentBlock,
  targetBlock
}: TaxBlockTransferDialogProps) => {
  const [cutoffDate, setCutoffDate] = useState(new Date().toISOString().split('T')[0]);
  const [cutoffTime, setCutoffTime] = useState('00:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleTransfer = async () => {
    if (!cutoffDate) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, informe a data de corte para a transferência",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const cutoffDateTime = `${cutoffDate}T${cutoffTime}:00.000Z`;
      
      const success = await TaxBlocksService.transferClientTaxBlock(
        clientId,
        currentBlock.id,
        targetBlock.id,
        cutoffDateTime,
        user?.id,
        notes.trim() || undefined
      );

      if (success) {
        toast({
          title: "Transferência realizada",
          description: `Cliente transferido do bloco "${currentBlock.name}" para "${targetBlock.name}" com sucesso`
        });
        onSuccess();
        onClose();
      } else {
        throw new Error("Falha na transferência");
      }
    } catch (error) {
      console.error('Error transferring tax block:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar a transferência",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Transferir Bloco de Taxas
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>{clientName}</strong> já está vinculado ao bloco <strong>"{currentBlock.name}"</strong>.
              Deseja transferi-lo para o bloco <strong>"{targetBlock.name}"</strong>?
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              O cliente será notificado dessa alteração.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="cutoff-date">Data de Corte</Label>
              <Input
                id="cutoff-date"
                type="date"
                value={cutoffDate}
                onChange={(e) => setCutoffDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cutoff-time">Hora de Corte</Label>
              <Input
                id="cutoff-time"
                type="time"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="transfer-notes">Observações (opcional)</Label>
            <Textarea
              id="transfer-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motivo da transferência ou outras observações..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleTransfer}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Transferindo..." : "Confirmar Transferência"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxBlockTransferDialog;
