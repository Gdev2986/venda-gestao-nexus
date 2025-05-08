
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MachineTransferForm from '@/components/machines/MachineTransferForm';

export interface MachineTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machineId?: string;
  machineName?: string;
  currentClientId?: string;
  currentClientName?: string;
  onTransferComplete?: () => void;
}

export const MachineTransferDialog = ({
  open,
  onOpenChange,
  machineId,
  machineName,
  currentClientId,
  currentClientName,
  onTransferComplete
}: MachineTransferDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Here you would make an API call to transfer the machine
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      toast({
        title: "Máquina transferida com sucesso",
        description: `A máquina ${machineName} foi transferida para o novo cliente.`
      });
      
      if (onTransferComplete) {
        onTransferComplete();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error transferring machine:', error);
      toast({
        title: "Erro ao transferir máquina",
        description: "Ocorreu um erro ao processar a transferência. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
          <DialogDescription>
            Transferir a máquina {machineName || '#'} para outro cliente.
            {currentClientName && (
              <span className="block mt-1">
                Cliente atual: <span className="font-medium">{currentClientName}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <MachineTransferForm
          machines={[{ id: machineId || '', name: machineName || '' }]}
          currentClientId={currentClientId}
          onSubmit={handleTransfer}
          isSubmitting={isSubmitting}
        />
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MachineTransferDialog;
