
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PATHS } from "@/routes/paths";
import { Search } from "lucide-react";
import { Partner } from "@/types";
import { useDialog } from "@/hooks/use-dialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import PartnersTable from "@/components/partners/PartnersTable";
import PartnerDetailsView from "@/components/partners/PartnerDetailsView";
import { usePartners } from "@/hooks/use-partners";
import PartnerForm, { PartnerFormValues } from "@/components/partners/PartnerForm";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import PartnerFormModal from "@/components/partners/PartnerFormModal";

const AdminPartners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { partners, loading: isLoading, error, filterPartners, createPartner, updatePartner, deletePartner, refreshPartners } = usePartners();
  const { toast } = useToast();

  // Initialize partners data
  useEffect(() => {
    refreshPartners();
  }, [refreshPartners]);

  // Handle filtering
  useEffect(() => {
    const commissionRange = undefined; // Not using commission filtering in this basic implementation
    filterPartners(searchTerm, commissionRange);
  }, [searchTerm, filterPartners]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle edit partner form submit
  const handleEditPartner = async (data: PartnerFormValues) => {
    if (!selectedPartner) return false;
    
    setIsSubmitting(true);
    try {
      const success = await updatePartner(selectedPartner.id, {
        ...data,
        company_name: data.company_name,
        business_name: data.business_name || data.company_name,
        contact_name: data.contact_name || "",
        email: data.email || "",
        phone: data.phone || "",
        commission_rate: data.commission_rate
      });

      if (success) {
        toast({
          title: "Parceiro atualizado",
          description: "Os dados do parceiro foram atualizados com sucesso.",
        });
        setIsEditDialogOpen(false);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível atualizar os dados do parceiro.",
        });
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete partner confirmation
  const handleDeletePartnerConfirm = async () => {
    if (!partnerToDelete) return;
    
    setIsSubmitting(true);
    try {
      const success = await deletePartner(partnerToDelete.id);

      if (success) {
        toast({
          title: "Parceiro excluído",
          description: "O parceiro foi excluído com sucesso.",
        });
        if (selectedPartner?.id === partnerToDelete.id) {
          setSelectedPartner(null);
          setIsViewDialogOpen(false);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível excluir o parceiro.",
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setPartnerToDelete(null);
    }
  };

  // Handle opening partner details
  const handleViewPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsViewDialogOpen(true);
  };

  // Handle opening edit dialog
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  // Handle opening delete confirmation dialog
  const handleDeleteClick = () => {
    if (!selectedPartner) return;
    setPartnerToDelete(selectedPartner);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Parceiros" 
        description="Gerencie os parceiros e consultores do sistema"
        actionLabel="Adicionar Parceiro"
        actionOnClick={() => setIsCreateDialogOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative flex-1 md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={filterStatus} 
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <PageWrapper>
        <PartnersTable
          partners={partners}
          isLoading={isLoading}
          onView={handleViewPartner}
          onEdit={(partner) => {
            setSelectedPartner(partner);
            setIsEditDialogOpen(true);
          }}
          onDelete={(partner) => {
            setPartnerToDelete(partner);
            setIsDeleteDialogOpen(true);
          }}
        />
      </PageWrapper>

      {/* Partner Details Dialog */}
      {selectedPartner && (
        <PartnerDetailsView 
          partner={selectedPartner}
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Create Partner Modal */}
      <PartnerFormModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Novo Parceiro"
      />

      {/* Edit Partner Modal */}
      {selectedPartner && (
        <PartnerFormModal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Editar Parceiro"
        />
      )}

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
              onClick={handleDeletePartnerConfirm}
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

export default AdminPartners;
