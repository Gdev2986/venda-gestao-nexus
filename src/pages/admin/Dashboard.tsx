
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PATHS } from "@/routes/paths";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StatCards from "@/components/dashboard/admin/StatCards";
import SalesChart from "@/components/dashboard/admin/SalesChart";
import PaymentMethodsChart from "@/components/dashboard/admin/PaymentMethodsChart";
import RecentActivities from "@/components/dashboard/admin/RecentActivities";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, Download, RefreshCw } from "lucide-react";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalSales: 0,
    netSales: 0,
    totalClients: 0,
    totalMachines: 0,
    pendingPayments: 0,
    pendingCommissions: 0,
    currentBalance: 0,
    salesGrowth: 5.2,
    isGrowthPositive: true,
  });
  const [salesData, setSalesData] = useState<Array<{ name: string; gross: number; net: number }>>([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState<Array<{ name: string; value: number; color: string; percent: number }>>([]);
  const [activities, setActivities] = useState<Array<any>>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchSalesData(),
        fetchPaymentMethodsData(),
        fetchActivities()
      ]);
      
      toast({
        title: "Dados atualizados",
        description: "Os dados do painel foram atualizados com sucesso.",
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Erro ao atualizar dados",
        description: "Ocorreu um erro ao atualizar os dados do painel.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch summary statistics
  const fetchStats = async () => {
    // Mock data for now - this will be replaced with real Supabase queries
    // TODO: Replace with actual Supabase queries
    setStats({
      totalSales: 124500,
      netSales: 98750,
      totalClients: 243,
      totalMachines: 315,
      pendingPayments: 12,
      pendingCommissions: 8,
      currentBalance: 72340.50,
      salesGrowth: 5.2,
      isGrowthPositive: true,
    });
  };

  // Fetch sales data for the chart
  const fetchSalesData = async () => {
    // Generate mock data for the last 7 days
    // TODO: Replace with actual Supabase queries
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const gross = Math.floor(Math.random() * 10000) + 5000;
      data.push({
        name: format(date, 'dd/MM'),
        gross,
        net: Math.floor(gross * 0.8),
      });
    }
    setSalesData(data);
  };

  // Fetch payment methods distribution data
  const fetchPaymentMethodsData = async () => {
    // TODO: Replace with actual Supabase queries
    const total = 124500;
    const creditValue = 74700;
    const debitValue = 37350;
    const pixValue = 12450;
    
    setPaymentMethodsData([
      { 
        name: "Crédito", 
        value: creditValue, 
        color: "#3b82f6", 
        percent: creditValue / total 
      },
      { 
        name: "Débito", 
        value: debitValue, 
        color: "#22c55e", 
        percent: debitValue / total 
      },
      { 
        name: "PIX", 
        value: pixValue, 
        color: "#f59e0b", 
        percent: pixValue / total 
      }
    ]);
  };

  // Fetch recent activities
  const fetchActivities = async () => {
    // TODO: Replace with actual Supabase queries
    setActivities([
      {
        id: "1",
        type: "payment_approved",
        entityId: "p-001",
        entityName: "Empresa ABC Ltda",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        actor: "João Silva"
      },
      {
        id: "2",
        type: "client_added",
        entityId: "c-002",
        entityName: "Restaurante XYZ",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        actor: "Maria Santos"
      },
      {
        id: "3",
        type: "payment_requested",
        entityId: "p-003",
        entityName: "Loja Delta",
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
      },
      {
        id: "4",
        type: "machine_registered",
        entityId: "m-004",
        entityName: "Farmácia Beta",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        actor: "Carlos Oliveira"
      },
      {
        id: "5",
        type: "payment_rejected",
        entityId: "p-005",
        entityName: "Mercado Gama",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        actor: "Ana Costa"
      }
    ]);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Painel Administrativo" 
        description="Visão geral do sistema, métricas e atividades recentes"
        actionLabel={
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Período:</span>
            <span>Últimos 30 dias</span>
          </div>
        }
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          </div>
        }
      />
      
      <PageWrapper>
        <div className="space-y-6">
          {/* Stats Cards */}
          <StatCards stats={stats} isLoading={isLoading} />
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <SalesChart data={salesData} isLoading={isLoading} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <PaymentMethodsChart data={paymentMethodsData} isLoading={isLoading} />
            <RecentActivities activities={activities} isLoading={isLoading} />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
