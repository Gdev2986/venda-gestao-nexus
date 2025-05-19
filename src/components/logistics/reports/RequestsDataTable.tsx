
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileDown, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RequestsDataTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock data - to be replaced with actual data
  const requests = [
    {
      id: "1",
      client: "Supermercado ABC",
      type: "Instalação",
      status: "Concluído",
      created_at: "2025-05-01",
      completed_at: "2025-05-03",
      sla_days: 2,
      technician: "João Silva"
    },
    {
      id: "2",
      client: "Restaurante XYZ",
      type: "Manutenção",
      status: "Em andamento",
      created_at: "2025-05-10",
      completed_at: null,
      sla_days: 3,
      technician: "Maria Oliveira"
    },
    {
      id: "3",
      client: "Farmácia Central",
      type: "Substituição",
      status: "Pendente",
      created_at: "2025-05-15",
      completed_at: null,
      sla_days: 2,
      technician: "Pedro Santos"
    },
    {
      id: "4",
      client: "Padaria Bom Pão",
      type: "Bobinas",
      status: "Concluído",
      created_at: "2025-05-08",
      completed_at: "2025-05-09",
      sla_days: 1,
      technician: "Ana Costa"
    },
    {
      id: "5",
      client: "Loja de Roupas Fashion",
      type: "Manutenção",
      status: "Cancelado",
      created_at: "2025-05-05",
      completed_at: null,
      sla_days: 3,
      technician: "-"
    }
  ];
  
  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.technician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, técnico..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em andamento">Em andamento</SelectItem>
              <SelectItem value="concluído">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead>Data Conclusão</TableHead>
              <TableHead>SLA (dias)</TableHead>
              <TableHead>Técnico</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma solicitação encontrada com os filtros selecionados
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.client}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                      ${request.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${request.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' : ''}
                      ${request.status === 'Concluído' ? 'bg-green-100 text-green-800' : ''}
                      ${request.status === 'Cancelado' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>{request.created_at}</TableCell>
                  <TableCell>{request.completed_at || "-"}</TableCell>
                  <TableCell>{request.sla_days}</TableCell>
                  <TableCell>{request.technician}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RequestsDataTable;
