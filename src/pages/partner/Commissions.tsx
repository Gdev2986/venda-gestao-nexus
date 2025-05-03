
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { PATHS } from "@/routes/paths";

const PartnerCommissions = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Comissões" 
        description="Gerencie suas comissões e solicite pagamentos"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disponível para Saque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4.578,90</div>
            <Button className="mt-4">Solicitar Pagamento</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Processamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.200,00</div>
            <p className="text-sm text-muted-foreground mt-2">Previsão: 15/05/2025</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.780,00</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Comissões Pendentes</TabsTrigger>
          <TabsTrigger value="history">Histórico de Pagamentos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Venda</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { client: "Cliente ABC", sale: "#1001", date: "22/04/2025", commission: "R$ 350,00", status: "Disponível" },
                  { client: "Cliente XYZ", sale: "#1002", date: "20/04/2025", commission: "R$ 280,00", status: "Disponível" },
                  { client: "Cliente 123", sale: "#1003", date: "18/04/2025", commission: "R$ 510,00", status: "Em análise" },
                  { client: "Cliente DEF", sale: "#1004", date: "15/04/2025", commission: "R$ 420,00", status: "Disponível" },
                  { client: "Cliente GHI", sale: "#1005", date: "12/04/2025", commission: "R$ 390,00", status: "Em análise" },
                ].map((commission, i) => (
                  <TableRow key={i}>
                    <TableCell>{commission.client}</TableCell>
                    <TableCell>{commission.sale}</TableCell>
                    <TableCell>{commission.date}</TableCell>
                    <TableCell>{commission.commission}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        commission.status === "Disponível" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {commission.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="history">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "#4001", date: "10/04/2025", value: "R$ 2.340,00", method: "PIX", status: "Pago" },
                  { id: "#3994", date: "10/03/2025", value: "R$ 1.850,00", method: "PIX", status: "Pago" },
                  { id: "#3985", date: "10/02/2025", value: "R$ 2.180,00", method: "Transferência", status: "Pago" },
                  { id: "#3976", date: "10/01/2025", value: "R$ 1.990,00", method: "PIX", status: "Pago" },
                ].map((payment, i) => (
                  <TableRow key={i}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.value}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Comprovante</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Chave PIX</h3>
                    <p className="text-muted-foreground">CNPJ: 12.345.678/0001-00</p>
                    <Button variant="outline" className="mt-2" size="sm">Alterar</Button>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Conta Bancária</h3>
                    <p className="text-muted-foreground">Banco XYZ - Ag. 0001 - CC 12345-6</p>
                    <Button variant="outline" className="mt-2" size="sm">Alterar</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Notificações</h3>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="notification-commission" 
                      defaultChecked 
                      className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="notification-commission" className="text-sm">Notificar quando houver nova comissão</label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <input 
                      type="checkbox"
                      id="notification-payment" 
                      defaultChecked 
                      className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="notification-payment" className="text-sm">Notificar quando um pagamento for processado</label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Salvar Configurações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerCommissions;
