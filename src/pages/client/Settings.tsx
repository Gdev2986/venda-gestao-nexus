
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const ClientSettings = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações"
        description="Gerencie suas preferências e dados pessoais"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Configurações do cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default ClientSettings;
