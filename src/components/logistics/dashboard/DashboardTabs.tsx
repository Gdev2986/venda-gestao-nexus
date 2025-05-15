
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MachineStatusChart from "./MachineStatusChart";
import RequestsChart from "./RequestsChart";
import SLAChart from "./SLAChart";
import MachinesTable from "./MachinesTable";
import RequestsTable from "./RequestsTable";
import StorageOptimizationCard from "./StorageOptimizationCard";

interface DashboardTabsProps {
  machineStatusData: Array<{ name: string; value: number }>;
  requestsMonthlyData: Array<{ name: string; value: number; total: number }>;
  slaData: Array<{ name: string; value: number }>;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ machineStatusData, requestsMonthlyData, slaData }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
        <TabsTrigger value="overview" className="text-xs sm:text-sm">Visão Geral</TabsTrigger>
        <TabsTrigger value="machines" className="text-xs sm:text-sm">Máquinas</TabsTrigger>
        <TabsTrigger value="requests" className="text-xs sm:text-sm">Solicitações</TabsTrigger>
        <TabsTrigger value="inventory" className="text-xs sm:text-sm">Estoque</TabsTrigger>
      </TabsList>
      
      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4 sm:space-y-6">
        {/* Status charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MachineStatusChart data={machineStatusData} />
          <RequestsChart data={requestsMonthlyData} />
        </div>
        
        {/* SLA */}
        <SLAChart data={slaData} />
      </TabsContent>
      
      {/* Machines Tab */}
      <TabsContent value="machines">
        <MachinesTable />
      </TabsContent>
      
      {/* Requests Tab */}
      <TabsContent value="requests">
        <RequestsTable />
      </TabsContent>
      
      {/* Inventory Tab */}
      <TabsContent value="inventory" className="space-y-4 sm:space-y-6">
        <StorageOptimizationCard />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
