
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Filter, Plus, RefreshCw, Wrench } from "lucide-react";
import { format } from "date-fns";
import { useSupportRequests } from "@/hooks/logistics/use-support-requests";
import { SupportRequest, SupportRequestStatus } from "@/types/support-request.types";

interface ServiceListProps {
  onOpenServiceForm?: () => void;
  onViewDetails?: (serviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  onOpenServiceForm,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const { supportRequests, isLoading, fetchSupportRequests } = useSupportRequests();
  
  // Filter requests based on the active tab
  const filteredRequests = supportRequests.filter((request) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return request.status === SupportRequestStatus.PENDING;
    if (activeTab === "progress") return request.status === SupportRequestStatus.IN_PROGRESS;
    if (activeTab === "completed") return request.status === SupportRequestStatus.COMPLETED;
    return true;
  });

  // Function to get the appropriate badge color based on status
  const getStatusBadge = (status: SupportRequestStatus) => {
    switch (status) {
      case SupportRequestStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case SupportRequestStatus.IN_PROGRESS:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case SupportRequestStatus.COMPLETED:
        return <Badge variant="outline" className="bg-green-100 text-green-800">Concluído</Badge>;
      case SupportRequestStatus.CANCELED:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Function to refresh the list
  const refreshList = () => {
    fetchSupportRequests();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Solicitações de Serviço</CardTitle>
            <CardDescription>Gerenciamento de pedidos de manutenção e suporte</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={refreshList}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            {onOpenServiceForm && (
              <Button size="sm" onClick={onOpenServiceForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-4 md:w-auto">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="progress">Em Andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="mx-auto h-12 w-12 mb-4" strokeWidth={1.5} />
                <h3 className="font-medium text-lg">Nenhuma solicitação encontrada</h3>
                <p className="mt-2">
                  {activeTab === "all"
                    ? "Não há solicitações de serviço registradas."
                    : `Não há solicitações de serviço com status "${activeTab}".`}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead className="hidden md:table-cell">Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-xs">
                          {request.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {request.created_at && format(new Date(request.created_at), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {/* This would normally display client name */}
                          Cliente #{request.client_id.substring(0, 5)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {onViewDetails && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDetails(request.id)}
                            >
                              Detalhes
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-6">
        <div>Total: {filteredRequests.length} solicitações</div>
        <div>
          <CheckCircle className="inline-block h-4 w-4 mr-1" />
          Concluídos:{" "}
          {supportRequests.filter((r) => r.status === SupportRequestStatus.COMPLETED).length}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceList;
