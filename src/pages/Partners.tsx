
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { usePartners, FilterValues } from "@/hooks/use-partners";
import { Partner } from "@/types";
import PartnersHeader from "@/components/partners/PartnersHeader";
import PartnersFilterCard from "@/components/partners/PartnersFilterCard";
import PartnersTable from "@/components/partners/PartnersTable";
import PartnerForm from "@/components/partners/PartnerForm";

const Partners = () => {
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const { partners, isLoading, filters, handleFilterChange, addPartner, fetchPartners } = usePartners();

  // Handle form dialog open/close
  const handleOpenForm = () => {
    setSelectedPartner(null);
    setShowPartnerForm(true);
  };

  const handleCloseForm = () => {
    setShowPartnerForm(false);
    setSelectedPartner(null);
  };

  // Handle view partner details
  const handleViewPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowPartnerForm(true);
  };

  // Handle filter changes
  const handleFilter = (filterValues: FilterValues) => {
    handleFilterChange(filterValues);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPartners();
  };

  // Handle partner save (create or update)
  const handleSavePartner = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    const result = await addPartner(partnerData);
    if (result.success) {
      handleCloseForm();
    }
    return result.success;
  };

  return (
    <MainLayout>
      <PartnersHeader onCreateClick={handleOpenForm} />
      
      <PartnersFilterCard 
        onFilter={handleFilter}
        onAddPartner={handleOpenForm}
        onRefresh={handleRefresh}
      />
      
      <PartnersTable 
        partners={partners} 
        onViewPartner={handleViewPartner}
        isLoading={isLoading}
      />
      
      {showPartnerForm && (
        <PartnerForm
          isOpen={showPartnerForm}
          onClose={handleCloseForm}
          onSubmit={handleSavePartner}
          initialData={selectedPartner ? {
            id: selectedPartner.id,
            business_name: selectedPartner.company_name,
            commission_rate: selectedPartner.commission_rate,
            contact_name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zip: ""
          } : undefined}
        />
      )}
    </MainLayout>
  );
};

export default Partners;
