
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MachinesTable } from "./MachinesTable";
import { useMachines } from "@/hooks/use-machines";
import TablePagination from "@/components/ui/table-pagination";

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

          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <div className="text-sm text-muted-foreground">
            Total de máquinas: {filteredMachines.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
