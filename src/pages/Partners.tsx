
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Partner, usePartners, FilterValues } from "@/hooks/use-partners";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";
import { PartnersHeader } from "@/components/partners/PartnersHeader";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import PartnerForm from "@/components/partners/PartnerForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Partners = () => {
  const { partners, filteredPartners, isLoading, fetchPartners, handleFilter, deletePartner, savePartner } = usePartners();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleEditPartner = (partner: Partner) => {
    setCurrentPartner(partner);
    setIsFormOpen(true);
  };

  const handleDeletePartner = (partner: Partner) => {
    setCurrentPartner(partner);
    setIsDeleteDialogOpen(true);
  };

  const handleCreatePartner = () => {
    setCurrentPartner(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (partner: Partner) => {
    const result = await savePartner(partner);
    if (result) {
      setIsFormOpen(false);
      toast({
        title: "Sucesso",
        description: `Parceiro ${currentPartner ? "atualizado" : "criado"} com sucesso.`,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (currentPartner) {
      const success = await deletePartner(currentPartner.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Parceiro excluído com sucesso.",
        });
      }
    }
  };

  // Pass filters directly to the handleFilter function from usePartners
  const onFilterApplied = (filters: FilterValues) => {
    // Convert from FilterValues to Partial<Partner>
    const partnerFilters: Partial<Partner> = {};
    
    if (filters.search) {
      partnerFilters.business_name = filters.search;
    }
    
    // Apply date range filter if needed in future
    
    handleFilter(partnerFilters);
  };

  return (
    <MainLayout>
      <PartnersHeader onCreateClick={handleCreatePartner} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        <div className="lg:col-span-1">
          <PartnersFilterCard onFilter={onFilterApplied} />
        </div>
        
        <div className="lg:col-span-3">
          <PartnersTableCard 
            partners={filteredPartners}
            isLoading={isLoading} 
            onEditPartner={handleEditPartner} 
            onDeletePartner={handleDeletePartner}
          />
        </div>
      </div>

      {/* Partner Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentPartner ? "Editar Parceiro" : "Novo Parceiro"}
            </DialogTitle>
          </DialogHeader>
          <PartnerForm 
            partner={currentPartner} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o parceiro "{currentPartner?.business_name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Partners;
