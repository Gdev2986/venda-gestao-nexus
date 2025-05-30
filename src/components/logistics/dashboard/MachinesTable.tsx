
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
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'Em Manutenção':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Em Estoque':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <Card className="overflow-hidden dark:bg-gray-900 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="dark:text-gray-100">Resumo de Máquinas</CardTitle>
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[180px] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                <SelectItem value="all" className="dark:text-gray-200 dark:hover:bg-gray-700">Todos os Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status} className="dark:text-gray-200 dark:hover:bg-gray-700">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Ver Todas</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden dark:border-gray-700">
          <Table>
            <TableHeader className="bg-muted/50 dark:bg-gray-800/50">
              <TableRow className="dark:border-gray-700">
                <TableHead className="dark:text-gray-300">Serial</TableHead>
                <TableHead className="dark:text-gray-300">Modelo</TableHead>
                <TableHead className="dark:text-gray-300">Status</TableHead>
                <TableHead className="dark:text-gray-300">Local</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.map((machine, idx) => (
                <motion.tr
                  key={machine.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-card hover:bg-muted/50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="font-medium dark:text-gray-200">{machine.serial}</TableCell>
                  <TableCell className="dark:text-gray-300">{machine.model}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${getStatusClass(machine.status)}`}>
                      {machine.status}
                    </span>
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{machine.location}</TableCell>
                </motion.tr>
              ))}
              {filteredMachines.length === 0 && (
                <TableRow className="dark:border-gray-700">
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
