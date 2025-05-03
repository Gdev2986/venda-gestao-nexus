
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

const FinancialReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios Financeiros" 
        description="Visualize e exporte relatórios financeiros detalhados"
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 124.500,00</div>
            <p className="text-sm text-muted-foreground mt-2">+12% em relação ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 42.780,00</div>
            <p className="text-sm text-muted-foreground mt-2">+5% em relação ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 81.720,00</div>
            <p className="text-sm text-muted-foreground mt-2">+16% em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-md p-6 h-80 mb-6 flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de resumo financeiro será exibido aqui</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Destaques</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Taxa média de transação</p>
                      <p className="text-xl font-medium mt-1">2.4%</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Ticket médio</p>
                      <p className="text-xl font-medium mt-1">R$ 87,20</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Custo de aquisição de cliente</p>
                      <p className="text-xl font-medium mt-1">R$ 320,00</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Margem de lucro</p>
                      <p className="text-xl font-medium mt-1">65.6%</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Projeção para o próximo mês</h3>
                  <div className="p-4 border rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Receita projetada</p>
                        <p className="text-xl font-medium mt-1">R$ 135.000,00</p>
                        <p className="text-xs text-green-600">+8.4%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Despesas projetadas</p>
                        <p className="text-xl font-medium mt-1">R$ 45.000,00</p>
                        <p className="text-xs text-red-600">+5.2%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lucro projetado</p>
                        <p className="text-xl font-medium mt-1">R$ 90.000,00</p>
                        <p className="text-xs text-green-600">+10.1%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Detalhamento de receitas será exibido aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="expenses">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Detalhamento de despesas será exibido aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="commissions">
          <PageWrapper>
            <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Relatório de comissões será exibido aqui</p>
            </div>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReports;
