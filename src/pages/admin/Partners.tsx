import React, { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";
import { usePartners } from "@/hooks/use-partners";
import { PATHS } from "@/routes/paths";

const Partners = () => {
  const { partners, loading, error, filterPartners, createPartner, updatePartner, deletePartner } = usePartners();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPartners = filterPartners({ name: searchTerm });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const handleOpenDialog = (partner) => {
    setSelectedPartner(partner);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedPartner(null);
    setIsDialogOpen(false);
  };

  const handleSubmitPartner = async (partnerData: any) => {
    try {
      // Ensure we have the required fields for a Partner
      const validPartnerData = {
        id: partnerData.id,
        company_name: partnerData.company_name || "New Partner",
        commission_rate: partnerData.commission_rate || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (partnerData.id) {
        await updatePartner(partnerData.id, validPartnerData);
      } else {
        await createPartner(validPartnerData);
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to save partner:", err);
    }
  };

  const handleDeletePartner = async (partnerId: string) => {
    try {
      await deletePartner(partnerId);
    } catch (err) {
      console.error("Failed to delete partner:", err);
    }
  };

  return (
    <>
      <PageHeader
        title="Parceiros"
        description="Gerenciar parceiros"
        actionLabel="Novo Parceiro"
        actionLink={PATHS.PARTNERS.NEW}
      />

      <PartnersFilterCard onSearch={setSearchTerm} />

      <PageWrapper>
        <PartnersTableCard
          partners={filteredPartners}
          loading={loading}
          error={error}
          onEdit={handleOpenDialog}
          onDelete={handleDeletePartner}
        />
      </PageWrapper>
    </>
  );
};

export default Partners;
