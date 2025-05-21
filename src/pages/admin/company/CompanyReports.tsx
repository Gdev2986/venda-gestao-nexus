
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PATHS } from "@/routes/paths";
import CompanyReportsComponent from "@/components/admin/company/CompanyReports";

const CompanyReportsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios da Empresa"
        description="Análise detalhada dos dados financeiros e desempenho da empresa"
        backButton={{
          label: "Voltar para Empresa",
          onClick: () => navigate(PATHS.ADMIN.COMPANY)
        }}
      />
      
      <CompanyReportsComponent />
    </div>
  );
};

export default CompanyReportsPage;
