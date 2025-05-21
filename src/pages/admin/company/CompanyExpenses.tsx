
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PATHS } from "@/routes/paths";
import CompanyExpensesComponent from "@/components/admin/company/CompanyExpenses";

const CompanyExpensesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Despesas da Empresa"
        description="Gerenciamento de todas as despesas fixas e variáveis da empresa"
        backButton={{
          label: "Voltar para Empresa",
          onClick: () => navigate(PATHS.ADMIN.COMPANY)
        }}
      />
      
      <CompanyExpensesComponent />
    </div>
  );
};

export default CompanyExpensesPage;
