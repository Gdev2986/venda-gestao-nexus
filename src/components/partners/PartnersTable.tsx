
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Partner } from "@/types";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PartnersTableProps {
  partners: Partner[];
  isLoading: boolean;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onView?: (partner: Partner) => void;
}

const PartnersTable = ({
  partners,
  isLoading,
  onEdit,
  onDelete,
  onView
}: PartnersTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Nenhum parceiro encontrado.
      </div>
    );
  }

  // Helper function to render badge based on status
  const renderStatusBadge = (partner: Partner) => {
    const status = partner.status || 'active'; // Default to active if not specified
    
    if (status === 'active') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Ativo
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Inativo
        </Badge>
      );
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Empresa</TableHead>
              <TableHead className="hidden md:table-cell">Contato</TableHead>
              <TableHead className="hidden md:table-cell">Taxa de Comissão</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id} className="group">
                <TableCell className="font-medium">{partner.company_name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {partner.contact_name || "Não informado"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {partner.commission_rate ? `${partner.commission_rate}%` : "Não definida"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {renderStatusBadge(partner)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(partner)}>
                          Ver detalhes
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(partner)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(partner)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile view - Card style */}
      <div className="md:hidden">
        {partners.map((partner) => (
          <div key={partner.id} className="p-4 border-t">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium mb-1">{partner.company_name}</h4>
                <p className="text-sm text-muted-foreground">{partner.contact_name || "Sem contato"}</p>
                <p className="text-sm">
                  {partner.commission_rate ? `Taxa: ${partner.commission_rate}%` : "Sem taxa definida"}
                </p>
                <div className="mt-1">
                  {renderStatusBadge(partner)}
                </div>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(partner)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600"
                  onClick={() => onDelete(partner)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersTable;
