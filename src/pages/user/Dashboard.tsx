
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import SidebarContent from "@/components/dashboard/client/SidebarContent";
import StatsCards from "@/components/dashboard/client/StatsCards";
import MainOverviewTabs from "@/components/dashboard/client/MainOverviewTabs";

// Mock data for the user dashboard
const mockData = {
  stats: {
    totalSales: 2500, // Renamed from balance
    pendingPayments: 12, // Renamed from transactions  
    completedPayments: 10, // New field
    clientBalance: 2000, // New field to match expected type
  },
  salesData: [
    { name: '2023-04-01', total: 580 }, // Changed from date/value to name/total
    { name: '2023-04-02', total: 450 },
    { name: '2023-04-03', total: 620 },
    { name: '2023-04-04', total: 700 },
  ],
  paymentMethodsData: [
    { name: 'credit', value: 8 }, // Changed from method/count/percentage to name/value
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
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meu Painel" 
        description="Acompanhe seus pagamentos e máquinas"
      />
      
      <StatsCards stats={mockData.stats} loading={false} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MainOverviewTabs 
            salesData={mockData.salesData}
            paymentMethodsData={mockData.paymentMethodsData}
            filteredTransactions={mockData.filteredTransactions}
            machines={mockData.machines}
            loading={false}
            period="week"
            onChangePeriod={() => {}}
            onViewAllTransactions={() => {}}
            onViewAllMachines={() => {}}
            transactionsPage={1}
            totalTransactionsPages={1}
            onTransactionsPageChange={() => {}}
            machinesPage={1}
            totalMachinesPages={1}
            onMachinesPageChange={() => {}}
          />
        </div>
        
        <div className="space-y-6">
          <SidebarContent loading={false} />
        </div>
      </div>
      
      <PageWrapper>
        <CardHeader>
          <CardTitle className="text-xl">Minhas Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.machines.map((machine) => (
              <div key={machine.id} className="p-3 border rounded-md flex items-center justify-between hover:bg-accent/50 cursor-pointer transition-colors">
                <div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{machine.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <p>S/N: {machine.serial_number}</p>
                    <p>Modelo: {machine.model}</p>
                  </div>
                </div>
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">{machine.status}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button variant="outline" className="w-full" asChild>
              <Link to={PATHS.USER.MACHINES}>
                Ver todas as máquinas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </PageWrapper>
    </div>
  );
};

export default UserDashboard;
