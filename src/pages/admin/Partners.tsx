
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Partner } from "@/types/partner.types";
import { usePartners } from "@/hooks/use-partners"; 
import { PartnerFormModal } from "@/components/partners/PartnerFormModal";
import { PageHeader } from "@/components/page/PageHeader";
import { PartnerBlock } from "@/components/partners/PartnerBlock";
import { PartnerDetailsModal } from "@/components/partners/PartnerDetailsModal";
import { PartnerClientsTable } from "@/components/partners/PartnerClientsTable";

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [detailsPartner, setDetailsPartner] = useState<Partner | null>(null);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);

  const { 
    partners, 
    isLoading, 
    error, 
    createPartner
  } = usePartners();

  useEffect(() => {
    // Filter partners based on search term
    if (!partners) return;
    
    const filtered = partners.filter(partner => {
      return partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (partner.contact_name && partner.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
             (partner.contact_email && partner.contact_email.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const handleViewDetails = (partner: Partner) => {
    setDetailsPartner(partner);
    setShowDetailsModal(true);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Parceiros"
        description="Gerenciar parceiros e seus clientes"
      >
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Parceiro
        </Button>
      </PageHeader>

      {/* Error display */}
      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive p-3 rounded-md mb-6">
          Erro ao carregar parceiros: {error.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left section - Partner blocks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Lista de Parceiros
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredPartners.length} parceiros
                </span>
              </CardTitle>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar parceiros..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPartners.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum parceiro encontrado</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredPartners.map((partner) => (
                    <PartnerBlock
                      key={partner.id}
                      partner={partner}
                      onSelect={handleSelectPartner}
                      onViewDetails={handleViewDetails}
                      isSelected={selectedPartner?.id === partner.id}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right section - Partner clients table */}
        <div className="lg:col-span-3">
          <PartnerClientsTable partner={selectedPartner} />
        </div>
      </div>

      {/* Partner creation modal */}
      <PartnerFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePartner}
        isSubmitting={createPartner.isPending}
      />

      {/* Partner details modal */}
      <PartnerDetailsModal
        partner={detailsPartner}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />
    </div>
  );
};

export default Partners;
