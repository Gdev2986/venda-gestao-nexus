
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const FinancialClients = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes"
        description="Visão financeira dos clientes"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Gestão financeira de clientes em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default FinancialClients;
