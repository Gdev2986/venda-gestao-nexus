
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router-dom";

const LogisticsDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Painel de Logística" 
        description="Gerencie entregas, instalações e estoque de máquinas"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Máquinas em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span>12 Terminais Pro</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span>20 Terminais Standard</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entregas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              <span>5 para instalação</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span>3 para manutenção</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Manutenções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span>4 urgentes</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
              <span>8 agendadas</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle>Entregas Agendadas para Hoje</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Endereço</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Horário</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-3 text-xs font-medium text-muted-foreground w-[100px]">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { client: "Cliente ABC", address: "Av. Exemplo, 123", type: "Instalação", time: "09:30", status: "Em rota" },
                    { client: "Cliente XYZ", address: "Rua Teste, 456", type: "Manutenção", time: "11:00", status: "Pendente" },
                    { client: "Cliente DEF", address: "Rua Modelo, 789", type: "Instalação", time: "14:30", status: "Pendente" },
                    { client: "Cliente GHI", address: "Av. Padrão, 321", type: "Entrega", time: "16:00", status: "Pendente" },
                  ].map((delivery, i) => (
                    <tr key={i}>
                      <td className="p-3">{delivery.client}</td>
                      <td className="p-3">{delivery.address}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          delivery.type === "Instalação" ? "bg-green-50 text-green-700" : 
                          delivery.type === "Manutenção" ? "bg-orange-50 text-orange-700" : 
                          "bg-blue-50 text-blue-700"
                        }`}>
                          {delivery.type}
                        </span>
                      </td>
                      <td className="p-3">{delivery.time}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          delivery.status === "Em rota" ? "bg-blue-50 text-blue-700" : "bg-yellow-50 text-yellow-700"
                        }`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="p-4 text-center border-t">
                <Button variant="link" asChild>
                  <Link to={PATHS.LOGISTICS.LOGISTICS_MODULE}>Ver cronograma completo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={PATHS.LOGISTICS.MACHINES}>Cadastrar Nova Máquina</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={PATHS.LOGISTICS.LOGISTICS_MODULE}>Agendar Entrega</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={PATHS.LOGISTICS.SUPPORT}>Ver Chamados</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="font-medium text-red-800">Estoque Baixo: Bobinas</p>
                  <p className="text-sm text-red-600">Restam apenas 15 unidades</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="font-medium text-yellow-800">3 manutenções atrasadas</p>
                  <p className="text-sm text-yellow-600">Atenção necessária</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="font-medium text-blue-800">Novo pedido: 10 terminais</p>
                  <p className="text-sm text-blue-600">Chegada prevista: 05/05/2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
