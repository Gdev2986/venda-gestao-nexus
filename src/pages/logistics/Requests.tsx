
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for requests
  const mockRequests = [
    {
      id: "REQ001",
      clientName: "Empresa ABC Ltda",
      clientContact: "contato@empresaabc.com",
      requestType: "Troca de máquina",
      requestDate: "2025-05-04T14:30:00",
      status: "pending",
      address: "Av. Paulista, 1000 - São Paulo, SP",
      details: "Terminal apresentando falha na leitura de cartões"
    },
    {
      id: "REQ002",
      clientName: "Comércio XYZ",
      clientContact: "admin@comercioxyz.com",
      requestType: "Envio de bobinas",
      requestDate: "2025-05-05T09:15:00",
      status: "in-progress",
      address: "Rua Augusta, 500 - São Paulo, SP",
      details: "Solicitação de 20 bobinas para terminais"
    },
    {
      id: "REQ003",
      clientName: "Restaurante Sabor",
      clientContact: "contato@sabor.com",
      requestType: "Manutenção",
      requestDate: "2025-05-03T11:00:00",
      status: "completed",
      address: "Alameda Santos, 800 - São Paulo, SP",
      details: "Manutenção preventiva nos terminais"
    }
  ];

  // Filter requests based on active tab and search term
  const filteredRequests = mockRequests.filter(request => {
    const matchesTab = activeTab === "all" || request.status === activeTab;
    const matchesSearch = request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          request.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Em Andamento</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <>
      <PageHeader 
        title="Solicitações" 
        description="Gerencie as solicitações de clientes"
        actionLabel="Nova Solicitação"
        onActionClick={() => alert("Funcionalidade em desenvolvimento")}
      />
      
      <PageWrapper>
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente ou ID"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="in-progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluídos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{request.clientName}</h3>
                          <p className="text-sm text-muted-foreground">{request.id} • {new Date(request.requestDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          {getStatusLabel(request.status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Tipo de solicitação</h4>
                          <p className="text-sm">{request.requestType}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Contato</h4>
                          <p className="text-sm">{request.clientContact}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Endereço</h4>
                          <p className="text-sm">{request.address}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Detalhes</h4>
                          <p className="text-sm">{request.details}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        {request.status === "pending" && (
                          <Button variant="default" size="sm">Iniciar atendimento</Button>
                        )}
                        {request.status === "in-progress" && (
                          <Button variant="default" size="sm">Marcar como concluído</Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
};

export default Requests;
