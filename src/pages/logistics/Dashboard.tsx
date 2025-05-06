
import { useState } from "react";
import { useMachineStats } from "@/hooks/use-machine-stats";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PageHeader } from "@/components/page/PageHeader";
import StatsCards from "@/components/logistics/StatsCards";
import MachineList from "@/components/logistics/MachineList";
import ServiceList from "@/components/logistics/ServiceList";
import DateRangePicker from "@/components/logistics/DateRangePicker";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const LogisticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const { stats, isLoading, refreshStats } = useMachineStats(dateRange);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    refreshStats();
    toast({
      title: "Dados atualizados",
      description: "Os dados da página foram atualizados com sucesso."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Dashboard de Logística" 
          description="Gestão de máquinas, atendimentos e solicitações"
        />
        <div className="flex items-center gap-2">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <StatsCards stats={stats} isLoading={isLoading} />
      
      <PageWrapper>
        <Tabs defaultValue="machines" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="machines">Máquinas</TabsTrigger>
            <TabsTrigger value="services">Atendimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="machines" className="mt-0">
            <MachineList />
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <ServiceList />
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </div>
  );
};

export default LogisticsDashboard;
