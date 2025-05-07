
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Solicitações Recentes</CardTitle>
          <div className="flex space-x-2">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.client}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                    ${request.status === 'Pendente' ? 'bg-yellow-50 text-yellow-700' : ''}
                    ${request.status === 'Agendado' ? 'bg-blue-50 text-blue-700' : ''}
                    ${request.status === 'Concluído' ? 'bg-green-50 text-green-700' : ''}
                  `}>
                    {request.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhuma solicitação encontrada com os filtros selecionados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestsTable;
