
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ShoppingBag, CreditCard, Headphones, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sale, SaleDb } from "@/types";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      // Fetch client ID first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (clientError) {
        console.error("Error fetching client data:", clientError);
        return;
      }

      if (clientData) {
        const clientId = clientData.id;

        // Fetch sales data
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .eq('client_id', clientId)
          .order('date', { ascending: false })
          .limit(10);

        if (salesError) {
          console.error("Error fetching sales:", salesError);
        } else if (salesData) {
          // Convert database sales to application Sales type
          const formattedSales: Sale[] = salesData.map((sale: SaleDb) => ({
            id: sale.id,
            code: sale.code,
            date: new Date(sale.date),
            terminal: sale.terminal,
            grossAmount: sale.gross_amount,
            netAmount: sale.net_amount,
            paymentMethod: sale.payment_method,
            clientId: sale.client_id
          }));
          
          setSales(formattedSales);
        }

        // Fetch machines data
        const { data: machinesData, error: machinesError } = await supabase
          .from('machines')
          .select('*')
          .eq('client_id', clientId);

        if (machinesError) {
          console.error("Error fetching machines:", machinesError);
        } else {
          setMachines(machinesData || []);
        }

        // Mock balance calculation
        // In a real application, you would fetch this from a balance table or calculate it
        const totalSales = salesData?.reduce((sum: number, sale: SaleDb) => sum + Number(sale.net_amount), 0) || 0;
        setCurrentBalance(totalSales);
      }
    } catch (error) {
      console.error("Error fetching client dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportRequest = () => {
    toast({
      title: "Solicitação de suporte",
      description: "Sua solicitação foi recebida. Um de nossos atendentes entrará em contato em breve."
    });
  };

  const handleSupplyRequest = () => {
    toast({
      title: "Solicitação de bobinas",
      description: "Sua solicitação de bobinas foi registrada. Vamos processá-la em breve."
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meu Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {currentBalance.toFixed(2)}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => window.location.href = "/payments"}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Solicitar Pagamento
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Minhas Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {machines.length}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => window.location.href = "/machines"}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ver Máquinas
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSupportRequest}
              >
                <Headphones className="mr-2 h-4 w-4" />
                Solicitar Assistência
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSupplyRequest}
              >
                <Truck className="mr-2 h-4 w-4" />
                Solicitar Bobinas
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Minhas Vendas</TabsTrigger>
            <TabsTrigger value="machines">Minhas Máquinas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Vendas</CardTitle>
                <CardDescription>
                  Suas transações mais recentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner"></div>
                  </div>
                ) : sales.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left">Data</th>
                          <th className="py-2 px-4 text-left">Código</th>
                          <th className="py-2 px-4 text-left">Terminal</th>
                          <th className="py-2 px-4 text-right">Valor Bruto</th>
                          <th className="py-2 px-4 text-right">Valor Líquido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.map((sale) => (
                          <tr key={sale.id} className="border-b">
                            <td className="py-2 px-4">
                              {new Date(sale.date).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4">{sale.code}</td>
                            <td className="py-2 px-4">{sale.terminal}</td>
                            <td className="py-2 px-4 text-right">
                              R$ {Number(sale.grossAmount).toFixed(2)}
                            </td>
                            <td className="py-2 px-4 text-right">
                              R$ {Number(sale.netAmount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma venda encontrada.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="machines" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Máquinas</CardTitle>
                <CardDescription>
                  Máquinas vinculadas à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner"></div>
                  </div>
                ) : machines.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left">Modelo</th>
                          <th className="py-2 px-4 text-left">Número de Série</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {machines.map((machine) => (
                          <tr key={machine.id} className="border-b">
                            <td className="py-2 px-4">{machine.model}</td>
                            <td className="py-2 px-4">{machine.serial_number}</td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${machine.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {machine.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleSupportRequest}
                              >
                                Suporte
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma máquina encontrada.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClientDashboard;
