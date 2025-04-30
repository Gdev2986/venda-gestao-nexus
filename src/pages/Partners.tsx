
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import MainLayout from "@/components/layout/MainLayout";
import usePartners, { Partner, FilterValues } from "@/hooks/use-partners";
import { useToast } from "@/hooks/use-toast";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";
import { PartnersHeader } from "@/components/partners/PartnersHeader";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import PartnerForm from "@/components/partners/PartnerForm";

const Partners = () => {
  const { toast } = useToast();
  const {
    loading,
    error,
    filteredPartners,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    applyFilter,
  } = usePartners();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);

  // Fetch partners on mount
  useState(() => {
    fetchPartners().catch(error => {
      toast({
        variant: "destructive",
        title: "Erro ao carregar parceiros",
        description: error.message || "Não foi possível carregar a lista de parceiros",
      });
    });
  });

  // Handle create partner
  const handleCreatePartner = async (partner: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    try {
      await createPartner(partner);
      setIsCreateDialogOpen(false);
      toast({
        title: "Parceiro criado",
        description: "O parceiro foi criado com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar parceiro",
        description: error.message || "Não foi possível criar o parceiro",
      });
    }
  };

  // Handle update partner
  const handleUpdatePartner = async (partner: Partner) => {
    try {
      const { id, ...partnerData } = partner;
      await updatePartner(id, partnerData);
      setIsUpdateDialogOpen(false);
      setCurrentPartner(null);
      toast({
        title: "Parceiro atualizado",
        description: "O parceiro foi atualizado com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar parceiro",
        description: error.message || "Não foi possível atualizar o parceiro",
      });
    }
  };

  // Handle filter partners
  const handleFilterPartners = (filters: FilterValues) => {
    applyFilter(filters);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PartnersHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <PartnersFilterCard onFilter={handleFilterPartners} />
          </div>

          <div className="lg:col-span-3">
            <PartnersTableCard
              partners={filteredPartners}
              loading={loading}
              error={error}
              onEdit={(partner) => {
                setCurrentPartner(partner);
                setIsUpdateDialogOpen(true);
              }}
              onDelete={deletePartner}
            />
          </div>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <PartnerForm 
            isCreate={true}
            onSubmit={handleCreatePartner}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </Dialog>

        {/* Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          {currentPartner && (
            <PartnerForm
              isCreate={false}
              initialData={currentPartner}
              onSubmit={handleUpdatePartner}
              onCancel={() => {
                setIsUpdateDialogOpen(false);
                setCurrentPartner(null);
              }}
            />
          )}
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Partners;
