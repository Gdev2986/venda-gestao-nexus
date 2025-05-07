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
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  isLoading: boolean;
}

const PartnersTable: React.FC<PartnersTableProps> = ({ 
  partners, 
  page, 
  setPage, 
  totalPages, 
  isLoading 
}) => {
  const itemsPerPage = 10;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
            <TableHead>Status</TableHead>
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
                <TableCell>
                  {partner.status === "active" ? (
                    <Badge variant="default">Ativo</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-500 border-gray-200">Inativo</Badge>
                  )}
                </TableCell>
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
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Deletar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Display message when no partners are found
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhum parceiro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {partners.length > 0 && (
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
