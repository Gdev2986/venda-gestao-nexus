import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Machine } from "@/types/machine.types";
import { deleteMachine } from "@/services/machine.service";
import { AlertTriangle, Trash2 } from "lucide-react";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [dataLossChecked, setDataLossChecked] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!machine || !confirmChecked || !dataLossChecked) return;
    
    setIsDeleting(true);
    try {
      await deleteMachine(machine.id);
      toast({
        title: "Máquina excluída",
        description: `A máquina ${machine.serial_number} foi removida do sistema.`
      });
      onDelete();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error deleting machine:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a máquina.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setConfirmChecked(false);
    setDataLossChecked(false);
    setDeleteReason('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const isFormValid = confirmChecked && dataLossChecked && deleteReason.trim().length > 0;

  if (!machine) return null;

  const hasActiveClient = machine.client_id && machine.status === 'ACTIVE';
  const riskLevel = hasActiveClient ? 'ALTO' : machine.client_id ? 'MÉDIO' : 'BAIXO';

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Excluir Máquina - OPERAÇÃO CRÍTICA
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 border border-red-200 rounded-md bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Nível de Risco: {riskLevel}</p>
                  <p className="text-sm text-red-700">
                    Esta ação não pode ser desfeita e removerá permanentemente todos os dados da máquina.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Dados que serão perdidos:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                  <li>Número de série: <strong>{machine.serial_number}</strong></li>
                  <li>Modelo: <strong>{machine.model}</strong></li>
                  <li>Status atual: <strong>{machine.status}</strong></li>
                  {machine.client && (
                    <li>Cliente vinculado: <strong>{machine.client.business_name}</strong></li>
                  )}
                  <li>Histórico de notas e alterações</li>
                  <li>Histórico de transferências</li>
                  <li>Dados de vendas associados</li>
                </ul>
              </div>

              {hasActiveClient && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Atenção Especial</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Esta máquina está ATIVA e vinculada ao cliente <strong>{machine.client?.business_name}</strong>.
                    A exclusão pode interromper operações em andamento.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="deleteReason" className="text-base font-medium">
                  Motivo da exclusão (obrigatório):
                </Label>
                <Textarea
                  id="deleteReason"
                  placeholder="Descreva o motivo para exclusão desta máquina..."
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="confirmDelete" 
                    checked={confirmChecked}
                    onCheckedChange={(checked) => setConfirmChecked(!!checked)}
                  />
                  <Label htmlFor="confirmDelete" className="text-sm">
                    Confirmo que desejo excluir a máquina <strong>{machine.serial_number}</strong>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="confirmDataLoss" 
                    checked={dataLossChecked}
                    onCheckedChange={(checked) => setDataLossChecked(!!checked)}
                  />
                  <Label htmlFor="confirmDataLoss" className="text-sm">
                    Entendo que todos os dados serão perdidos permanentemente
                  </Label>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={!isFormValid || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Excluindo..." : "EXCLUIR MÁQUINA"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
