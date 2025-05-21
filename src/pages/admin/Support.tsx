
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types/enums";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RequestsReportView from "@/components/logistics/reports/RequestsReportView";
import SupportRequestService from "@/services/support-request.service";

// Mock component for demonstration
const SupportTicketsList = () => {
  return (
    <div className="rounded-md border">
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Tickets de Suporte</h3>
        <p className="text-muted-foreground">
          Lista de tickets de suporte aparecerá aqui.
        </p>
      </div>
    </div>
  );
};

// Mock component for demonstration
const SupportAgentsList = () => {
  return (
    <div className="rounded-md border">
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Agentes de Suporte</h3>
        <p className="text-muted-foreground">
          Lista de agentes de suporte aparecerá aqui.
        </p>
      </div>
    </div>
  );
};

// Mock component for demonstration
const SupportChatInterface = () => {
  return (
    <div className="rounded-md border">
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Interface de Chat</h3>
        <p className="text-muted-foreground">
          Interface de chat para comunicação com clientes aparecerá aqui.
        </p>
      </div>
    </div>
  );
};

const AdminSupport = () => {
  const [activeTab, setActiveTab] = useState<string>("tickets");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();
  const [reportData, setReportData] = useState<{
    pendingRequests: number;
    highPriorityRequests: number;
    typeCounts: Record<string, number>;
  }>({
    pendingRequests: 12,
    highPriorityRequests: 5,
    typeCounts: {
      INSTALLATION: 4,
      MAINTENANCE: 6,
      REPLACEMENT: 2,
      OTHER: 3
    }
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await SupportRequestService.getStats();
        setReportData({
          pendingRequests: stats.pendingRequests,
          highPriorityRequests: stats.highPriorityRequests,
          typeCounts: stats.typeCounts || {}
        });
      } catch (error) {
        console.error("Error fetching support stats:", error);
      }
    };
    
    if (activeTab === "reports") {
      fetchStats();
    }
  }, [activeTab]);
  
  const handleSupportAgentCreate = async () => {
    try {
      // This is a mock function to demonstrate the UI
      // In a real app, this would create a support agent user
      const { data, error } = await supabase.auth.signUp({
        email: "support@example.com",
        password: "password123",
        options: {
          data: {
            role: UserRole.SUPPORT
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Agente de suporte criado",
        description: "O novo agente foi criado com sucesso.",
      });
    } catch (error) {
      console.error("Error creating support agent:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o agente de suporte.",
      });
    }
  };

  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <PageHeader 
            title="Suporte ao Cliente" 
            description="Gerencie tickets de suporte e atendimento ao cliente" 
          />
        </div>
        
        {activeTab === "agents" && (
          <Button onClick={handleSupportAgentCreate}>
            Adicionar Agente
          </Button>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs 
          defaultValue="tickets" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="agents">Agentes</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            
            {activeTab !== "reports" && (
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}
          </div>
          
          <TabsContent value="tickets">
            <Card>
              <CardContent className="p-6">
                <SupportTicketsList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardContent className="p-6">
                <SupportChatInterface />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agents">
            <Card>
              <CardContent className="p-6">
                <SupportAgentsList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <RequestsReportView 
              pendingRequests={reportData.pendingRequests}
              highPriorityRequests={reportData.highPriorityRequests}
              typeCounts={reportData.typeCounts}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSupport;
