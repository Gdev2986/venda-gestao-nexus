
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MachineTransferForm } from "./MachineTransferForm";

interface MachineTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machineId: string;
  machineName: string;
  currentClientId: string;
  onTransferComplete: () => void;
}

export function MachineTransferDialog({
  open,
  onOpenChange,
  machineId,
  machineName,
  currentClientId,
  onTransferComplete
}: MachineTransferDialogProps) {
  const handleTransferComplete = () => {
    onTransferComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
        </DialogHeader>

        <MachineTransferForm 
          machineId={machineId}
          machineName={machineName}
          currentClientId={currentClientId}
          onTransferComplete={handleTransferComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
