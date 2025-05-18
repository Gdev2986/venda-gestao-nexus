
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

  const machine = {
    id: machineId,
    serial_number: machineName,
    model: "Unknown Model" // Add a default model if not available
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Máquina</DialogTitle>
        </DialogHeader>

        <MachineTransferForm 
          machine={machine}
          currentClient={currentClientId}
          onTransferComplete={handleTransferComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
