
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Filter, Plus } from "lucide-react";
import { StatsCardsGroup } from "@/components/logistics/dashboard/StatsCardsGroup";
import { MachinesTable } from "@/components/logistics/dashboard/MachinesTable";
import { RequestsTable } from "@/components/logistics/dashboard/RequestsTable";
import { DashboardHeader } from "@/components/logistics/dashboard/DashboardHeader";
import { MachineStatusChart } from "@/components/logistics/dashboard/MachineStatusChart";
import { DashboardTabs } from "@/components/logistics/dashboard/DashboardTabs";
import { SLAChart } from "@/components/logistics/dashboard/SLAChart";
import { RequestsChart } from "@/components/logistics/dashboard/RequestsChart";
import { RecentActivitiesCard } from "@/components/logistics/dashboard/RecentActivitiesCard";
import { AppointmentsCard } from "@/components/logistics/dashboard/AppointmentsCard";
import { StorageOptimizationCard } from "@/components/logistics/dashboard/StorageOptimizationCard";
import { NewRequestDialog } from "@/components/logistics/modals/NewRequestDialog";
import { NewMachineDialog } from "@/components/logistics/modals/NewMachineDialog";

const LogisticsDashboard = () => {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showMachineDialog, setShowMachineDialog] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader />
      
      <div className="flex justify-end space-x-2 mb-4">
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Filtrar por Data
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowRequestDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
        <Button variant="default" size="sm" onClick={() => setShowMachineDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Máquina
        </Button>
      </div>

      <StatsCardsGroup />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <DashboardTabs />
          </CardContent>
        </Card>
        <RecentActivitiesCard />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <MachineStatusChart />
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <RequestsChart />
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <SLAChart />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <MachinesTable />
          </CardContent>
        </Card>
        <AppointmentsCard />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <RequestsTable />
          </CardContent>
        </Card>
        <StorageOptimizationCard />
      </div>
      
      {/* Dialogs */}
      <NewRequestDialog 
        open={showRequestDialog} 
        onOpenChange={setShowRequestDialog} 
      />
      
      <NewMachineDialog 
        open={showMachineDialog} 
        onOpenChange={setShowMachineDialog} 
      />
    </div>
  );
};

export default LogisticsDashboard;
