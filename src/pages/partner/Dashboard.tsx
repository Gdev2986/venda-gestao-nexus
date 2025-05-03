
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router-dom";

const PartnerDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Painel do Parceiro" 
        description="Bem-vindo de volta! Aqui está o resumo da sua conta."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comissões Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4.578,90</div>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to={PATHS.PARTNER.COMMISSIONS}>Solicitar pagamento</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Indicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-muted-foreground mt-2">+3 este mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendas Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37</div>
            <p className="text-sm text-muted-foreground mt-2">R$ 158.420,00 em volume</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle>Últimas Vendas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { client: "Cliente ABC", date: "22/04/2025", value: "R$ 3.500,00", commission: "R$ 350,00", status: "Aprovada" },
                    { client: "Cliente XYZ", date: "20/04/2025", value: "R$ 2.800,00", commission: "R$ 280,00", status: "Aprovada" },
                    { client: "Cliente 123", date: "18/04/2025", value: "R$ 5.100,00", commission: "R$ 510,00", status: "Pendente" },
                    { client: "Cliente DEF", date: "15/04/2025", value: "R$ 4.200,00", commission: "R$ 420,00", status: "Aprovada" },
                  ].map((sale, i) => (
                    <TableRow key={i}>
                      <TableCell>{sale.client}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.value}</TableCell>
                      <TableCell>{sale.commission}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          sale.status === "Aprovada" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                        }`}>
                          {sale.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 text-center border-t">
                <Button variant="link" asChild>
                  <Link to={PATHS.PARTNER.SALES}>Ver todas as vendas</Link>
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
                  <Link to={PATHS.PARTNER.CLIENTS}>Adicionar Cliente</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={PATHS.PARTNER.COMMISSIONS}>Solicitar Pagamento</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={PATHS.PARTNER.REPORTS}>Ver Relatório</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Desempenho Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Clientes novos</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xl font-medium">3</span>
                    <span className="text-sm text-green-600">+50%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1">
                    <div className="bg-primary h-2 rounded-full w-3/5"></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Vendas</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xl font-medium">7</span>
                    <span className="text-sm text-green-600">+16%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1">
                    <div className="bg-primary h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Comissões</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xl font-medium">R$ 1.560,00</span>
                    <span className="text-sm text-green-600">+23%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1">
                    <div className="bg-primary h-2 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
