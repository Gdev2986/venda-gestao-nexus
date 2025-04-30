
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

const ClientDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
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
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClientDashboard;
