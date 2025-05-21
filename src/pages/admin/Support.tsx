
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/enums";
import SupportRequestService from "@/services/support-request";
import SupportHeader from "@/components/admin/support/SupportHeader";
import SupportTabs from "@/components/admin/support/SupportTabs";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { StyledCard } from "@/components/ui/styled-card";
import { HelpCircle, AlertTriangle, CheckCircle, Users } from "lucide-react";

const AdminSupport = () => {
  const [activeTab, setActiveTab] = useState<string>("tickets");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();
  const [reportData, setReportData] = useState<{
    pendingRequests: number;
    highPriorityRequests: number;
    resolvedRequests: number;
    supportAgents: number;
    typeCounts: Record<string, number>;
  }>({
    pendingRequests: 12,
    highPriorityRequests: 5,
    resolvedRequests: 24,
    supportAgents: 3,
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
          resolvedRequests: stats.resolvedRequests || 24,
          supportAgents: stats.supportAgents || 3,
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

  // Prepare chart data
  const typesChartData = Object.entries(reportData.typeCounts).map(([type, value]) => ({
    name: type,
    value: value,
    color: '#' + Math.floor(Math.random()*16777215).toString(16) // Generate random colors
  }));

  return (
    <div className="space-y-6">
      <SupportHeader
        activeTab={activeTab}
        onCreateAgent={handleSupportAgentCreate}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StyledCard
          title="Solicitações Pendentes"
          icon={<HelpCircle className="h-4 w-4 text-orange-500" />}
          borderColor="border-orange-500"
        >
          <div className="text-2xl font-bold">{reportData.pendingRequests}</div>
          <p className="text-sm text-muted-foreground">Aguardando atendimento</p>
        </StyledCard>
        
        <StyledCard
          title="Alta Prioridade"
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          borderColor="border-red-500"
        >
          <div className="text-2xl font-bold">{reportData.highPriorityRequests}</div>
          <p className="text-sm text-muted-foreground">Requerem atenção imediata</p>
        </StyledCard>
        
        <StyledCard
          title="Resolvidas"
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">{reportData.resolvedRequests}</div>
          <p className="text-sm text-muted-foreground">Solicitações atendidas</p>
        </StyledCard>
        
        <StyledCard
          title="Agentes de Suporte"
          icon={<Users className="h-4 w-4 text-blue-500" />}
          borderColor="border-blue-500"
        >
          <div className="text-2xl font-bold">{reportData.supportAgents}</div>
          <p className="text-sm text-muted-foreground">Equipe disponível</p>
        </StyledCard>
      </div>
      
      <SupportTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        reportData={reportData}
      />

      {activeTab === "reports" && (
        <StyledCard title="Distribuição de Solicitações" borderColor="border-gray-200">
          <div className="w-full h-80">
            <DoughnutChart
              data={typesChartData}
              dataKey="value"
            />
          </div>
        </StyledCard>
      )}
    </div>
  );
};

export default AdminSupport;
