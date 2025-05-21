
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page/PageHeader";
import { PATHS } from "@/routes/paths";
import CompanyReports from "@/components/admin/company/CompanyReports";
import CompanyExpenses from "@/components/admin/company/CompanyExpenses";

const Company = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (location.pathname.includes("/expenses")) {
      return "expenses";
    }
    return "reports";
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "reports") {
      navigate(PATHS.ADMIN.COMPANY_REPORTS);
    } else if (value === "expenses") {
      navigate(PATHS.ADMIN.COMPANY_EXPENSES);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empresa"
        description="Gestão financeira e análise de desempenho da empresa"
      />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="mt-6">
          <CompanyReports />
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-6">
          <CompanyExpenses />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Company;
