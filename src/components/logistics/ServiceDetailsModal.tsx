
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
import { 
  Clock, 
  User, 
  Laptop, 
  MapPin, 
  Calendar,
  FileText,
  Wrench // Changed from Tool to Wrench which is available
} from "lucide-react";

interface ServiceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: any;
}

const ServiceDetailsModal = ({ open, onOpenChange, service }: ServiceDetailsModalProps) => {
  if (!service) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendente";
      case "IN_PROGRESS":
        return "Em Andamento";
      case "COMPLETED":
        return "Concluído";
      default:
        return status;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "MAINTENANCE":
        return "Manutenção";
      case "PAPER_REPLACEMENT":
        return "Troca de Bobina";
      case "INSTALLATION":
        return "Instalação";
      case "PAPER_DELIVERY":
        return "Entrega de Bobina";
      default:
        return type;
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
            <span>Detalhes do Atendimento</span>
            <Badge className={`ml-2 ${getStatusColor(service.status)}`}>
              {getStatusLabel(service.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {service.clientName}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tipo de Atendimento</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" /> 
                {getTypeLabel(service.type)}
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Máquina</p>
                <p className="text-base flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-primary" />
                  {service.machineSerial || "N/A"}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Estabelecimento</p>
                <p className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {service.establishment || "N/A"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data Agendada</p>
                <p className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {service.scheduledFor ? format(new Date(service.scheduledFor), "dd/MM/yyyy") : "N/A"}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Hora Agendada</p>
                <p className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {service.scheduledFor ? format(new Date(service.scheduledFor), "HH:mm") : "N/A"}
                </p>
              </div>
            </div>
          </div>
          
          {service.notes && (
            <div className="pt-2 border-t">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Observações</p>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-base flex gap-2">
                    <FileText className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <span>{service.notes}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
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

export default ServiceDetailsModal;
