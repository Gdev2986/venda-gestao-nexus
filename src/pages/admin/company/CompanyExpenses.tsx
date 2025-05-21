
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PATHS } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import CompanyExpensesComponent from "@/components/admin/company/CompanyExpenses";

const CompanyExpensesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Despesas da Empresa"
        description="Gerenciamento de todas as despesas fixas e variáveis da empresa"
      />
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(PATHS.ADMIN.COMPANY)}
        >
          Voltar para Empresa
        </Button>
      </div>
      
      <CompanyExpensesComponent />
    </div>
  );
};

export default CompanyExpensesPage;
