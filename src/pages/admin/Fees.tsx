
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import TaxBlocksManager from "@/components/fees/TaxBlocksManager";
import TransactionFeesTab from "@/components/fees/TransactionFeesTab";
import PartnerCommissionsTab from "@/components/fees/PartnerCommissionsTab";
import ServiceFeesTab from "@/components/fees/ServiceFeesTab";

const AdminFees = () => {
  const [activeTab, setActiveTab] = useState("tax-blocks");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Taxas e Comissões" 
        description="Configure as taxas do sistema e comissões para parceiros"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tax-blocks">Blocos de Taxas</TabsTrigger>
          <TabsTrigger value="transaction-fees">Taxas de Transação</TabsTrigger>
          <TabsTrigger value="partner-commissions">Comissões de Parceiros</TabsTrigger>
          <TabsTrigger value="service-fees">Taxas de Serviço</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tax-blocks">
          <TaxBlocksManager />
        </TabsContent>
        
        <TabsContent value="transaction-fees">
          <TransactionFeesTab />
        </TabsContent>
        
        <TabsContent value="partner-commissions">
          <PartnerCommissionsTab />
        </TabsContent>
        
        <TabsContent value="service-fees">
          <ServiceFeesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFees;
