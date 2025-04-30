
import { format } from "date-fns";
import { PenIcon, TrashIcon } from "lucide-react";
import { Partner } from "@/types";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PartnersTableProps {
  partners: Partner[];
  isLoading: boolean;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (partner: Partner) => Promise<boolean> | void;
}

export function PartnersTable({
  partners,
  isLoading,
  onEditPartner,
  onDeletePartner,
}: PartnersTableProps) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Nome</TableHead>
            <TableHead className="hidden sm:table-cell">Contato</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Telefone</TableHead>
            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex justify-center items-center h-10">
                  <div className="spinner"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : partners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Nenhum parceiro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">
                  <div>
                    <span className="block">{partner.business_name || partner.company_name}</span>
                    <span className="block sm:hidden text-xs text-muted-foreground">{partner.contact_name}</span>
                    <span className="block md:hidden text-xs text-muted-foreground">{partner.email}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{partner.contact_name}</TableCell>
                <TableCell className="hidden md:table-cell">{partner.email}</TableCell>
                <TableCell className="hidden md:table-cell">{partner.phone}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {partner.created_at && format(new Date(partner.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEditPartner(partner)}
                      aria-label="Editar parceiro"
                    >
                      <PenIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDeletePartner(partner)}
                      aria-label="Excluir parceiro"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
