
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { LineChart, BarChart } from "@/components/charts";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/transactions/columns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { UserRole } from "@/types";
import ClientActions from "@/components/dashboard/ClientActions";
import { 
  Building, 
  CreditCard,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ClientDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingPayments: 0,
    completedPayments: 0,
    averageTicket: 0,
  });

  // Use a mock implementation since 'transactions' table doesn't exist yet
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock transactions data
        const mockTransactions = [
          { id: "1", date: new Date().toISOString(), amount: 1500, status: "completed" },
          { id: "2", date: new Date().toISOString(), amount: 2000, status: "completed" },
          { id: "3", date: new Date().toISOString(), amount: 1200, status: "pending" },
          { id: "4", date: new Date().toISOString(), amount: 800, status: "pending" },
          { id: "5", date: new Date().toISOString(), amount: 3000, status: "completed" },
        ];
        
        // Mock machines data
        const mockMachines = [
          { id: "1", model: "POS X200", serial_number: "SN12345678", status: "ACTIVE", created_at: new Date().toISOString() },
          { id: "2", model: "POS X300", serial_number: "SN87654321", status: "ACTIVE", created_at: new Date().toISOString() },
          { id: "3", model: "POS X100", serial_number: "SN11223344", status: "MAINTENANCE", created_at: new Date().toISOString() },
        ];
        
        // Calculate stats
        const totalSales = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        const pendingPayments = mockTransactions
          .filter(tx => tx.status === 'pending')
          .reduce((sum, tx) => sum + tx.amount, 0);
        const completedPayments = mockTransactions
          .filter(tx => tx.status === 'completed')
          .reduce((sum, tx) => sum + tx.amount, 0);
        const averageTicket = totalSales / (mockTransactions.length || 1);
        
        setTransactions(mockTransactions);
        setMachines(mockMachines);
        setStats({
          totalSales,
          pendingPayments,
          completedPayments,
          averageTicket,
        });

        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message,
        });
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  const salesData = [
    { name: "Jan", total: 1200 },
    { name: "Fev", total: 1900 },
    { name: "Mar", total: 1800 },
    { name: "Abr", total: 2100 },
    { name: "Mai", total: 2400 },
    { name: "Jun", total: 2200 },
    { name: "Jul", total: 2600 },
    { name: "Ago", total: 2900 },
    { name: "Set", total: 3100 },
    { name: "Out", total: 3300 },
    { name: "Nov", total: 3400 },
    { name: "Dez", total: 3600 },
  ];

  const paymentMethodsData = [
    { name: "Crédito", value: 60 },
    { name: "Débito", value: 25 },
    { name: "Pix", value: 15 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "INACTIVE":
        return <Badge className="bg-gray-500">Inativo</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-amber-500">Manutenção</Badge>;
      default:
        return <Badge className="bg-red-500">Bloqueado</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-36" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalSales)}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagamentos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-36" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.pendingPayments)}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagamentos Realizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-36" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.completedPayments)}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ticket Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-36" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.averageTicket)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="transactions">Transações</TabsTrigger>
                <TabsTrigger value="machines">Equipamentos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Vendas Mensais</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <LineChart data={salesData} />
                    </CardContent>
                  </Card>
                  
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Métodos de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChart data={paymentMethodsData} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="transactions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Últimas Transações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-2">
                        {Array(5).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : (
                      <DataTable columns={columns} data={transactions} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="machines" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Equipamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-2">
                        {Array(3).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : machines.length > 0 ? (
                      <div className="space-y-4">
                        {machines.map((machine) => (
                          <Card key={machine.id} className="border shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                  <div className="p-2 rounded-full bg-primary/10">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{machine.model}</h4>
                                    <p className="text-sm text-muted-foreground">Serial: {machine.serial_number}</p>
                                  </div>
                                </div>
                                <div>
                                  {getStatusBadge(machine.status)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Building className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium">Nenhum equipamento encontrado</h3>
                        <p className="text-muted-foreground mt-1">
                          Você não tem equipamentos registrados atualmente.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <ClientActions />
            
            <Card>
              <CardHeader>
                <CardTitle>Próximos Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array(2).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium">Fatura mensal</p>
                        <p className="text-sm text-muted-foreground">Vencimento em 15/05/2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(399)}</p>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pendente</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
                      <div className="flex gap-2 items-center">
                        <p className="font-medium">Taxa de processamento</p>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(120.50)}</p>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Pago</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Manutenção preventiva</p>
                      <p className="text-sm text-muted-foreground">15/05/2025 • 14:00</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Vencimento de fatura</p>
                      <p className="text-sm text-muted-foreground">20/05/2025 • Final do dia</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientDashboard;
