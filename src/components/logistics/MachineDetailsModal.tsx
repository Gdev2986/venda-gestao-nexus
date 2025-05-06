
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, Tag, User, Briefcase, Calendar } from "lucide-react";

interface MachineDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine?: any;
}

const MachineDetailsModal = ({ open, onOpenChange, machine }: MachineDetailsModalProps) => {
  if (!machine) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "MAINTENANCE":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "REPLACEMENT_REQUESTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Operando";
      case "MAINTENANCE":
        return "Em Manutenção";
      case "INACTIVE":
        return "Parada";
      case "REPLACEMENT_REQUESTED":
        return "Troca Solicitada";
      default:
        return status;
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span>Detalhes da Máquina</span>
            <Badge className={`ml-2 ${getStatusColor(machine.status)}`}>
              {getStatusLabel(machine.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Número de Série</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                {machine.serialNumber}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Modelo</p>
              <p className="text-lg font-semibold">
                {machine.model}
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {machine.clientName || "Nenhum (em estoque)"}
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data de Entrada</p>
                <p className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {machine.createdAt ? format(new Date(machine.createdAt), "dd/MM/yyyy") : "N/A"}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {machine.updatedAt ? format(new Date(machine.updatedAt), "dd/MM/yyyy HH:mm") : "N/A"}
                </p>
              </div>
            </div>
          </div>
          
          {/* We could show activity history or service logs here in a future enhancement */}
        </div>

        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MachineDetailsModal;
