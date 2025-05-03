
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/routes/paths";

const LogisticsSupport = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Chamados de Suporte" 
        description="Gerencie chamados de suporte técnico e assistência"
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Chamado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="technical">Técnico</SelectItem>
            <SelectItem value="maintenance">Manutenção</SelectItem>
            <SelectItem value="replacement">Substituição</SelectItem>
            <SelectItem value="supplies">Materiais</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="pending">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="inProgress">Em andamento</SelectItem>
            <SelectItem value="scheduled">Agendados</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="priority">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas prioridades</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline">Filtrar</Button>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="inProgress">Em Andamento</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Problema</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "#5001", client: "Cliente ABC", type: "Técnico", issue: "Máquina não liga", date: "22/04/2025", priority: "Alta" },
                  { id: "#4998", client: "Cliente XYZ", type: "Material", issue: "Solicitação de bobinas", date: "21/04/2025", priority: "Média" },
                  { id: "#4997", client: "Cliente DEF", type: "Manutenção", issue: "Erro na leitura de cartões", date: "21/04/2025", priority: "Alta" },
                  { id: "#4996", client: "Cliente GHI", type: "Técnico", issue: "Tela travando", date: "20/04/2025", priority: "Média" },
                  { id: "#4995", client: "Cliente JKL", type: "Material", issue: "Solicitação de bobinas", date: "20/04/2025", priority: "Baixa" },
                ].map((ticket, i) => (
                  <TableRow key={i}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.client}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.type === "Técnico" ? "bg-red-50 text-red-700" : 
                        ticket.type === "Material" ? "bg-green-50 text-green-700" : 
                        "bg-yellow-50 text-yellow-700"
                      }`}>
                        {ticket.type}
                      </span>
                    </TableCell>
                    <TableCell>{ticket.issue}</TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.priority === "Alta" ? "bg-red-50 text-red-700" : 
                        ticket.priority === "Média" ? "bg-yellow-50 text-yellow-700" : 
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm">Atender</Button>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="inProgress">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Problema</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "#4994", client: "Cliente MNO", type: "Técnico", issue: "Problema de conexão", date: "20/04/2025", responsible: "Técnico A" },
                  { id: "#4993", client: "Cliente PQR", type: "Manutenção", issue: "Troca de bateria", date: "19/04/2025", responsible: "Técnico B" },
                ].map((ticket, i) => (
                  <TableRow key={i}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.client}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.type === "Técnico" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {ticket.type}
                      </span>
                    </TableCell>
                    <TableCell>{ticket.issue}</TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>{ticket.responsible}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm">Concluir</Button>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Chamados agendados serão exibidos aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="completed">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Chamados concluídos serão exibidos aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estoque de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Bobinas</p>
                  <p className="text-sm text-muted-foreground">80mm x 30m</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">15 unidades</p>
                  <p className="text-xs text-red-600">Estoque baixo</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Carregadores</p>
                  <p className="text-sm text-muted-foreground">Padrão</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">32 unidades</p>
                  <p className="text-xs text-green-600">Estoque suficiente</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Baterias</p>
                  <p className="text-sm text-muted-foreground">Terminal Pro</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">8 unidades</p>
                  <p className="text-xs text-yellow-600">Estoque médio</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-2">Gerenciar Estoque</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Equipe Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Técnico A</p>
                  <p className="text-sm text-muted-foreground">2 chamados em andamento</p>
                </div>
                <div className="px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-medium">
                  Ocupado
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Técnico B</p>
                  <p className="text-sm text-muted-foreground">1 chamado em andamento</p>
                </div>
                <div className="px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-medium">
                  Ocupado
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Técnico C</p>
                  <p className="text-sm text-muted-foreground">Sem chamados</p>
                </div>
                <div className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">
                  Disponível
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-2">Ver Escala</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tempo médio de atendimento</p>
                <p className="text-xl font-medium">24 horas</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chamados concluídos (Abril)</p>
                <p className="text-xl font-medium">42</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Satisfação do cliente</p>
                <p className="text-xl font-medium">4.8 / 5.0</p>
              </div>
              
              <Button variant="outline" className="w-full mt-2">Ver Relatório</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogisticsSupport;
