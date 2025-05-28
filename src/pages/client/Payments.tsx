
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const ClientPayments = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pagamentos"
        description="Histórico de pagamentos e solicitações"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Pagamentos do cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default ClientPayments;
