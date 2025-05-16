
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Partner } from "@/types";
import { usePartners } from "@/hooks/use-partners"; 
import PartnersTable from "@/components/partners/PartnersTable";
import { PartnerFormModal } from "@/components/partners/PartnerFormModal";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);

  const { 
    partners, 
    isLoading, 
    error, 
    createPartner, 
    updatePartner,
    deletePartner
  } = usePartners();

  useEffect(() => {
    // Filter partners based on search term
    if (!partners) return;
    
    const filtered = partners.filter(partner => {
      return partner.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredPartners(filtered);
  }, [partners, searchTerm]);

  const handleCreatePartner = async (data: Partial<Partner>) => {
    try {
      // Use mutateAsync from the hook instead of calling directly
      await createPartner.mutateAsync(data);
      setShowCreateModal(false);
      return true;
    } catch (error) {
      console.error("Error creating partner:", error);
      return false;
    }
  };

  const handleUpdatePartner = async (data: Partial<Partner>) => {
    if (!selectedPartner) return false;
    
    try {
      // Use mutateAsync from the hook
      await updatePartner.mutateAsync({
        ...data,
        id: selectedPartner.id
      });
      
      setShowEditModal(false);
      setSelectedPartner(null);
      return true;
    } catch (error) {
      console.error("Error updating partner:", error);
      return false;
    }
  };

  const handleDeletePartner = async (partnerId: string) => {
    try {
      // Use mutateAsync from the hook
      await deletePartner.mutateAsync(partnerId);
      return true;
    } catch (error) {
      console.error("Error deleting partner:", error);
      return false;
    }
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Parceiros</h1>
          <p className="text-muted-foreground">Gerenciar parceiros e comissões</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Novo Parceiro</Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive p-3 rounded-md mb-4">
          Erro ao carregar parceiros: {error.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-6">
        {/* Left column - filters */}
        <div className="md:col-span-2">
          <PartnersFilterCard 
            onFilter={(values) => setSearchTerm(values.search || "")} 
            isLoading={isLoading}
          />
        </div>

        {/* Right column - partner list */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Lista de Parceiros
                <Badge variant="secondary" className="ml-2">
                  {filteredPartners.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PartnersTable 
                partners={filteredPartners} 
                isLoading={isLoading} 
                onEdit={handleEdit}
                onDelete={(partner) => handleDeletePartner(partner.id)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Partner creation modal */}
      <PartnerFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePartner}
        isSubmitting={createPartner.isPending}
      />

      {/* Partner edit modal */}
      {selectedPartner && (
        <PartnerFormModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSubmit={handleUpdatePartner}
          isSubmitting={updatePartner.isPending}
          defaultValues={selectedPartner}
          mode="edit"
        />
      )}
    </div>
  );
};

export default Partners;
