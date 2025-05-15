
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Partner } from "@/types";
import { usePartners } from "@/hooks/use-partners";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import PartnersTable from "@/components/partners/PartnersTable";
import PartnersFilterCard from "@/components/partners/PartnersFilterCard";
import PartnerFormModal from "@/components/partners/PartnerFormModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const PartnersPage = () => {
  const { partners, isLoading, error, filterPartners, deletePartner, updatePartner } = usePartners();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const { toast } = useToast();

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowEditModal(true);
  };

  const handleDelete = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedPartner) {
      const success = await deletePartner(selectedPartner.id);
      if (success) {
        toast({
          title: "Parceiro excluído",
          description: "O parceiro foi removido com sucesso.",
        });
      }
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Parceiros"
        description="Gerencie os parceiros do sistema"
      >
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Parceiro
        </Button>
      </PageHeader>

      <PageWrapper>
        <div className="space-y-6">
          <PartnersFilterCard
            onFilter={(values) => filterPartners(values.search || "")}
            isLoading={isLoading}
          />

          {error ? (
            <div className="p-4 border rounded-md bg-red-50 text-red-800">
              <p className="font-semibold">Erro ao carregar parceiros</p>
              <p>{error}</p>
            </div>
          ) : (
            <PartnersTable
              partners={partners}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </PageWrapper>

      {/* Create Partner Modal */}
      <PartnerFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Novo Parceiro"
      />

      {/* Edit Partner Modal */}
      {selectedPartner && (
        <PartnerFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Editar ${selectedPartner.company_name}`}
          initialData={selectedPartner}
          onSubmit={async (data) => {
            const success = await updatePartner(selectedPartner.id, data);
            return success;
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o parceiro 
              <strong> {selectedPartner?.company_name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PartnersPage;
