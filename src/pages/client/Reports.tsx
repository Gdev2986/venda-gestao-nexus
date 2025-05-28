
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const ClientReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios"
        description="Relatórios de vendas e performance"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Relatórios do cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default ClientReports;
