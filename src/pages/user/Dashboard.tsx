
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import SidebarContent from "@/components/dashboard/client/SidebarContent";
import StatsCards from "@/components/dashboard/client/StatsCards";
import MainOverviewTabs from "@/components/dashboard/client/MainOverviewTabs";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { useDevice } from "@/hooks/use-device";
import { AnimatePresence, motion } from "framer-motion";

// Mock data for the user dashboard
const mockData = {
  stats: {
    totalSales: 2500,
    pendingPayments: 12,
    completedPayments: 10,
    clientBalance: 2000,
  },
  salesData: [
    { name: '2023-04-01', total: 580 },
    { name: '2023-04-02', total: 450 },
    { name: '2023-04-03', total: 620 },
    { name: '2023-04-04', total: 700 },
    { name: '2023-04-05', total: 720 },
    { name: '2023-04-06', total: 500 },
    { name: '2023-04-07', total: 650 },
  ],
  paymentMethodsData: [
    { name: 'credit', value: 8 },
    { name: 'debit', value: 3 },
    { name: 'pix', value: 1 },
  ],
  filteredTransactions: [
    { id: 't1', date: '2023-04-04', value: 120, type: 'credit' },
    { id: 't2', date: '2023-04-03', value: 85, type: 'debit' },
    { id: 't3', date: '2023-04-02', value: 200, type: 'credit' },
  ],
  machines: [
    { 
      id: 'm1', 
      name: 'Terminal 1', 
      serial_number: 'SP2204785', 
      model: 'SigmaPay S920', 
      status: 'Ativo',
      created_at: '2023-01-01'
    },
    { 
      id: 'm2', 
      name: 'Terminal 2', 
      serial_number: 'SP2204786', 
      model: 'SigmaPay Mini', 
      status: 'Ativo',
      created_at: '2023-02-15'
    },
  ]
};

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(mockData);
  const [period, setPeriod] = useState("week");
  const { toast } = useToast();
  const { isTablet, isMobile } = useDevice();

  // Setup realtime updates for sales and machines
  useRealtimeUpdates({
    tableName: 'sales',
    onDataChange: (payload) => {
      // In a real implementation, we would fetch updated data
      console.log("Sales update detected:", payload);
      toast({
        title: "Nova venda detectada",
        description: "Os dados de vendas foram atualizados."
      });
      // Simulated data refresh
      refreshData();
    }
  });

  useRealtimeUpdates({
    tableName: 'machines',
    onDataChange: (payload) => {
      console.log("Machine update detected:", payload);
      toast({
        title: "Atualização de máquina",
        description: "Suas informações de máquinas foram atualizadas."
      });
      // Simulated data refresh
      refreshData();
    }
  });

  // Function to refresh dashboard data
  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, this would fetch fresh data from API
      setData({
        ...mockData,
        stats: {
          ...mockData.stats,
          totalSales: mockData.stats.totalSales + Math.round(Math.random() * 100)
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  // Initial data load
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader 
        title="Meu Painel" 
        description="Acompanhe seus pagamentos e máquinas"
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatsCards stats={data.stats} loading={isLoading} />
        </motion.div>
      </AnimatePresence>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <MainOverviewTabs 
            salesData={data.salesData}
            paymentMethodsData={data.paymentMethodsData}
            filteredTransactions={data.filteredTransactions}
            machines={data.machines}
            loading={isLoading}
            period={period}
            onChangePeriod={setPeriod}
            onViewAllTransactions={() => {}}
            onViewAllMachines={() => {}}
            transactionsPage={1}
            totalTransactionsPages={1}
            onTransactionsPageChange={() => {}}
            machinesPage={1}
            totalMachinesPages={1}
            onMachinesPageChange={() => {}}
          />
        </motion.div>
        
        {(!isMobile || !isTablet) && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <SidebarContent loading={isLoading} />
          </motion.div>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <PageWrapper>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Minhas Máquinas</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              {isLoading ? "Atualizando..." : "Atualizar"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.machines.map((machine) => (
                <motion.div
                  key={machine.id}
                  className="p-3 border rounded-md flex flex-col sm:flex-row sm:items-center justify-between hover:bg-accent/50 cursor-pointer transition-colors gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="min-w-0 overflow-hidden">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium truncate">{machine.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <p className="truncate">S/N: {machine.serial_number}</p>
                      <p className="truncate">Modelo: {machine.model}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">{machine.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link to={PATHS.USER.MACHINES}>
                  Ver todas as máquinas <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </PageWrapper>
      </motion.div>

      {/* Mobile-only sidebar content */}
      {(isMobile || isTablet) && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <SidebarContent loading={isLoading} />
        </motion.div>
      )}
    </div>
  );
};

export default UserDashboard;
