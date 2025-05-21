
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import TaxBlocksManager from "@/components/fees/TaxBlocksManager";

const AdminFees = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Taxas e Comissões" 
        description="Configure os blocos de taxas para aplicação no sistema"
      />
      
      <TaxBlocksManager />
    </div>
  );
};

export default AdminFees;
