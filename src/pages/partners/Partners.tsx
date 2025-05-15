import React, { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";
import { PATHS } from "@/routes/paths";
import { usePartners } from "@/hooks/use-partners";

const Partners = () => {
  const { partners, loading, error, filterPartners } = usePartners();
  const [searchTerm, setSearchTerm] = useState("");

  // Use the filterPartners function correctly
  const filteredPartners = filterPartners({ name: searchTerm });

  return (
    <>
      <PageHeader
        title="Parceiros"
        description="Gerenciar parceiros"
        actionLabel="Novo Parceiro"
        actionLink={PATHS.PARTNERS.NEW}
      />

      <PartnersFilterCard
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
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
