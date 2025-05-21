
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const RequestsTable: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const requests = [
    {
      id: 1,
      client: "Empresa A",
      type: "Instalação",
      date: "15/05/2025",
      status: "Pendente"
    },
    {
      id: 2,
      client: "Empresa B",
      type: "Manutenção",
      date: "16/05/2025",
      status: "Agendado"
    },
    {
      id: 3,
      client: "Empresa C",
      type: "Retirada",
      date: "17/05/2025",
      status: "Concluído"
    }
  ];
  
  const filteredRequests = requests.filter(request => 
    (statusFilter === "all" || request.status === statusFilter) &&
    (typeFilter === "all" || request.type === typeFilter)
  );
  
  // Extract unique types and statuses for filters
  const types = Array.from(new Set(requests.map(r => r.type)));
  const statuses = Array.from(new Set(requests.map(r => r.status)));

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Agendado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Concluído':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Solicitações Recentes</CardTitle>
          <div className="flex space-x-2 flex-wrap gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder="Status" />
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
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request, idx) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-card hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{request.client}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhuma solicitação encontrada com os filtros selecionados
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

export default RequestsTable;
