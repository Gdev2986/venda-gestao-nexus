
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/enums";
import SupportRequestService from "@/services/support-request.service";
import SupportHeader from "@/components/admin/support/SupportHeader";
import SupportTabs from "@/components/admin/support/SupportTabs";

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
      <SupportHeader
        activeTab={activeTab}
        onCreateAgent={handleSupportAgentCreate}
      />
      
      <div className="flex justify-between items-center">
        <SupportTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          reportData={reportData}
        />
      </div>
    </div>
  );
};

export default AdminSupport;
