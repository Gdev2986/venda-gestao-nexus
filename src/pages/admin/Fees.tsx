
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const AdminFees = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Taxas e Comissões" 
        description="Configure as taxas do sistema e comissões para parceiros"
      />
      
      <Tabs defaultValue="transaction-fees">
        <TabsList className="mb-6">
          <TabsTrigger value="transaction-fees">Taxas de Transação</TabsTrigger>
          <TabsTrigger value="partner-commissions">Comissões de Parceiros</TabsTrigger>
          <TabsTrigger value="service-fees">Taxas de Serviço</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transaction-fees">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Taxas de Transação</h3>
                <Button>Adicionar Nova Taxa</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo de Transação</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Aplica a</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Taxa Padrão", type: "Pagamento", value: "2.5%", applies: "Todas transações", status: "Ativo" },
                    { name: "Taxa Parcelamento", type: "Crédito", value: "3.5%", applies: "Parcelamentos", status: "Ativo" },
                    { name: "Taxa Antecipação", type: "Antecipação", value: "1.8%", applies: "Antecipações", status: "Ativo" },
                    { name: "Taxa Premium", type: "Pagamento", value: "1.9%", applies: "Clientes Premium", status: "Ativo" },
                  ].map((fee, i) => (
                    <TableRow key={i}>
                      <TableCell>{fee.name}</TableCell>
                      <TableCell>{fee.type}</TableCell>
                      <TableCell>{fee.value}</TableCell>
                      <TableCell>{fee.applies}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                          {fee.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="partner-commissions">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Comissões de Parceiros</h3>
                <Button>Adicionar Nova Comissão</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo de Parceiro</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Condições</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Comissão Base", type: "Todos", value: "5%", conditions: "Todas vendas", status: "Ativo" },
                    { name: "Comissão Premium", type: "Premium", value: "8%", conditions: "Vendas > R$10.000", status: "Ativo" },
                    { name: "Comissão Loja", type: "Loja", value: "10%", conditions: "Primeira venda", status: "Ativo" },
                    { name: "Comissão Recorrente", type: "Todos", value: "2%", conditions: "Mensalidades", status: "Ativo" },
                  ].map((commission, i) => (
                    <TableRow key={i}>
                      <TableCell>{commission.name}</TableCell>
                      <TableCell>{commission.type}</TableCell>
                      <TableCell>{commission.value}</TableCell>
                      <TableCell>{commission.conditions}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                          {commission.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="service-fees">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Taxas de Serviço</h3>
                <Button>Adicionar Nova Taxa</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo de Serviço</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Taxa de Instalação", type: "Instalação", value: "R$ 150,00", description: "Por máquina", status: "Ativo" },
                    { name: "Taxa de Manutenção", type: "Manutenção", value: "R$ 80,00", description: "Por visita", status: "Ativo" },
                    { name: "Taxa de Bobina", type: "Material", value: "R$ 15,00", description: "Por bobina", status: "Ativo" },
                    { name: "Taxa de Cancelamento", type: "Administrativo", value: "R$ 250,00", description: "Por contrato", status: "Ativo" },
                  ].map((fee, i) => (
                    <TableRow key={i}>
                      <TableCell>{fee.name}</TableCell>
                      <TableCell>{fee.type}</TableCell>
                      <TableCell>{fee.value}</TableCell>
                      <TableCell>{fee.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                          {fee.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFees;
