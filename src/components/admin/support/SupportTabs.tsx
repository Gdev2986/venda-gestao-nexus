
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import SupportTicketsList from "./SupportTicketsList";
import SupportAgentsList from "./SupportAgentsList";
import SupportChatInterface from "./SupportChatInterface";
import SupportSearch from "./SupportSearch";
import RequestsReportView from "@/components/logistics/reports/RequestsReportView";
import React from "react";

interface SupportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  reportData: {
    pendingRequests: number;
    highPriorityRequests: number;
    resolvedRequests?: number; // Make optional
    supportAgents?: number; // Make optional
    typeCounts: Record<string, number>;
  };
}

const SupportTabs = ({ 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm, 
  reportData 
}: SupportTabsProps) => {
  return (
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
          <SupportSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
          resolvedRequests={reportData.resolvedRequests}
          supportAgents={reportData.supportAgents}
          typeCounts={reportData.typeCounts}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SupportTabs;
