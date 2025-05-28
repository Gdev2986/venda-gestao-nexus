
import React from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";

const AdminClientDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Detalhes do Cliente"
        description={`Informações do cliente ${id}`}
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Detalhes do cliente em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default AdminClientDetails;
