
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Partner } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PartnersTableProps {
  partners: Partner[];
  onViewPartner: (partner: Partner) => void;
  isLoading?: boolean;
}

const PartnersTable: React.FC<PartnersTableProps> = ({ 
  partners, 
  onViewPartner,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Comissão</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.length > 0 ? (
            partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.company_name}</TableCell>
                <TableCell>
                  {partner.created_at && format(new Date(partner.created_at), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>{partner.commission_rate}%</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPartner(partner)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhum parceiro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnersTable;
