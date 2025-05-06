
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

const AdminPartners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  // Handle create partner form submit
  const handleCreatePartner = async (data: PartnerFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await createPartner({
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
          title: "Parceiro criado",
          description: "O parceiro foi criado com sucesso.",
        });
        setIsCreateDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível criar o parceiro.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit partner form submit
  const handleEditPartner = async (data: PartnerFormValues) => {
    if (!selectedPartner) return;
    
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
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível atualizar os dados do parceiro.",
        });
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
  };

  // Handle opening edit dialog
  const handleEditClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsEditDialogOpen(true);
  };

  // Handle opening delete confirmation dialog
  const handleDeleteClick = (partner: Partner) => {
    setPartnerToDelete(partner);
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
          
          <Select 
            value={filterPeriod} 
            onValueChange={setFilterPeriod}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="current_month">Mês atual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <PageWrapper>
        <PartnersTable
          partners={partners}
          isLoading={isLoading}
          onView={handleViewPartner}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </PageWrapper>

      {/* Partner Details Dialog */}
      {selectedPartner && (
        <Dialog open={!!selectedPartner && !isEditDialogOpen} onOpenChange={(isOpen) => !isOpen && setSelectedPartner(null)}>
          <PartnerDetailsView 
            partner={selectedPartner}
            onClose={() => setSelectedPartner(null)}
            onEdit={() => setIsEditDialogOpen(true)}
            onDelete={() => {
              setPartnerToDelete(selectedPartner);
              setIsDeleteDialogOpen(true);
            }}
          />
        </Dialog>
      )}

      {/* Create Partner Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Novo Parceiro</h2>
          <PartnerForm
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            onSubmit={handleCreatePartner}
            isSubmitting={isSubmitting}
            title="Novo Parceiro"
          />
        </div>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={isEditDialogOpen && !!selectedPartner} onOpenChange={setIsEditDialogOpen}>
        {selectedPartner && (
          <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Parceiro</h2>
            <PartnerForm
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              onSubmit={handleEditPartner}
              initialData={{
                company_name: selectedPartner.company_name,
                business_name: selectedPartner.business_name,
                contact_name: selectedPartner.contact_name,
                email: selectedPartner.email,
                phone: selectedPartner.phone,
                commission_rate: selectedPartner.commission_rate
              }}
              isSubmitting={isSubmitting}
              title="Editar Parceiro"
            />
          </div>
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
