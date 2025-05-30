
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { FeePlanManager } from "@/components/admin/FeePlanManager";

const AdminFeePlans = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Planos de Taxa"
        description="Gerencie os planos de taxa do sistema"
      />
      
      <FeePlanManager />
    </div>
  );
};

export default AdminFeePlans;
