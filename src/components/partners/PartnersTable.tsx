
import { format } from "date-fns";
import { PenIcon, EyeIcon, TrashIcon, UserIcon } from "lucide-react";
import { Partner } from "@/types";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PartnersTableProps {
  partners: Partner[];
  isLoading: boolean;
  onView: (partner: Partner) => void;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
}

const PartnersTable = ({
  partners,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: PartnersTableProps) => {
  // Mock data for clients and commissions
  const getRandomClientCount = (partnerId: string) => {
    // Use partner ID to deterministically generate a random number
    const id = partnerId.split("-")[0] || "";
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 30) + 1; // 1-30 clients
  };

  const getRandomCommission = (partnerId: string) => {
    // Use partner ID to deterministically generate a random commission
    const id = partnerId.split("-")[0] || "";
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 5000) + 500; // R$500-5500
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Nome</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Telefone</TableHead>
            <TableHead className="hidden lg:table-cell">Clientes</TableHead>
            <TableHead className="hidden lg:table-cell">Comissão Total</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex justify-center items-center h-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : partners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                Nenhum parceiro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            partners.map((partner) => {
              const clientCount = getRandomClientCount(partner.id);
              const commission = getRandomCommission(partner.id);
              
              return (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">
                    <div>
                      <span className="block">{partner.business_name || partner.company_name}</span>
                      <span className="block sm:hidden text-xs text-muted-foreground">{partner.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{partner.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{partner.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{clientCount}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    R$ {commission.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge 
                      variant={partner.id.length % 2 === 0 ? "outline" : "default"}
                      className={partner.id.length % 2 === 0 ? "border-yellow-500 text-yellow-500" : "bg-green-500/10 text-green-700"}
                    >
                      {partner.id.length % 2 === 0 ? "Inativo" : "Ativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onView(partner)}
                        aria-label="Ver detalhes"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(partner)}
                        aria-label="Editar parceiro"
                      >
                        <PenIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(partner)}
                        aria-label="Excluir parceiro"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnersTable;
