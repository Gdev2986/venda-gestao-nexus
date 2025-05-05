
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, X, Calendar, MapPin, Truck, Box } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LogisticsOperations = () => {
  const { toast } = useToast();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState("today");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    toast({
      title: "Status atualizado",
      description: `A solicitação foi marcada como ${newStatus}`,
    });
    setIsDetailsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Operações Logísticas" 
        description="Gerencie entregas, instalações e manutenções"
        actionLabel="Nova Operação"
        actionLink="#"
      />
      
      <Tabs defaultValue="schedule">
        <TabsList className="mb-6">
          <TabsTrigger value="schedule">Cronograma</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="routes">Rotas</TabsTrigger>
          <TabsTrigger value="inventory">Inventário</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="tomorrow">Amanhã</SelectItem>
                <SelectItem value="next7">Próximos 7 dias</SelectItem>
                <SelectItem value="next30">Próximos 30 dias</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="delivery">Entregas</SelectItem>
                <SelectItem value="installation">Instalações</SelectItem>
                <SelectItem value="maintenance">Manutenções</SelectItem>
                <SelectItem value="collection">Recolhimentos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">Filtrar</Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cronograma de Hoje - 23/04/2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 flex justify-between items-center">
                    <div className="font-medium">Manhã</div>
                    <div className="text-sm text-muted-foreground">08:00 - 12:00</div>
                  </div>
                  <div className="divide-y">
                    {[
                      { time: "09:30 - 10:30", client: "Cliente ABC", address: "Av. Exemplo, 123", type: "Instalação", status: "Em rota" },
                      { time: "11:00 - 12:00", client: "Cliente XYZ", address: "Rua Teste, 456", type: "Manutenção", status: "Pendente" },
                    ].map((task, i) => (
                      <div key={i} className="flex p-4 items-center">
                        <div className="w-24 text-sm font-medium">{task.time}</div>
                        <div className="flex-1 ml-4">
                          <p className="font-medium">{task.client}</p>
                          <p className="text-sm text-muted-foreground">{task.address}</p>
                        </div>
                        <div className="mr-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            task.type === "Instalação" ? "bg-green-50 text-green-700" : 
                            task.type === "Manutenção" ? "bg-orange-50 text-orange-700" : 
                            "bg-blue-50 text-blue-700"
                          }`}>
                            {task.type}
                          </span>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(task)}>Detalhes</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 flex justify-between items-center">
                    <div className="font-medium">Tarde</div>
                    <div className="text-sm text-muted-foreground">13:00 - 18:00</div>
                  </div>
                  <div className="divide-y">
                    {[
                      { time: "14:30 - 15:30", client: "Cliente DEF", address: "Rua Modelo, 789", type: "Instalação", status: "Pendente" },
                      { time: "16:00 - 17:00", client: "Cliente GHI", address: "Av. Padrão, 321", type: "Entrega", status: "Pendente" },
                    ].map((task, i) => (
                      <div key={i} className="flex p-4 items-center">
                        <div className="w-24 text-sm font-medium">{task.time}</div>
                        <div className="flex-1 ml-4">
                          <p className="font-medium">{task.client}</p>
                          <p className="text-sm text-muted-foreground">{task.address}</p>
                        </div>
                        <div className="mr-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            task.type === "Instalação" ? "bg-green-50 text-green-700" : 
                            task.type === "Manutenção" ? "bg-orange-50 text-orange-700" : 
                            task.type === "Entrega" ? "bg-blue-50 text-blue-700" :
                            "bg-purple-50 text-purple-700"
                          }`}>
                            {task.type}
                          </span>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(task)}>Detalhes</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data Solicitada</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { client: "Restaurante Sabores", type: "Manutenção", date: "23/04/2025", time: "09:30", address: "Av. Central, 123", status: "Agendado" },
                  { client: "Café Expresso", type: "Instalação", date: "24/04/2025", time: "14:00", address: "Rua dos Cafés, 456", status: "Pendente" },
                  { client: "Farmácia Popular", type: "Troca", date: "25/04/2025", time: "10:15", address: "Av. Saúde, 789", status: "Confirmado" },
                  { client: "Mercado Economia", type: "Suprimentos", date: "23/04/2025", time: "11:00", address: "Rua Comercial, 234", status: "Em andamento" },
                  { client: "Petshop Amigo", type: "Instalação", date: "26/04/2025", time: "15:30", address: "Av. dos Pets, 567", status: "Pendente" },
                ].map((request, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{request.client}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        request.type === "Instalação" ? "bg-green-50 text-green-700" : 
                        request.type === "Manutenção" ? "bg-orange-50 text-orange-700" : 
                        request.type === "Troca" ? "bg-purple-50 text-purple-700" :
                        request.type === "Suprimentos" ? "bg-blue-50 text-blue-700" :
                        "bg-gray-50 text-gray-700"
                      }`}>
                        {request.type}
                      </span>
                    </TableCell>
                    <TableCell>{`${request.date} ${request.time}`}</TableCell>
                    <TableCell>{request.address}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        request.status === "Pendente" ? "bg-yellow-50 text-yellow-700" : 
                        request.status === "Confirmado" ? "bg-indigo-50 text-indigo-700" : 
                        request.status === "Agendado" ? "bg-blue-50 text-blue-700" :
                        request.status === "Em andamento" ? "bg-green-50 text-green-700" :
                        "bg-gray-50 text-gray-700"
                      }`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(request)}
                        >
                          Detalhes
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-green-600"
                          onClick={() => {
                            toast({
                              title: "Status atualizado",
                              description: `A solicitação para ${request.client} foi marcada como concluída`,
                            });
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="routes">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Mapa de rotas será exibido aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="inventory">
          <PageWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Inventário de Suprimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Quantidade Atual</TableHead>
                      <TableHead>Nível Mínimo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { item: "Bobina Térmica 80mm", category: "Suprimentos", quantity: 240, minimum: 100, status: "Estoque normal" },
                      { item: "Bobina Térmica 57mm", category: "Suprimentos", quantity: 45, minimum: 50, status: "Estoque baixo" },
                      { item: "Cabo de Alimentação", category: "Peças", quantity: 18, minimum: 20, status: "Estoque baixo" },
                      { item: "Terminal POS Mini", category: "Máquinas", quantity: 12, minimum: 5, status: "Estoque normal" },
                      { item: "Terminal POS Padrão", category: "Máquinas", quantity: 28, minimum: 10, status: "Estoque normal" },
                      { item: "Placa de Comunicação 4G", category: "Peças", quantity: 7, minimum: 10, status: "Estoque baixo" },
                    ].map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity} unid.</TableCell>
                        <TableCell>{item.minimum} unid.</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            item.status === "Estoque normal" ? "bg-green-50 text-green-700" : 
                            item.status === "Estoque baixo" ? "bg-yellow-50 text-yellow-700" : 
                            "bg-red-50 text-red-700"
                          }`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Solicitar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </PageWrapper>
        </TabsContent>
      </Tabs>
      
      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                  <p className="text-base">{selectedRequest.client}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
                  <p className="text-base">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      selectedRequest.type === "Instalação" ? "bg-green-50 text-green-700" : 
                      selectedRequest.type === "Manutenção" ? "bg-orange-50 text-orange-700" : 
                      selectedRequest.type === "Entrega" ? "bg-blue-50 text-blue-700" :
                      "bg-purple-50 text-purple-700"
                    }`}>
                      {selectedRequest.type}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data Agendada</h3>
                  <p className="text-base">{selectedRequest.time || `${selectedRequest.date} ${selectedRequest.time}`}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      selectedRequest.status === "Pendente" ? "bg-yellow-50 text-yellow-700" : 
                      selectedRequest.status === "Confirmado" ? "bg-indigo-50 text-indigo-700" : 
                      selectedRequest.status === "Agendado" ? "bg-blue-50 text-blue-700" :
                      selectedRequest.status === "Em rota" ? "bg-green-50 text-green-700" :
                      "bg-gray-50 text-gray-700"
                    }`}>
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                  <p className="text-base">{selectedRequest.address}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Detalhes Adicionais</h3>
                <Textarea 
                  readOnly 
                  value="O cliente solicitou verificação do terminal que está apresentando falhas intermitentes de conexão com a rede 4G."
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Atualizar Status</h3>
                <Select defaultValue="pending">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Comentários</h3>
                <Textarea placeholder="Adicione observações ou instruções para esta operação" />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleUpdateStatus("cancelado")}>
                <X className="h-4 w-4 mr-2" />
                Cancelar Operação
              </Button>
              <Button onClick={() => handleUpdateStatus("concluído")}>
                <Check className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LogisticsOperations;
