import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import PartnersTable from "@/components/partners/PartnersTable";
import { Partner } from "@/types";
import { generateMockPartners, filterPartners } from "@/utils/partners-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PartnerFormModal from "@/components/partners/PartnerFormModal";

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  
  const itemsPerPage = 10;
  
  useEffect(() => {
    // Simulate API fetch
    const fetchPartners = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from an API
        setTimeout(() => {
          const mockPartners = generateMockPartners(25);
          setPartners(mockPartners);
          setFilteredPartners(mockPartners);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching partners:", error);
        setIsLoading(false);
        toast({
          title: "Erro ao carregar parceiros",
          description: "Não foi possível carregar a lista de parceiros.",
          variant: "destructive",
        });
      }
    };
    
    fetchPartners();
  }, [toast]);
  
  useEffect(() => {
    // Filter partners based on search term
    const result = filterPartners(partners, searchTerm);
    setFilteredPartners(result);
    // Reset to first page when filter changes
    setPage(1);
  }, [searchTerm, partners]);
  
  // Get current page of partners
  const getCurrentPartners = () => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredPartners.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  
  const handleViewPartner = (partner: Partner) => {
    toast({
      title: "Visualizando parceiro",
      description: `Detalhes de ${partner.company_name}`,
    });
  };
  
  const handleEditPartner = (partner: Partner) => {
    toast({
      title: "Editando parceiro",
      description: `Editar ${partner.company_name}`,
    });
  };
  
  const handleDeletePartner = (partner: Partner) => {
    toast({
      title: "Confirmação",
      description: `Deseja realmente excluir ${partner.company_name}?`,
    });
  };

  const handleCreatePartner = async (data: any) => {
    // Prepare complete partner data with required fields
    const partnerData = {
      company_name: data.company_name,
      business_name: data.business_name || data.company_name,
      contact_name: data.contact_name || "",
      email: data.email || "",
      phone: data.phone || "",
      commission_rate: data.commission_rate || 0,
      address: data.address || "", // Add required field
      total_sales: data.total_sales || 0, // Add required field
      total_commission: data.total_commission || 0 // Add required field
    };
    
    // Simulate API call to create partner
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPartner: Partner = {
          id: Math.random().toString(), // Mock ID generation
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...partnerData,
        };
        
        setPartners((prevPartners) => [newPartner, ...prevPartners]);
        setFilteredPartners((prevFilteredPartners) => [newPartner, ...prevFilteredPartners]);
        
        toast({
          title: "Parceiro criado",
          description: "O parceiro foi criado com sucesso.",
        });
        
        resolve(true);
      }, 500);
    });
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="Parceiros" 
        description="Gerenciar parceiros e suas comissões"
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Parceiro
        </Button>
      </PageHeader>
      
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar parceiros..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <PartnersTable 
            partners={getCurrentPartners()}
            isLoading={isLoading}
            onView={handleViewPartner}
            onEdit={handleEditPartner}
            onDelete={handleDeletePartner}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </PageWrapper>

      <PartnerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePartner}
      />
    </MainLayout>
  );
};

export default AdminPartners;
