
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface ClientDetailsViewProps {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientDetailsView = ({ client, onClose, onEdit, onDelete }: ClientDetailsViewProps) => {
  return (
    <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Detalhes do Cliente</h2>
          <p className="text-sm text-muted-foreground">
            Informações completas sobre {client.business_name}
          </p>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Nome da Empresa</h3>
              <p>{client.business_name}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Documento</h3>
              <p>{client.document || "Não informado"}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Contato</h3>
              <p>{client.contact_name || "Não informado"}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
              <p>{client.email || "Não informado"}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Telefone</h3>
              <p>{client.phone || "Não informado"}</p>
            </div>

            {(client.address || client.city || client.state) && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Endereço</h3>
                <p>
                  {[
                    client.address,
                    client.city && client.state && `${client.city}, ${client.state}`,
                    client.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
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
      </div>
    </div>
  );
};

export default ClientDetailsView;
