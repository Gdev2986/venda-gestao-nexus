
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Operando':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Em Manutenção':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Em Estoque':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  return (
    <Card className="overflow-hidden">
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
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Serial</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Local</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.map((machine, idx) => (
                <motion.tr
                  key={machine.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-card hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{machine.serial}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(machine.status)}`}>
                      {machine.status}
                    </span>
                  </TableCell>
                  <TableCell>{machine.location}</TableCell>
                </motion.tr>
              ))}
              {filteredMachines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhuma máquina encontrada com o status selecionado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachinesTable;
