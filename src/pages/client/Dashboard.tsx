
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const ClientDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard do Cliente"
        description="Visão geral das suas máquinas e transações"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Dashboard do cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default ClientDashboard;
