
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
import { PATHS } from "@/routes/paths";

const LogisticsOperations = () => {
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
          <TabsTrigger value="routes">Rotas</TabsTrigger>
          <TabsTrigger value="inventory">Inventário</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <Select defaultValue="today">
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
            
            <Select defaultValue="all">
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
                          <Button variant="outline" size="sm">Detalhes</Button>
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
                          <Button variant="outline" size="sm">Detalhes</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Controle de inventário será exibido aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="reports">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Relatórios de operações serão exibidos aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsOperations;
