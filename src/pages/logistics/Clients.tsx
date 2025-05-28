
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const LogisticsClients = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes"
        description="Gerencie clientes e suas máquinas"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Gestão de clientes logísticos em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default LogisticsClients;
