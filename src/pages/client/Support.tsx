
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const ClientSupport = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suporte"
        description="Central de ajuda e atendimento"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Suporte ao cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default ClientSupport;
