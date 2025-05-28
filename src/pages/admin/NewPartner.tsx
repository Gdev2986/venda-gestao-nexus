
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const AdminNewPartner = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Novo Parceiro"
        description="Cadastre um novo parceiro"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Formulário de novo parceiro em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default AdminNewPartner;
