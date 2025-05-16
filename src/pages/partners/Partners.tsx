
import { useState, useEffect } from "react";
import { usePartners } from "@/hooks/use-partners";
import { Partner } from "@/types";
import { PartnersHeader } from "@/components/partners/PartnersHeader";
import { PartnersFilterCard } from "@/components/partners/PartnersFilterCard";
import { PartnersTableCard } from "@/components/partners/PartnersTableCard";

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  
  const { 
    partners, 
    isLoading, 
    error,
    deletePartner
  } = usePartners();

  useEffect(() => {
    // Filter partners based on search term
    if (!partners) return;
    
    const filtered = partners.filter(partner => {
      return partner.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredPartners(filtered);
  }, [partners, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDelete = async (partnerId: string) => {
    try {
      await deletePartner.mutateAsync(partnerId);
      return true;
    } catch (error) {
      console.error("Error deleting partner:", error);
      return false;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <PartnersHeader />

      <div className="grid gap-6 md:grid-cols-6 mt-8">
        {/* Filters card */}
        <div className="md:col-span-2">
          <PartnersFilterCard 
            onSearch={handleSearch} 
            searchTerm={searchTerm}
          />
        </div>

        {/* Partners table card */}
        <div className="md:col-span-4">
          <PartnersTableCard 
            partners={filteredPartners}
            isLoading={isLoading}
            error={error}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Partners;
