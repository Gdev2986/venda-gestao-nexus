
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MachineTransferForm from "@/components/machines/MachineTransferForm";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Machine } from "@/types";

interface MachineTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machineId: string;
  machineName: string;
  onTransferComplete?: () => void;
}

const MachineTransferDialog = ({
  open,
  onOpenChange,
  machineId,
  machineName,
  onTransferComplete,
}: MachineTransferDialogProps) => {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load machine details on open
  useEffect(() => {
    if (open && machineId) {
      loadMachineDetails();
    }
  }, [open, machineId]);

  const loadMachineDetails = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch from API
      // Simulate API call
      setTimeout(() => {
        // Mock machine data
        const mockMachine: Machine = {
          id: machineId,
          serial_number: machineName,
          model: "Model XYZ",
          status: "Active",
          client_id: "client123",
          name: machineName,
          client_name: "Current Client",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
          location: "Main Location"
        };
        setMachine(mockMachine);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading machine details:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os detalhes da máquina",
      });
      setIsLoading(false);
    }
  };

  const handleTransfer = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Transferência concluída",
        description: `Máquina transferida com sucesso para ${data.clientName}`,
      });

      if (onTransferComplete) {
        onTransferComplete();
      }

      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro na transferência",
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
            Transferir a máquina para outro cliente
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <p>Carregando...</p>
          </div>
        ) : machine ? (
          <MachineTransferForm
            machine={machine}
            currentClientId={machine.client_id || ""}
            onSubmit={handleTransfer}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="py-4 text-center">
            <p className="text-destructive">Máquina não encontrada</p>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mt-2"
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MachineTransferDialog;
