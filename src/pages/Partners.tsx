
import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MainLayout from "@/components/layout/MainLayout";
import PartnersHeader from "@/components/partners/PartnersHeader";
import PartnersTableCard from "@/components/partners/PartnersTableCard";
import PartnerForm from "@/components/partners/PartnerForm";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import { usePartners, type Partner } from "@/hooks/use-partners";
import { toast } from "@/components/ui/use-toast";

// Update the Partners component to match component props
const Partners = () => {
  const {
    partners,
    filteredPartners,
    isLoading,
    error,
    createPartner,
    updatePartner,
    deletePartner,
    filterPartners,
  } = usePartners();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreateModal = useCallback(() => {
    setSelectedPartner(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setIsFormOpen(true);
  }, []);

  const handleFormOpenChange = useCallback((open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedPartner(null);
    }
  }, []);

  const handleSubmit = async (values: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      let success = false;
      if (selectedPartner) {
        success = await updatePartner(selectedPartner.id, values);
      } else {
        success = await createPartner(values);
      }

      if (success) {
        setIsFormOpen(false);
        setSelectedPartner(null);
        toast({
          title: "Sucesso!",
          description: `Parceiro ${selectedPartner ? 'atualizado' : 'criado'} com sucesso.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao salvar o parceiro.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (partner: Partner) => {
    try {
      const confirmed = window.confirm(`Tem certeza que deseja excluir o parceiro "${partner.company_name}"?`);
      if (confirmed) {
        const success = await deletePartner(partner.id);
        if (success) {
          toast({
            title: "Sucesso!",
            description: "Parceiro excluído com sucesso.",
          });
        } else {
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao excluir o parceiro.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o parceiro.",
        variant: "destructive",
      });
    }
  };

  const handleFilter = (searchTerm: string, commissionRange: [number, number]) => {
    filterPartners(searchTerm, commissionRange);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PartnersHeader onCreateClick={handleOpenCreateModal} />
        
        <PartnersFilterCard 
          onFilter={handleFilter} 
          loading={isLoading}
        />
        
        <PartnersTableCard
          partners={filteredPartners}
          isLoading={isLoading}
          error={error || ""}
          onEditPartner={handleOpenEditModal}
          onDeletePartner={handleDelete}
        />

        {/* Form dialog */}
        <Dialog open={isFormOpen} onOpenChange={handleFormOpenChange}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedPartner ? "Editar Parceiro" : "Novo Parceiro"}</DialogTitle>
              <DialogDescription>
                {selectedPartner 
                  ? "Edite as informações do parceiro abaixo."
                  : "Preencha as informações para cadastrar um novo parceiro."}
              </DialogDescription>
            </DialogHeader>
            
            <PartnerForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting}
              initialData={selectedPartner || undefined}
              title={selectedPartner ? "Editar Parceiro" : "Novo Parceiro"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Partners;
