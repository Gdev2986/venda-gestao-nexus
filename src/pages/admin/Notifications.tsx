
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/routes/paths";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminNotifications = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Central de Notificações" 
        description="Envie e gerencie notificações do sistema"
      />
      
      <Tabs defaultValue="new">
        <TabsList className="mb-6">
          <TabsTrigger value="new">Nova Notificação</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Nova Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="title">
                    Título
                  </label>
                  <Input id="title" placeholder="Título da notificação" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="target">
                    Destinatários
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Selecione os destinatários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os usuários</SelectItem>
                      <SelectItem value="clients">Apenas clientes</SelectItem>
                      <SelectItem value="partners">Apenas parceiros</SelectItem>
                      <SelectItem value="admins">Apenas administradores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="message">
                    Mensagem
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Digite a mensagem da notificação..." 
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="pt-4">
                  <Button className="mr-2">Enviar Agora</Button>
                  <Button variant="outline">Salvar Rascunho</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Destinatários</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { title: "Atualização do Sistema", target: "Todos", date: "10/04/2025", status: "Enviado" },
                  { title: "Novos Recursos Disponíveis", target: "Clientes", date: "05/04/2025", status: "Enviado" },
                  { title: "Manutenção Programada", target: "Todos", date: "01/04/2025", status: "Enviado" },
                  { title: "Promoção para Parceiros", target: "Parceiros", date: "28/03/2025", status: "Enviado" },
                  { title: "Atualização de Segurança", target: "Todos", date: "15/03/2025", status: "Enviado" },
                ].map((notification, i) => (
                  <TableRow key={i}>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell>{notification.target}</TableCell>
                    <TableCell>{notification.date}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                        {notification.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="templates">
          <PageWrapper>
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-medium">Templates de Notificação</h3>
              <Button>Criar Template</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Boas-vindas",
                "Manutenção Programada",
                "Nova Funcionalidade",
                "Alerta de Segurança",
                "Confirmação de Pagamento",
                "Fatura Disponível"
              ].map((template, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{template}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Template para {template.toLowerCase()}</p>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">Editar</Button>
                      <Button size="sm">Usar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
