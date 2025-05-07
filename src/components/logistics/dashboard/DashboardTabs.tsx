
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MachineStatusChart from "./MachineStatusChart";
import RequestsChart from "./RequestsChart";
import SLAChart from "./SLAChart";
import MachinesTable from "./MachinesTable";
import RequestsTable from "./RequestsTable";

interface DashboardTabsProps {
  machineStatusData: Array<{ name: string; value: number }>;
  requestsMonthlyData: Array<{ name: string; value: number; total: number }>;
  slaData: Array<{ name: string; value: number }>;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ machineStatusData, requestsMonthlyData, slaData }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="machines">Máquinas</TabsTrigger>
        <TabsTrigger value="requests">Solicitações</TabsTrigger>
      </TabsList>
      
      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        {/* Status charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </Tabs>
  );
};

export default DashboardTabs;
