
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MachinesTable } from "./MachinesTable";
import { useMachines } from "@/hooks/use-machines";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export const MachinesPageContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { machines, isLoading, refreshMachines } = useMachines();

  const filteredMachines = machines.filter(machine => 
    machine.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.client?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredMachines.length / itemsPerPage));
  const paginatedMachines = filteredMachines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="responsive-container responsive-padding">
      <Card>
        <CardHeader>
          <CardTitle>Máquinas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Gerencie as máquinas da sua empresa.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Buscar máquinas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={refreshMachines} variant="outline">
                Atualizar
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Máquina
              </Button>
            </div>
          </div>

          <MachinesTable 
            machines={paginatedMachines}
            isLoading={isLoading}
            onRefresh={refreshMachines}
          />

          {!isLoading && filteredMachines.length > itemsPerPage && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          <div className="text-sm text-muted-foreground">
            Total de máquinas: {filteredMachines.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
