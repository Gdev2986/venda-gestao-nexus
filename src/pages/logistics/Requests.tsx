import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ServiceList from "@/components/logistics/ServiceList";
import NewRequestDialog from "@/components/logistics/modals/NewRequestDialog";
import RequestsCalendarView from "@/components/logistics/RequestsCalendarView";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/routes/paths";
import SupportRequestService from "@/services/support-request.service";

// Update the RequestsReportView component to provide the required props
const RequestsReportView = () => {
  // Get real data from the support service
  const [reportData, setReportData] = useState({
    pendingRequests: 8,
    highPriorityRequests: 3,
    typeCounts: {
      INSTALLATION: 3,
      MAINTENANCE: 4,
      REPLACEMENT: 2,
      SUPPLIES: 1,
      REMOVAL: 1,
      OTHER: 2
    }
  });

  // We can fetch real data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await SupportRequestService.getStats();
        setReportData(stats);
      } catch (error) {
        console.error("Error fetching support request stats:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{reportData.pendingRequests}</div>
            <p className="text-sm text-muted-foreground">Solicitações Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{reportData.highPriorityRequests}</div>
            <p className="text-sm text-muted-foreground">Alta Prioridade</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{Object.values(reportData.typeCounts).reduce((a, b) => a + b, 0)}</div>
            <p className="text-sm text-muted-foreground">Total de Solicitações</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Tipos de Solicitações</h3>
          <div className="space-y-2">
            {Object.entries(reportData.typeCounts).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span>{type}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LogisticsRequests = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handleRefresh = () => {
    // Add refresh logic here (will be implemented with Supabase realtime)
    console.log("Refreshing requests data");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={PATHS.LOGISTICS.DASHBOARD}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Solicitações</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <PageHeader title="Solicitações Técnicas" description="Gerencie as solicitações de atendimento técnico" />
          
          <Button 
            onClick={() => setIsNewRequestOpen(true)}
            className={isMobile ? "w-full" : ""}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="pt-4">
          <ServiceList />
        </TabsContent>
        
        <TabsContent value="calendar" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <RequestsCalendarView />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="pt-4">
          <RequestsReportView 
          pendingRequests={8}
          highPriorityRequests={3}
          typeCounts={{
            INSTALLATION: 3,
            MAINTENANCE: 4,
            REPLACEMENT: 2,
            SUPPLIES: 1,
            REMOVAL: 1,
            OTHER: 2
          }}
        />
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating new requests */}
      <NewRequestDialog
        open={isNewRequestOpen}
        onOpenChange={setIsNewRequestOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default LogisticsRequests;
