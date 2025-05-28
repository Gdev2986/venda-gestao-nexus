
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const FinancialReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios Financeiros"
        description="Relatórios e análises financeiras"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Relatórios financeiros em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default FinancialReports;
