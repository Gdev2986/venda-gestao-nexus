import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePartners } from "@/hooks/use-partners";
import PartnersTable from "@/components/partners/PartnersTable";
import { Search } from "lucide-react";
import PartnerForm from "@/components/partners/PartnerForm";
import { Partner } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { partners, loading: isLoading, error, filterPartners, refreshPartners, createPartner, updatePartner, deletePartner } = usePartners();

  useEffect(() => {
    refreshPartners();
  }, [refreshPartners]);

  // Handle filtering
  useEffect(() => {
    filterPartners(searchTerm);
  }, [searchTerm, filterPartners]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle viewing partner details
  const handleViewPartner = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  // Handle editing partner
  const handleEditPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsEditDialogOpen(true);
  };

  // Handle deleting partner
  const handleDeletePartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirming partner deletion
  const handleConfirmDelete = async () => {
    if (!selectedPartner) return;
    
    setIsSubmitting(true);
    try {
      const success = await deletePartner(selectedPartner.id);
      if (success) {
        toast({
          title: "Parceiro excluído",
          description: "O parceiro foi excluído com sucesso."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível excluir o parceiro."
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle creating new partner
  const handleCreatePartner = async (data: Omit<Partner, "id" | "created_at" | "updated_at" | "commission_rate">) => {
    setIsSubmitting(true);
    try {
      // Pass 0 as the default commission rate as requested
      const success = await createPartner({
        ...data,
        commission_rate: 0
      });
      
      if (success) {
        toast({
          title: "Parceiro criado",
          description: "O parceiro foi criado com sucesso."
        });
        setIsCreateDialogOpen(false);
        return true;
      } 
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o parceiro."
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle updating partner
  const handleUpdatePartner = async (data: Omit<Partner, "id" | "created_at" | "updated_at" | "commission_rate">) => {
    if (!selectedPartner) return false;
    
    setIsSubmitting(true);
    try {
      // Keep the existing commission rate
      const success = await updatePartner(selectedPartner.id, {
        ...data,
        commission_rate: selectedPartner.commission_rate
      });
      
      if (success) {
        toast({
          title: "Parceiro atualizado",
          description: "Os dados do parceiro foram atualizados com sucesso."
        });
        setIsEditDialogOpen(false);
        return true;
      }
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar os dados do parceiro."
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <PageHeader 
        title="Parceiros" 
        description="Gerencie os parceiros e consultores do sistema"
        actionLabel="Adicionar Parceiro"
        actionOnClick={() => setIsCreateDialogOpen(true)}
      />

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>

      <PageWrapper>
        <Card>
          <CardHeader>
            <CardTitle>Nossos Parceiros</CardTitle>
            <CardDescription>Conheça os parceiros que trabalham conosco</CardDescription>
          </CardHeader>
          <CardContent>
            <PartnersTable 
              partners={partners} 
              isLoading={isLoading}
              onView={handleViewPartner}
              onEdit={handleEditPartner}
              onDelete={handleDeletePartner}
            />
          </CardContent>
        </Card>
      </PageWrapper>

      {/* Create Partner Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Parceiro</DialogTitle>
          </DialogHeader>
          <PartnerForm
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            onSubmit={handleCreatePartner}
            isSubmitting={isSubmitting}
            hideCommissionRate={true}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={isEditDialogOpen && !!selectedPartner} onOpenChange={setIsEditDialogOpen}>
        {selectedPartner && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Parceiro</DialogTitle>
            </DialogHeader>
            <PartnerForm
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              onSubmit={handleUpdatePartner}
              initialData={{
                company_name: selectedPartner.company_name,
                business_name: selectedPartner.business_name,
                contact_name: selectedPartner.contact_name,
                email: selectedPartner.email,
                phone: selectedPartner.phone,
              }}
              isSubmitting={isSubmitting}
              hideCommissionRate={true}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este parceiro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Partners;
