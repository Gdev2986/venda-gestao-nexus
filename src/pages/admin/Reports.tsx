
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios" 
        description="Visualize e exporte relatórios do sistema"
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <Select defaultValue="current">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Mês atual</SelectItem>
            <SelectItem value="last">Mês anterior</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
            <SelectItem value="year">Último ano</SelectItem>
            <SelectItem value="custom">Período personalizado</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline">Exportar Relatório</Button>
      </div>
      
      <Tabs defaultValue="sales">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="finances">Financeiro</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="partners">Parceiros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ 124.500,00</div>
                <p className="text-sm text-muted-foreground mt-2">+12% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Qtde. Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.432</div>
                <p className="text-sm text-muted-foreground mt-2">+8% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ 87,00</div>
                <p className="text-sm text-muted-foreground mt-2">+3% em relação ao período anterior</p>
              </CardContent>
            </Card>
          </div>
          
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Gráficos de vendas serão exibidos aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="finances">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Relatórios financeiros serão exibidos aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="clients">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Relatórios de clientes serão exibidos aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="partners">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Relatórios de parceiros serão exibidos aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
