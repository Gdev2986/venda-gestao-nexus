
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  MoreHorizontal, 
  Search, 
  Edit, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { useSupportRequests } from "@/hooks/logistics/use-support-requests";
import { useDialog } from "@/hooks/use-dialog";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/components/payments/PaymentTableColumns";
import { Badge } from "@/components/ui/badge";

interface SupportRequestStatusProps {
  status: string;
}

const SupportRequestStatus = ({ status }: SupportRequestStatusProps) => {
  switch (status) {
    case 'PENDING':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pendente
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Em Andamento
        </Badge>
      );
    case 'COMPLETED':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Concluído
        </Badge>
      );
    case 'CANCELED':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Cancelado
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          {status}
        </Badge>
      );
  }
};

interface SupportRequestPriorityProps {
  priority: string;
}

const SupportRequestPriority = ({ priority }: SupportRequestPriorityProps) => {
  switch (priority) {
    case 'HIGH':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          Alta
        </Badge>
      );
    case 'MEDIUM':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          Média
        </Badge>
      );
    case 'LOW':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Baixa
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          {priority}
        </Badge>
      );
  }
};

const ServiceList = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { 
    requests, 
    isLoading, 
    error,
    updateRequest 
  } = useSupportRequests({ 
    enableRealtime: true, 
    initialFetch: true 
  });

  const serviceDetailsDialog = useDialog();
  const serviceEditDialog = useDialog();
  const scheduleDialog = useDialog();
  
  // Filter requests based on selected filters and search term
  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    
    const matchesSearch = 
      searchTerm === "" || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.client && request.client.business_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesType && matchesPriority && matchesSearch;
  });
  
  // Get unique values for filters
  const uniqueTypes = [...new Set(requests.map(r => r.type))];
  const uniqueStatuses = [...new Set(requests.map(r => r.status))];
  const uniquePriorities = [...new Set(requests.map(r => r.priority))];
  
  // Handle status change
  const handleStatusChange = async (requestId: string, newStatus: string) => {
    await updateRequest(requestId, { status: newStatus });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive mb-2">Erro ao carregar solicitações</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar solicitações..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status === 'PENDING' ? 'Pendente' : 
                   status === 'IN_PROGRESS' ? 'Em Andamento' : 
                   status === 'COMPLETED' ? 'Concluído' : 
                   status === 'CANCELED' ? 'Cancelado' : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              {uniquePriorities.map(priority => (
                <SelectItem key={priority} value={priority}>
                  {priority === 'HIGH' ? 'Alta' : 
                   priority === 'MEDIUM' ? 'Média' : 
                   priority === 'LOW' ? 'Baixa' : priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Requests Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhuma solicitação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-xs">
                      {request.id?.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {request.client?.business_name || 'N/A'}
                    </TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>
                      <SupportRequestPriority priority={request.priority} />
                    </TableCell>
                    <TableCell>
                      <SupportRequestStatus status={request.status} />
                    </TableCell>
                    <TableCell>{request.created_at ? formatDate(request.created_at) : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center"
                            onClick={() => serviceDetailsDialog.openWith(request)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Visualizar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center"
                            onClick={() => serviceEditDialog.openWith(request)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center"
                            onClick={() => scheduleDialog.openWith(request)}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Agendar</span>
                          </DropdownMenuItem>
                          
                          {request.status !== 'COMPLETED' && (
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center text-green-600"
                              onClick={() => handleStatusChange(request.id!, 'COMPLETED')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Marcar como Concluído</span>
                            </DropdownMenuItem>
                          )}
                          
                          {request.status !== 'CANCELED' && (
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center text-red-600"
                              onClick={() => handleStatusChange(request.id!, 'CANCELED')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              <span>Cancelar</span>
                            </DropdownMenuItem>
                          )}
                          
                          {request.status !== 'IN_PROGRESS' && request.status !== 'COMPLETED' && request.status !== 'CANCELED' && (
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center text-blue-600"
                              onClick={() => handleStatusChange(request.id!, 'IN_PROGRESS')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Iniciar Atendimento</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceList;
