
import React from "react";
import { Partner } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";

export interface PartnersTableProps {
  partners: Partner[];
  isLoading?: boolean;
  onView?: (partner: Partner) => void;
  onEdit?: (partner: Partner) => void;
  onDelete?: (partner: Partner) => void;
  page?: number;
  setPage?: (page: number) => void;
  totalPages?: number;
}

const PartnersTable = ({
  partners,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  page = 1,
  setPage = () => {},
  totalPages = 1
}: PartnersTableProps) => {
  return (
    <Card>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Total de Vendas</TableHead>
                <TableHead className="w-[200px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : partners.length > 0 ? (
                <>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.company_name}</TableCell>
                      <TableCell>{partner.contact_name}</TableCell>
                      <TableCell>{partner.email}</TableCell>
                      <TableCell>{partner.phone}</TableCell>
                      <TableCell className="text-right">{partner.total_sales ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => onView?.(partner)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => onEdit?.(partner)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => onDelete?.(partner)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum parceiro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {partners.length > 0 && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page && page > 1 && setPage) setPage(page - 1);
                    }}
                    disabled={page <= 1}
                  >
                    <PaginationPrevious className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                {page && totalPages &&
                  Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;

                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (page <= 3) {
                      pageNumber = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = page - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <Button
                          variant={pageNumber === page ? "default" : "outline"}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage?.(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </Button>
                      </PaginationItem>
                    );
                  })}
                {totalPages > 5 && page && page < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page && totalPages && page < totalPages && setPage) setPage(page + 1);
                    }}
                    disabled={page >= totalPages}
                  >
                    <PaginationNext className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartnersTable;
