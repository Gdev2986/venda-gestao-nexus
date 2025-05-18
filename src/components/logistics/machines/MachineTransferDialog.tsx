
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MachineTransferForm } from '@/components/logistics/machines/MachineTransferForm';

export interface MachineTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machineId: string;
  machineName?: string;
  currentClientId?: string;
  currentClientName?: string;
  onTransferComplete?: () => void;
}

export const MachineTransferDialog: React.FC<MachineTransferDialogProps> = ({
  open,
  onOpenChange,
  machineId,
  machineName,
  currentClientId,
  currentClientName,
  onTransferComplete = () => {}
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
          <DialogDescription>
            Transfira a máquina {machineName || machineId} para outro cliente.
          </DialogDescription>
        </DialogHeader>
        
        <MachineTransferForm
          machineId={machineId}
          machineName={machineName || machineId}
          currentClientId={currentClientId}
          onTransferComplete={() => {
            onTransferComplete();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MachineTransferDialog;
