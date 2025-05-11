
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Partner } from "@/types";
import { MoreHorizontal, Trash, Pencil, User } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface PartnersTableProps {
  partners: Partner[];
  isLoading: boolean;
  onDelete?: (partner: Partner) => void;
  onEdit?: (partner: Partner) => void;
  onViewDetails?: (partner: Partner) => void;
}

const PartnersTable = ({ partners, isLoading, onDelete, onEdit, onViewDetails }: PartnersTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!partners.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="font-semibold mb-2">Nenhum parceiro encontrado</h3>
        <p className="text-muted-foreground">Tente ajustar os filtros ou adicionar novos parceiros.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Taxa Comissão</TableHead>
            <TableHead className="text-right">Total Gerado</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">{partner.company_name}</TableCell>
              <TableCell>{partner.email || "-"}</TableCell>
              <TableCell>{partner.phone || "-"}</TableCell>
              <TableCell className="text-right">{partner.commission_rate}%</TableCell>
              <TableCell className="text-right">{formatCurrency(partner.total_commission || 0)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onViewDetails && (
                      <DropdownMenuItem onClick={() => onViewDetails(partner)}>
                        <User className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(partner)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={() => onDelete(partner)} className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnersTable;
