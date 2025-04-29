
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PartnerForm from "@/components/partners/PartnerForm";
import { PartnersHeader } from "@/components/partners/PartnersHeader";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";
import { usePartners, type Partner } from "@/hooks/use-partners";

const Partners = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
  const {
    partners,
    isLoading,
    handleFilter,
    deletePartner,
    savePartner,
    refreshPartners
  } = usePartners();

  const handleCreateClick = () => {
    setSelectedPartner(null);
    setShowCreateForm(true);
  };

  const handleEditClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowCreateForm(true);
  };

  const handleDeleteClick = async (partner: Partner) => {
    if (!window.confirm(`Tem certeza que deseja excluir o parceiro ${partner.business_name}?`)) {
      return;
    }
    await deletePartner(partner.id);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setSelectedPartner(null);
    refreshPartners();
  };

  const handleFormSubmit = async (data: any) => {
    const success = await savePartner(data, selectedPartner?.id);
    if (success) {
      handleFormClose();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <PartnersHeader onCreateClick={handleCreateClick} />
        
        <PartnersFilterCard onFilter={handleFilter} />
        
        <PartnersTableCard
          partners={partners}
          isLoading={isLoading}
          onEditPartner={handleEditClick}
          onDeletePartner={handleDeleteClick}
        />

        {showCreateForm && (
          <PartnerForm 
            isOpen={showCreateForm}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
            initialData={selectedPartner || {
              business_name: "",
              contact_name: "",
              email: "",
              phone: "",
              commission_rate: 0,
              address: "",
              city: "",
              state: "",
              zip: ""
            }}
            title={selectedPartner ? "Editar Parceiro" : "Novo Parceiro"}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Partners;
