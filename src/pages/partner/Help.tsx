
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const PartnerHelp = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ajuda"
        description="Central de ajuda para parceiros"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Central de ajuda do parceiro em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default PartnerHelp;
