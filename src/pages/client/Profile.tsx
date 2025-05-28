
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const ClientProfile = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Perfil"
        description="Gerencie seus dados pessoais"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Perfil do cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default ClientProfile;
