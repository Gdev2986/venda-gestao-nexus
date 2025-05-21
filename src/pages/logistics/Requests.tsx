
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
import RequestsReportView from "@/components/logistics/reports/RequestsReportView";

const LogisticsRequests = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
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
    } as Record<string, number>
  });
  
  // We can fetch real data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await SupportRequestService.getStats();
        setReportData({
          pendingRequests: stats.pendingRequests,
          highPriorityRequests: stats.highPriorityRequests,
          typeCounts: stats.typeCounts || {}
        });
      } catch (error) {
        console.error("Error fetching support request stats:", error);
      }
    };
    
    fetchData();
  }, []);
  
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
            pendingRequests={reportData.pendingRequests}
            highPriorityRequests={reportData.highPriorityRequests}
            typeCounts={reportData.typeCounts}
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
