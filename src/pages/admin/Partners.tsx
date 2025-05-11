
import { useState } from "react";
import { MoreHorizontal, PlusCircle, Trash2, FileEdit, Link } from "lucide-react";
import { usePartners } from "@/hooks/use-partners";
import { Partner } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import PartnersTable from "@/components/partners/PartnersTable";
import PartnersFilterCard from "@/components/partners/PartnersFilterCard";

const PartnersPage = () => {
  const {
    partners,
    isLoading,
    filterPartners,
    deletePartner,
    refreshPartners
  } = usePartners();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterPartners(value);
  };
  
  const handleDeletePartner = (partner: Partner) => {
    setPartnerToDelete(partner);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (partnerToDelete) {
      await deletePartner(partnerToDelete.id);
      setIsDeleteDialogOpen(false);
      setPartnerToDelete(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Parceiros"
        description="Gerencie todos os parceiros da plataforma"
        actionLabel="Novo Parceiro"
        actionOnClick={() => {}}
      />
      
      <PageWrapper>
        <div className="grid gap-6">
          <PartnersFilterCard
            onFilter={(values) => filterPartners(values.search || "")}
            isLoading={isLoading}
          />
          
          <PartnersTable 
            partners={partners}
            isLoading={isLoading}
            onDelete={handleDeletePartner}
          />
        </div>
        
        {/* Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir o parceiro <strong>{partnerToDelete?.company_name}</strong>?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageWrapper>
    </div>
  );
};

export default PartnersPage;
