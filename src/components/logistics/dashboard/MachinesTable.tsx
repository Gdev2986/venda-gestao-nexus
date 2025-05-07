
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MachinesTable: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const machines = [
    {
      id: 1,
      serial: "SN-100001",
      model: "Terminal Pro",
      status: "Operando",
      location: "Cliente ABC"
    },
    {
      id: 2,
      serial: "SN-100002",
      model: "Terminal Standard",
      status: "Em Manutenção",
      location: "Centro Técnico"
    },
    {
      id: 3,
      serial: "SN-100003",
      model: "Terminal Pro",
      status: "Em Estoque",
      location: "Depósito Central"
    }
  ];
  
  const filteredMachines = statusFilter === "all" 
    ? machines 
    : machines.filter(machine => machine.status === statusFilter);
  
  // Extract unique statuses for filter
  const statuses = Array.from(new Set(machines.map(m => m.status)));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resumo de Máquinas</CardTitle>
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">Ver Todas</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Local</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.serial}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                    ${machine.status === 'Operando' ? 'bg-green-50 text-green-700' : ''}
                    ${machine.status === 'Em Manutenção' ? 'bg-yellow-50 text-yellow-700' : ''}
                    ${machine.status === 'Em Estoque' ? 'bg-blue-50 text-blue-700' : ''}
                  `}>
                    {machine.status}
                  </span>
                </TableCell>
                <TableCell>{machine.location}</TableCell>
              </TableRow>
            ))}
            {filteredMachines.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhuma máquina encontrada com o status selecionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MachinesTable;
