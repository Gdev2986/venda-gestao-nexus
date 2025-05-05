
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import StatCards from "@/components/dashboard/admin/StatCards";
import SalesChart from "@/components/dashboard/admin/SalesChart";
import PaymentMethodsChart from "@/components/dashboard/admin/PaymentMethodsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

// Dashboard mock data
const MOCK_DATA = {
  stats: {
    totalSales: 125750.50,
    netSales: 98230.75,
    totalClients: 48,
    totalMachines: 76,
    pendingPayments: 12,
    pendingCommissions: 8,
    currentBalance: 52480.90,
    salesGrowth: 12.5,
    isGrowthPositive: true
  },
  dailySales: [
    { name: "Segunda", gross: 12500, net: 9375 },
    { name: "Terça", gross: 9800, net: 7350 },
    { name: "Quarta", gross: 15200, net: 11400 },
    { name: "Quinta", gross: 18500, net: 13875 },
    { name: "Sexta", gross: 22300, net: 16725 },
    { name: "Sábado", gross: 19800, net: 14850 },
    { name: "Domingo", gross: 14500, net: 10875 }
  ],
  paymentMethods: [
    { name: "Crédito", value: 68500, color: "#3b82f6", percent: 0.55 },
    { name: "Débito", value: 37500, color: "#22c55e", percent: 0.30 },
    { name: "Pix", value: 19750, color: "#f59e0b", percent: 0.15 }
  ],
  recentActivities: [
    { 
      id: "1", 
      title: "Nova solicitação de pagamento", 
      description: "Cliente ABC solicitou um pagamento de R$ 1.250,00",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "2",
      title: "Novo cliente cadastrado",
      description: "Parceiro XYZ cadastrou um novo cliente: Empresa DEF Ltda",
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: "3",
      title: "Venda processada",
      description: "Terminal #12345 registrou uma venda de R$ 789,50",
      timestamp: new Date(Date.now() - 10800000).toISOString()
    },
    {
      id: "4",
      title: "Pagamento aprovado",
      description: "Administrador aprovou pagamento de R$ 3.500,00 para cliente GHI",
      timestamp: new Date(Date.now() - 14400000).toISOString()
    }
  ]
};

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to simulate data refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel Administrativo"
        description="Visão geral da operação e principais métricas"
      >
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar dados
        </Button>
      </PageHeader>

      <PageWrapper>
        <div className="space-y-6">
          {/* Stats Cards */}
          <StatCards stats={MOCK_DATA.stats} isLoading={isLoading} />
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <SalesChart data={MOCK_DATA.dailySales} isLoading={isLoading} />
            <PaymentMethodsChart data={MOCK_DATA.paymentMethods} isLoading={isLoading} />
          </div>
          
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {MOCK_DATA.recentActivities.map(activity => (
                    <div key={activity.id} className="border-b pb-3 last:border-0">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
