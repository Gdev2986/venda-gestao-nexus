
import { format } from "date-fns";
import { PenIcon, TrashIcon } from "lucide-react";
import { type Partner } from "@/hooks/use-partners";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PartnersTableProps {
  partners: Partner[];
  isLoading: boolean;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (partner: Partner) => void;
}

export function PartnersTable({
  partners,
  isLoading,
  onEditPartner,
  onDeletePartner,
}: PartnersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">
              Carregando...
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
              <TableCell className="font-medium">{partner.business_name}</TableCell>
              <TableCell>{partner.contact_name}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell>{partner.phone}</TableCell>
              <TableCell>
                {partner.created_at && format(new Date(partner.created_at), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEditPartner(partner)}>
                    <PenIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeletePartner(partner)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
