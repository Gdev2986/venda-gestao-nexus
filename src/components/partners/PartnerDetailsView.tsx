
import { Partner } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PartnerDetailsViewProps {
  partner: Partner;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PartnerDetailsView = ({ 
  partner, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: PartnerDetailsViewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Parceiro</DialogTitle>
          <DialogDescription>
            Informações completas sobre {partner.company_name || partner.business_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Nome da Empresa</h3>
              <p>{partner.company_name}</p>
            </div>

            {partner.business_name && partner.business_name !== partner.company_name && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Nome Fantasia</h3>
                <p>{partner.business_name}</p>
              </div>
            )}

            {partner.contact_name && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Contato</h3>
                <p>{partner.contact_name}</p>
              </div>
            )}

            {partner.email && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
                <p>{partner.email}</p>
              </div>
            )}

            {partner.phone && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Telefone</h3>
                <p>{partner.phone}</p>
              </div>
            )}

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Taxa de Comissão</h3>
              <p>{partner.commission_rate}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between sm:justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Fechar
          </Button>
          <div className="flex flex-row gap-2">
            <Button 
              onClick={onEdit}
              className="gap-2"
            >
              <Edit2 size={16} /> Editar
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDelete}
              className="gap-2"
            >
              <Trash2 size={16} /> Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerDetailsView;
