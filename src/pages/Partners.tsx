
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { PartnersHeader } from "@/components/partners/PartnersHeader";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import PartnerForm from "@/components/partners/PartnerForm";
import { Partner, FilterValues } from "@/types";
import { usePartners } from "@/hooks/use-partners";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Partners() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const { toast } = useToast();
  
  const { 
    partners, 
    loading, 
    error, 
    filterPartners, 
    createPartner, 
    updatePartner, 
    deletePartner,
    refreshPartners
  } = usePartners();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleCreatePartner = () => {
    setEditingPartner(null);
    setIsDialogOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setIsDialogOpen(true);
  };

  const handleDeletePartner = async (partnerId: string) => {
    try {
      await deletePartner(partnerId);
      toast({
        title: "Sucesso",
        description: "Parceiro excluído com sucesso.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Ocorreu um erro ao excluir o parceiro.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    try {
      setIsSubmitting(true);
      
      if (editingPartner) {
        await updatePartner(editingPartner.id, partnerData);
        toast({
          title: "Sucesso",
          description: "Parceiro atualizado com sucesso."
        });
      } else {
        await createPartner(partnerData);
        toast({
          title: "Sucesso",
          description: "Parceiro criado com sucesso."
        });
      }
      
      setIsDialogOpen(false);
      return true;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o parceiro.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilter = (values: FilterValues) => {
    filterPartners(values.searchTerm, values.commissionRange);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <PartnersHeader onCreatePartner={handleCreatePartner} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PartnersFilterCard onFilter={handleFilter} loading={loading} />
          
          <div className="md:col-span-2">
            <PartnersTableCard 
              partners={partners} 
              isLoading={loading} 
              error={error || ""} 
              onEdit={handleEditPartner} 
              onDelete={handleDeletePartner} 
            />
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? "Editar Parceiro" : "Novo Parceiro"}
              </DialogTitle>
            </DialogHeader>
            
            <PartnerForm 
              partner={editingPartner}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
