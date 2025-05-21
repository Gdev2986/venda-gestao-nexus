
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { PageHeader } from "@/components/page/PageHeader";
import { PATHS } from "@/routes/paths";

const Partners = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [activeTab, setActiveTab] = useState<string>("list");

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

  const handleViewClients = () => {
    navigate(PATHS.ADMIN.PARTNERS + "/clients");
  };

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Parceiros"
        description="Gerenciar parceiros e comissões"
      />

      <div className="mt-6 mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Lista de Parceiros</TabsTrigger>
            <TabsTrigger value="clients" onClick={handleViewClients}>
              Parceiros e Clientes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive p-3 rounded-md mb-4">
          Erro ao carregar parceiros: {error.message}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowCreateModal(true)}>Novo Parceiro</Button>
      </div>

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
