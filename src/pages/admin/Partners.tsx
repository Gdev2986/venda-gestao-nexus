
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePartners } from "@/hooks/use-partners";
import PartnersTable from "@/components/partners/PartnersTable";
import PartnerFormModal from "@/components/partners/PartnerFormModal";
import PartnerDetailsView from "@/components/partners/PartnerDetailsView";
import { Partner } from "@/types";
import { formatCurrency } from "@/lib/utils";
import PartnersFilterCard from "@/components/partners/PartnersFilterCard";
import PartnersTableCard from "@/components/partners/PartnersTableCard";
import { FilterValues } from "@/types";

const AdminPartners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const { partners, loading: isLoading, error, filterPartners, createPartner, updatePartner, deletePartner } = usePartners();
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterPartners(e.target.value);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDeleteDialogOpen(true);
  };

  const handleViewPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsViewModalOpen(true);
  };

  const handleDeletePartner = async () => {
    if (!selectedPartner) return;

    const success = await deletePartner(selectedPartner.id);

    if (success) {
      toast({
        title: "Parceiro excluído",
        description: "O parceiro foi excluído com sucesso."
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFilter = (values: FilterValues) => {
    filterPartners(values.search, values.commissionRange);
  };

  return (
    <div>
      <PageHeader 
        title="Parceiros" 
        description="Gerencie os parceiros e consultores do sistema"
        actionLabel="Novo Parceiro"
        actionIcon={<Plus className="h-4 w-4 mr-2" />}
        actionOnClick={handleOpenCreateModal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <PartnersFilterCard 
            onFilter={handleFilter}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-3">
          <PartnersTableCard 
            partners={partners}
            isLoading={isLoading}
            error={error || ""}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
          />
        </div>
      </div>

      {/* Create Partner Modal */}
      {isCreateModalOpen && (
        <PartnerFormModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Novo Parceiro"
          onSubmit={async (data) => {
            const result = await createPartner({
              company_name: data.company_name,
              business_name: data.business_name || data.company_name,
              contact_name: data.contact_name || "",
              email: data.email || "",
              phone: data.phone || "",
              commission_rate: data.commission_rate || 0,
              address: "",
              total_sales: 0,
              total_commission: 0
            });
            return result;
          }}
        />
      )}

      {/* Edit Partner Modal */}
      {isEditModalOpen && selectedPartner && (
        <PartnerFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Parceiro"
          onSubmit={async (data) => {
            if (!selectedPartner) return false;
            
            const result = await updatePartner(selectedPartner.id, {
              company_name: data.company_name,
              business_name: data.business_name || data.company_name,
              contact_name: data.contact_name || "",
              email: data.email || "",
              phone: data.phone || "",
              commission_rate: data.commission_rate || selectedPartner.commission_rate
            });
            
            return result;
          }}
        />
      )}

      {/* View Partner Details */}
      {isViewModalOpen && selectedPartner && (
        <PartnerDetailsView
          partner={selectedPartner}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDelete={() => {
            setIsViewModalOpen(false);
            setIsDeleteDialogOpen(true);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este parceiro? Esta ação não pode ser desfeita.
              {selectedPartner && (
                <p className="font-medium mt-2">{selectedPartner.company_name}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePartner}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPartners;
