
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PATHS } from "@/routes/paths";

const UserPayments = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meus Pagamentos" 
        description="Gerencie seus pagamentos e solicitações financeiras"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.245,78</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recebimentos (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.432,10</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próximo Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.245,78</div>
            <p className="text-sm text-muted-foreground mt-2">Previsto para 15/05/2025</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex justify-end">
        <Button>Solicitar Pagamento</Button>
      </div>
      
      <Tabs defaultValue="history">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { date: "10/04/2025", desc: "Pagamento automático", value: "R$ 1.240,80", status: "Concluído" },
                  { date: "10/03/2025", desc: "Pagamento automático", value: "R$ 1.452,30", status: "Concluído" },
                  { date: "10/02/2025", desc: "Pagamento automático", value: "R$ 1.678,20", status: "Concluído" },
                  { date: "10/01/2025", desc: "Pagamento automático", value: "R$ 1.320,50", status: "Concluído" },
                  { date: "10/12/2024", desc: "Pagamento automático", value: "R$ 1.195,75", status: "Concluído" },
                ].map((payment, i) => (
                  <TableRow key={i}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.desc}</TableCell>
                    <TableCell>{payment.value}</TableCell>
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
        
        <TabsContent value="requests">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>20/04/2025</TableCell>
                  <TableCell>Solicitação de saque</TableCell>
                  <TableCell>R$ 2.000,00</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                      Pendente
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Detalhes</Button>
                  </TableCell>
                </TableRow>
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
                    <p className="text-muted-foreground">CPF: 123.456.789-00</p>
                    <Button variant="outline" className="mt-2" size="sm">Alterar</Button>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Conta Bancária</h3>
                    <p className="text-muted-foreground">Banco XYZ - Ag. 0001 - CC 12345-6</p>
                    <Button variant="outline" className="mt-2" size="sm">Alterar</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Forma de Pagamento Preferida</h3>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio"
                      id="pix" 
                      name="paymentMethod" 
                      defaultChecked 
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="pix" className="text-sm font-medium">PIX</label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <input 
                      type="radio"
                      id="bankTransfer" 
                      name="paymentMethod" 
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="bankTransfer" className="text-sm font-medium">Transferência Bancária</label>
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

export default UserPayments;
