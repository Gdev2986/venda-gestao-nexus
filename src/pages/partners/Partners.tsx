
import React, { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";
import { PATHS } from "@/routes/paths";
import { usePartners } from "@/hooks/use-partners";
import { FilterValues } from "@/types";

const Partners = () => {
  const { partners, loading, error, filterPartners } = usePartners();
  const [searchTerm, setSearchTerm] = useState("");

  // Use the filterPartners function correctly
  const filteredPartners = filterPartners({ name: searchTerm });

  const handleFilter = (values: FilterValues) => {
    setSearchTerm(values.search || "");
  };

  // Check PATHS.PARTNER.NEW exists and fallback to dashboard if not
  const newPartnerLink = PATHS.PARTNER?.NEW || PATHS.DASHBOARD;

  return (
    <>
      <PageHeader
        title="Parceiros"
        description="Gerenciar parceiros"
        actionLabel="Novo Parceiro"
        actionLink={newPartnerLink}
      />

      <PartnersFilterCard
        onFilter={handleFilter}
        isLoading={loading}
      />

      <PageWrapper>
        <PartnersTableCard
          partners={filteredPartners}
          loading={loading}
          error={error}
        />
      </PageWrapper>
    </>
  );
};

export default Partners;
