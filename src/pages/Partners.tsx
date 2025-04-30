
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { PartnersHeader } from "@/components/partners/PartnersHeader";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import PartnerForm from "@/components/partners/PartnerForm";
import type { Partner } from "@/types";
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

  // Fix the type here to match what the Partner type actually requires
  const handleSubmit = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    try {
      setIsSubmitting(true);
      
      // Ensure commission_rate is a number with a default of 0
      const dataWithCommission = {
        ...partnerData,
        commission_rate: partnerData.commission_rate ?? 0,
      };
      
      if (editingPartner) {
        await updatePartner(editingPartner.id, dataWithCommission);
        toast({
          title: "Sucesso",
          description: "Parceiro atualizado com sucesso."
        });
      } else {
        await createPartner(dataWithCommission);
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

  const handleFilter = (values: { searchTerm: string, commissionRange: [number, number] }) => {
    filterPartners(values.searchTerm, values.commissionRange);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <PartnersHeader onCreateClick={handleCreatePartner} />
        
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
              initialData={editingPartner || undefined}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title={editingPartner ? "Editar Parceiro" : "Novo Parceiro"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
