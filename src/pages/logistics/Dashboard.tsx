
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import StatsCardsGroup from "@/components/logistics/dashboard/StatsCardsGroup";
import MachinesTable from "@/components/logistics/dashboard/MachinesTable";
import RequestsTable from "@/components/logistics/dashboard/RequestsTable";
import DashboardHeader from "@/components/logistics/dashboard/DashboardHeader";
import MachineStatusChart from "@/components/logistics/dashboard/MachineStatusChart";
import { DashboardTabs } from "@/components/logistics/dashboard/DashboardTabs";
import SLAChart from "@/components/logistics/dashboard/SLAChart";
import RequestsChart from "@/components/logistics/dashboard/RequestsChart";
import RecentActivitiesCard from "@/components/logistics/dashboard/RecentActivitiesCard";
import AppointmentsCard from "@/components/logistics/dashboard/AppointmentsCard";
import StorageOptimizationCard from "@/components/logistics/dashboard/StorageOptimizationCard";
import NewRequestDialog from "@/components/logistics/modals/NewRequestDialog";
import NewMachineDialog from "@/components/logistics/modals/NewMachineDialog";

// Import the types from the components to ensure compatibility
import { Activity } from "@/components/logistics/dashboard/RecentActivitiesCard";
import { Appointment } from "@/components/logistics/dashboard/AppointmentsCard";

// Define the required types for dashboard
interface DashboardMachineStatusData {
  name: string;
  value: number;
  color: string;
}

interface DashboardRequestData {
  name: string;
  value: number;
  total: number;
}

const LogisticsDashboard = () => {
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showNewMachineDialog, setShowNewMachineDialog] = useState(false);

  const handleRefresh = () => {
    console.log("Refreshing dashboard data...");
  };

  const handleNewRequest = () => {
    setShowNewRequestDialog(true);
  };

  const handleNewMachine = () => {
    setShowNewMachineDialog(true);
  };

  // Create properly typed mock data
  const activities: Activity[] = [
    {
      id: 1, // Changed from string to number to match the Activity interface
      description: "Máquina XYZ-123 foi adicionada ao estoque",
      timestamp: new Date().toISOString()
    },
    {
      id: 2, // Changed from string to number to match the Activity interface
      description: "Requisição #4432 foi marcada como concluída",
      timestamp: new Date().toISOString()
    }
  ];

  const machineStatusData: DashboardMachineStatusData[] = [
    { name: "Operacional", value: 65, color: "#22c55e" },
    { name: "Manutenção", value: 15, color: "#f59e0b" },
    { name: "Inativo", value: 20, color: "#ef4444" }
  ];

  const requestsData: DashboardRequestData[] = [
    { name: "Concluídos", value: 24, total: 30 },
    { name: "Pendentes", value: 6, total: 30 }
  ];

  const slaData = [
    { name: "Dentro do SLA", value: 85, total: 100 },
    { name: "Fora do SLA", value: 15, total: 100 }
  ];

  const appointments: Appointment[] = [
    {
      id: 1, // Changed from string to number to match the Appointment interface
      client: "Empresa ABC",
      type: "Instalação",
      date: "2025-05-20",
      status: "Agendado"
    },
    {
      id: 2, // Changed from string to number to match the Appointment interface
      client: "Empresa XYZ",
      type: "Manutenção",
      date: "2025-05-21",
      status: "Pendente"
    }
  ];

  return (
    <div className="container py-10 mx-auto">
      <DashboardHeader 
        onRefresh={handleRefresh}
        onNewMachine={handleNewMachine}
        onNewRequest={handleNewRequest}
      />
      
      <div className="grid gap-6 mt-6">
        <StatsCardsGroup />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <DashboardTabs />
          </div>
          
          <div>
            <RecentActivitiesCard activities={activities} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div>
            <MachineStatusChart data={machineStatusData} />
          </div>
          <div>
            <RequestsChart data={requestsData} />
          </div>
          <div>
            <SLAChart data={slaData} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MachinesTable />
          </div>
          <div>
            <AppointmentsCard appointments={appointments} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <RequestsTable />
          </div>
          <div>
            <StorageOptimizationCard />
          </div>
        </div>
      </div>
      
      <NewRequestDialog 
        open={showNewRequestDialog} 
        onOpenChange={setShowNewRequestDialog} 
      />
      
      <NewMachineDialog 
        open={showNewMachineDialog} 
        onOpenChange={setShowNewMachineDialog} 
      />
    </div>
  );
};

export default LogisticsDashboard;
