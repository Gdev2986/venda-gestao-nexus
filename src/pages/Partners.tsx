
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { usePartners, Partner, FilterValues } from "@/hooks/use-partners";
import { useToast } from "@/hooks/use-toast";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard"; 
import { PartnersHeader } from "@/components/partners/PartnersHeader";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard"; 
import PartnerForm from "@/components/partners/PartnerForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Partners = () => {
  const {
    partners,
    loading,
    error,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    filterPartners,
  } = usePartners();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  useEffect(() => {
    setFilteredPartners(partners);
  }, [partners]);

  const handleCreate = () => {
    setEditingPartner(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsDialogOpen(true);
  };

  const handleDelete = async (partnerId: string) => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este parceiro?");
    if (confirmed) {
      return await deletePartner(partnerId);
    }
    return false;
  };

  const handleDeletePartner = (partner: Partner) => {
    handleDelete(partner.id);
  };

  const handleSubmit = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    let success = false;
    if (editingPartner) {
      success = await updatePartner(editingPartner.id, partnerData);
    } else {
      success = await createPartner(partnerData);
    }

    if (success) {
      setIsDialogOpen(false);
    }
    return success;
  };

  const applyFilter = (filters: FilterValues) => {
    setFilteredPartners(filterPartners(filters));
  };

  // Create an initialData object for the PartnerForm
  const getInitialData = () => {
    if (!editingPartner) return undefined;
    
    return {
      id: editingPartner.id,
      business_name: editingPartner.business_name,
      contact_name: editingPartner.contact_name,
      email: editingPartner.email,
      phone: editingPartner.phone,
      commission_rate: editingPartner.commission_rate,
      address: editingPartner.address,
      city: editingPartner.city,
      state: editingPartner.state,
      zip: editingPartner.zip,
    };
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <PartnersHeader onCreateClick={handleCreate} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <PartnersFilterCard onFilter={applyFilter} />
          </div>
          
          <div className="md:col-span-3">
            <PartnersTableCard 
              partners={filteredPartners} 
              isLoading={loading} 
              error={error} 
              onEditPartner={handleEdit} 
              onDeletePartner={handleDeletePartner}
            />
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <PartnerForm 
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleSubmit}
              initialData={getInitialData()}
              title={editingPartner ? "Editar Parceiro" : "Novo Parceiro"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Partners;
