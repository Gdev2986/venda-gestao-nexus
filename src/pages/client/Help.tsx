
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const ClientHelp = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ajuda"
        description="Central de ajuda e documentação"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Central de ajuda em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default ClientHelp;
