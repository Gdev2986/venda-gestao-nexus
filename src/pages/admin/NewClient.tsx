
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";

const AdminNewClient = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Novo Cliente"
        description="Cadastre um novo cliente"
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Formulário de novo cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default AdminNewClient;
