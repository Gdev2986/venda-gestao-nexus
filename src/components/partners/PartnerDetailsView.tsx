
import { useState } from "react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { Partner } from "@/types";
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenIcon, TrashIcon, UserIcon } from "lucide-react";

interface PartnerDetailsViewProps {
  partner: Partner;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PartnerDetailsView = ({
  partner,
  onClose,
  onEdit,
  onDelete,
}: PartnerDetailsViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for performance chart
  const generateMockPerformanceData = () => {
    const months = ["Jan", "Fev", "Mar"];
    return months.map(month => {
      // Use partner ID to deterministically generate random values
      const hash = partner.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const baseValue = (hash % 5000) + 3000;
      
      return {
        name: month,
        vendas_brutas: baseValue + Math.floor(Math.random() * 2000),
        vendas_liquidas: baseValue * 0.85 + Math.floor(Math.random() * 1000),
        comissao: baseValue * partner.commission_rate / 100
      };
    });
  };

  const performanceData = generateMockPerformanceData();

  // Mock data for commission requests
  const generateMockCommissionRequests = () => {
    const requests = [];
    // Use partner ID to deterministically generate the number of requests
    const hash = partner.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = (hash % 5) + 2; // 2-6 requests
    
    const statuses = ["PENDING", "APPROVED", "REJECTED"];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 5)); // Every 5 days back
      
      const requestHash = hash + i;
      const amount = (requestHash % 1000) + 500;
      const statusIndex = i % 3;
      
      requests.push({
        id: `req_${i}_${partner.id.substring(0, 5)}`,
        date: format(date, "dd/MM/yyyy"),
        amount: amount,
        status: statuses[statusIndex],
        description: `Comissão de vendas - ${format(date, "MMM yyyy")}`
      });
    }
    
    return requests;
  };

  const commissionRequests = generateMockCommissionRequests();

  // Mock data for linked clients
  const generateMockClients = () => {
    const clients = [];
    // Use partner ID to deterministically generate the number of clients
    const hash = partner.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = (hash % 8) + 3; // 3-10 clients
    
    for (let i = 0; i < count; i++) {
      const clientHash = hash + i;
      const now = new Date();
      const date = new Date(now);
      date.setDate(date.getDate() - (clientHash % 90)); // Up to 90 days back
      
      clients.push({
        id: `client_${i}_${partner.id.substring(0, 5)}`,
        name: `Cliente ${i + 1}`,
        document: `${12345678900 + i}`,
        since: format(date, "dd/MM/yyyy"),
        sales: (clientHash % 10) + 1
      });
    }
    
    return clients;
  };

  const linkedClients = generateMockClients();

  // Calculate total commission
  const totalCommission = commissionRequests.reduce((sum, req) => 
    req.status === "APPROVED" ? sum + req.amount : sum, 0);

  return (
    <DialogContent className="sm:max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-2xl">{partner.business_name || partner.company_name}</DialogTitle>
        <DialogDescription>
          Detalhes e métricas do parceiro
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 -mx-6">
          <div className="px-6">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Nome:</dt>
                        <dd>{partner.company_name}</dd>
                      </div>
                      {partner.business_name && partner.business_name !== partner.company_name && (
                        <div>
                          <dt className="text-muted-foreground">Nome Fantasia:</dt>
                          <dd>{partner.business_name}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-muted-foreground">Email:</dt>
                        <dd>{partner.email || "Não informado"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Telefone:</dt>
                        <dd>{partner.phone || "Não informado"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Contato:</dt>
                        <dd>{partner.contact_name || "Não informado"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Taxa de Comissão:</dt>
                        <dd>{partner.commission_rate}%</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Criado em:</dt>
                        <dd>{format(new Date(partner.created_at), "dd/MM/yyyy")}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Resumo Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-muted-foreground text-sm">Clientes Vinculados</p>
                        <p className="text-2xl font-bold">{linkedClients.length}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-muted-foreground text-sm">Comissão Total</p>
                        <p className="text-2xl font-bold">R$ {totalCommission.toFixed(2).replace(".", ",")}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-muted-foreground text-sm">Status</p>
                        <p>
                          <Badge 
                            variant={partner.id.length % 2 === 0 ? "outline" : "default"}
                            className={partner.id.length % 2 === 0 ? "border-yellow-500 text-yellow-500" : "bg-green-500/10 text-green-700"}
                          >
                            {partner.id.length % 2 === 0 ? "Inativo" : "Ativo"}
                          </Badge>
                        </p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-muted-foreground text-sm">Última Atualização</p>
                        <p className="font-medium">{format(new Date(partner.updated_at), "dd/MM/yyyy")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance de Vendas (Últimos 3 meses)</CardTitle>
                  <CardDescription>Vendas brutas, líquidas e comissão</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`R$ ${value.toFixed(2)}`, undefined]}
                          labelFormatter={(label) => `Mês: ${label}`}
                        />
                        <Bar dataKey="vendas_brutas" name="Vendas Brutas" fill="#8884d8" />
                        <Bar dataKey="vendas_liquidas" name="Vendas Líquidas" fill="#82ca9d" />
                        <Bar dataKey="comissao" name="Comissão" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Clientes Vinculados ({linkedClients.length})</CardTitle>
                  <CardDescription>Clientes adquiridos por este parceiro</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead className="hidden md:table-cell">Cliente desde</TableHead>
                        <TableHead className="text-right">Vendas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {linkedClients.map(client => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.document}</TableCell>
                          <TableCell className="hidden md:table-cell">{client.since}</TableCell>
                          <TableCell className="text-right">{client.sales}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commissions" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Histórico de Comissões</CardTitle>
                  <CardDescription>Solicitações de pagamento de comissão</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissionRequests.map(request => (
                        <TableRow key={request.id}>
                          <TableCell>{request.date}</TableCell>
                          <TableCell>{request.description}</TableCell>
                          <TableCell>R$ {request.amount.toFixed(2).replace(".", ",")}</TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={
                                request.status === "APPROVED" ? "default" : 
                                request.status === "PENDING" ? "outline" : "destructive"
                              }
                              className={
                                request.status === "APPROVED" ? "bg-green-500/10 text-green-700" : 
                                request.status === "PENDING" ? "border-yellow-500 text-yellow-500" : ""
                              }
                            >
                              {request.status === "APPROVED" ? "Aprovado" : 
                               request.status === "PENDING" ? "Pendente" : "Rejeitado"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      <DialogFooter className="pt-2 border-t gap-2 mt-auto">
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <PenIcon className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default PartnerDetailsView;
