
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Machine } from "@/types/machine.types";
import { deleteMachine } from "@/services/machine.service";

interface MachineDeleteDialogProps {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export const MachineDeleteDialog = ({ 
  machine, 
  open, 
  onOpenChange, 
  onDelete 
}: MachineDeleteDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!machine) return;
    
    setIsLoading(true);
    try {
      await deleteMachine(machine.id);
      toast({
        title: "Máquina excluída",
        description: "A máquina foi removida do sistema com sucesso."
      });
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting machine:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a máquina. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Atenção!</strong> Esta ação não pode ser desfeita. Todos os dados 
              relacionados a esta máquina serão permanentemente removidos do sistema.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p>Você está prestes a excluir a máquina:</p>
            <div className="bg-gray-100 p-3 rounded-md">
              <p><strong>Número de Série:</strong> {machine?.serial_number}</p>
              <p><strong>Modelo:</strong> {machine?.model}</p>
              {machine?.client?.business_name && (
                <p><strong>Cliente:</strong> {machine.client.business_name}</p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Digite <strong>CONFIRMAR</strong> para continuar com a exclusão:
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Riscos da exclusão:</strong>
            </p>
            <ul className="text-yellow-700 text-xs mt-1 list-disc list-inside">
              <li>Perda de histórico de vendas associadas</li>
              <li>Perda de dados de transferências</li>
              <li>Impossibilidade de recuperação dos dados</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isLoading}
          >
            {isLoading ? "Excluindo..." : "Excluir Máquina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
