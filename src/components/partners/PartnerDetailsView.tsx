
import { Partner } from "@/types";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { PenIcon, TrashIcon, UserIcon } from "lucide-react";

interface PartnerDetailsViewProps {
  partner: Partner;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PartnerDetailsView = ({ partner, onClose, onEdit, onDelete }: PartnerDetailsViewProps) => {
  // Mock data for clients and commissions
  const getRandomClientCount = (partnerId: string) => {
    const id = partnerId.split("-")[0] || "";
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 30) + 1; // 1-30 clients
  };

  const getRandomCommission = (partnerId: string) => {
    const id = partnerId.split("-")[0] || "";
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 5000) + 500; // R$500-5500
  };

  const clientCount = getRandomClientCount(partner.id);
  const commission = getRandomCommission(partner.id);
  const isActive = partner.id.length % 2 !== 0;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Detalhes do Parceiro</DialogTitle>
        <DialogDescription>
          Informações detalhadas sobre o parceiro
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <UserIcon className="h-8 w-8" />
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{partner.business_name || partner.company_name}</h3>
            <p className="text-sm text-muted-foreground">{isActive ? "Ativo" : "Inativo"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Razão Social</p>
            <p>{partner.company_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nome Fantasia</p>
            <p>{partner.business_name || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contato</p>
            <p>{partner.contact_name || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{partner.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
            <p>{partner.phone || "-"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Clientes Vinculados</p>
            <p className="text-lg font-semibold">{clientCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Comissão Total</p>
            <p className="text-lg font-semibold">R$ {commission.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Fechar
          </Button>
          <Button
            variant="outline"
            onClick={onEdit}
            className="gap-1"
          >
            <PenIcon className="h-4 w-4" /> Editar
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="gap-1"
          >
            <TrashIcon className="h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default PartnerDetailsView;
