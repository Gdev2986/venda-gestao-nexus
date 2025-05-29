
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import SupportAgentsList from "./SupportAgentsList";
import { SupportChatInterface } from "./SupportChatInterface";
import SupportSearch from "./SupportSearch";
import RequestsReportView from "@/components/logistics/reports/RequestsReportView";
import React, { useState } from "react";

interface SupportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  reportData: {
    pendingRequests: number;
    highPriorityRequests: number;
    resolvedRequests?: number;
    supportAgents?: number;
    typeCounts: Record<string, number>;
  };
}

import SupportTicketsList from "./SupportTicketsList";

const SupportTabs = ({ 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm, 
  reportData 
}: SupportTabsProps) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const handleSelectTicket = (ticketId: string, clientId: string) => {
    setSelectedTicketId(ticketId);
  };
  
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
        <SupportTicketsList 
          onSelectTicket={handleSelectTicket}
          searchTerm={searchTerm}
        />
      </TabsContent>
      
      <TabsContent value="chat">
        <SupportChatInterface 
          ticketId={selectedTicketId || undefined}
        />
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
