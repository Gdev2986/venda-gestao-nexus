
import React from 'react';
import { Partner } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface PartnersTableProps {
  partners: Partner[];
  isLoading: boolean;
  onView?: (partner: Partner) => void;
  onEdit?: (partner: Partner) => void;
  onDelete?: (partner: Partner) => void;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  totalPages?: number;
}

const PartnersTable: React.FC<PartnersTableProps> = ({ 
  partners, 
  isLoading,
  onView,
  onEdit,
  onDelete,
  page = 1,
  setPage,
  totalPages = 1
}) => {
  const itemsPerPage = 10;

  const handlePageChange = (newPage: number) => {
    if (setPage) {
      setPage(newPage);
    }
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Display skeleton rows while loading
            [...Array(itemsPerPage)].map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell className="text-right"><Skeleton /></TableCell>
              </TableRow>
            ))
          ) : partners.length > 0 ? (
            // Display partner data rows
            partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.company_name}</TableCell>
                <TableCell>{partner.contact_name}</TableCell>
                <TableCell>{partner.email}</TableCell>
                <TableCell>{partner.phone}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(partner)}>Ver detalhes</DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(partner)}>Editar</DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem onClick={() => onDelete(partner)}>Deletar</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Display message when no partners are found
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum parceiro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {partners.length > 0 && setPage && (
        <div className="flex items-center justify-between p-4">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            variant="outline"
            size="sm"
          >
            Anterior
          </Button>
          <span>Página {page} de {totalPages}</span>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            variant="outline"
            size="sm"
          >
            Próximo
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PartnersTable;
