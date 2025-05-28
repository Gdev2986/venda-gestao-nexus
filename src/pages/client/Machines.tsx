
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const ClientMachines = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Minhas Máquinas"
        description="Gerencie suas máquinas ativas"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Máquinas do cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default ClientMachines;
