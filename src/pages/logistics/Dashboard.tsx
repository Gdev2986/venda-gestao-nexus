
import { useState } from "react";
import { useMachineStats } from "@/hooks/use-machine-stats";
import { useToast } from "@/hooks/use-toast";
import { PageWrapper } from "@/components/page/PageWrapper";

// Import dashboard components
import DashboardHeader from "@/components/logistics/dashboard/DashboardHeader";
import StatsCardsGroup from "@/components/logistics/dashboard/StatsCardsGroup";
import DashboardTabs from "@/components/logistics/dashboard/DashboardTabs";
import AppointmentsCard from "@/components/logistics/dashboard/AppointmentsCard";
import RecentActivitiesCard from "@/components/logistics/dashboard/RecentActivitiesCard";

// Import modal dialogs
import NewMachineDialog from "@/components/logistics/modals/NewMachineDialog";
import NewRequestDialog from "@/components/logistics/modals/NewRequestDialog";

// Import dashboard data
import { 
  machineStatusData, 
  requestsMonthlyData, 
  slaData,
  upcomingAppointments,
  recentActivities 
} from "@/data/logistics/dashboardData";

const LogisticsDashboard = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isNewMachineDialogOpen, setIsNewMachineDialogOpen] = useState(false);
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const { stats, isLoading, refreshStats } = useMachineStats(dateRange);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    refreshStats();
    toast({
      title: "Dados atualizados",
      description: "Os dados da dashboard foram atualizados com sucesso."
    });
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header with action buttons */}
        <DashboardHeader 
          onRefresh={handleRefresh}
          onNewMachine={() => setIsNewMachineDialogOpen(true)}
          onNewRequest={() => setIsNewRequestDialogOpen(true)}
        />
        
        {/* Stats Cards */}
        <StatsCardsGroup />
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main dashboard area - 2/3 width */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <DashboardTabs 
              machineStatusData={machineStatusData}
              requestsMonthlyData={requestsMonthlyData}
              slaData={slaData}
            />
          </div>
          
          {/* Sidebar content - 1/3 width */}
          <div className="space-y-6 order-1 lg:order-2">
            <AppointmentsCard appointments={upcomingAppointments} />
            <RecentActivitiesCard activities={recentActivities} />
          </div>
        </div>
        
        {/* Modals */}
        <NewMachineDialog 
          open={isNewMachineDialogOpen} 
          onOpenChange={setIsNewMachineDialogOpen} 
        />
        
        <NewRequestDialog 
          open={isNewRequestDialogOpen} 
          onOpenChange={setIsNewRequestDialogOpen} 
        />
      </div>
    </PageWrapper>
  );
};

export default LogisticsDashboard;
