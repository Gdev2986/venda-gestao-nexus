
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const PartnerSupport = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suporte"
        description="Central de suporte para parceiros"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Suporte ao parceiro em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default PartnerSupport;
