
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EyeIcon,
  PenIcon,
  Trash2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onViewClient?: (clientId: string) => void;
  isPartnerView?: boolean;
}

const ClientsTable = ({
  clients,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onViewClient,
  isPartnerView = false,
}: ClientsTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const handleViewClient = (client: Client) => {
    if (onViewClient) {
      onViewClient(client.id);
    } else if (onView) {
      onView(client);
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Telefone</TableHead>
            <TableHead className="hidden lg:table-cell">Localização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.business_name || "Nome não informado"}</TableCell>
                <TableCell>{client.contact_name}</TableCell>
                <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                <TableCell className="hidden lg:table-cell">{`${client.city || ''}, ${client.state || ''}`}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewClient(client)} 
                      title="Visualizar"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    {!isPartnerView && onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(client)} title="Editar">
                        <PenIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {!isPartnerView && onDelete && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => onDelete(client)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
