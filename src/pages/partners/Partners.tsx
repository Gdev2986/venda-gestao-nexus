
import { useState } from "react";
import { usePartners } from "@/hooks/use-partners";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card } from "@/components/ui/card";
import PartnersTable from "@/components/partners/PartnersTable";
import PartnersFilterCard from "@/components/partners/PartnersFilterCard";

const Partners = () => {
  const {
    partners,
    isLoading,
    filterPartners,
  } = usePartners();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    filterPartners(search);
  };
  
  return (
    <div>
      <PageHeader
        title="Parceiros"
        description="Gerencie todos os parceiros do sistema"
        actionLabel="Novo Parceiro"
        actionOnClick={() => {}}
      />
      
      <PageWrapper>
        <div className="space-y-6">
          <PartnersFilterCard
            onFilter={(values) => filterPartners(values.search || "")}
            isLoading={isLoading}
          />
          
          <Card>
            <PartnersTable 
              partners={partners}
              isLoading={isLoading}
            />
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
};

export default Partners;
