
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const FinancialPayments = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pagamentos"
        description="Gerencie pagamentos e solicitações"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Sistema de pagamentos financeiro em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default FinancialPayments;
