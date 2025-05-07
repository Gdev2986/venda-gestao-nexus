import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Partner, FilterValues } from "@/types";
import { useToast } from "@/hooks/use-toast";
import PartnersTable from "@/components/partners/PartnersTable";
import { generateMockPartners } from "@/utils/partners-utils";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import PartnersFilterCard from "@/components/partners/PartnersFilterCard";

const Partners = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterValues>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockPartners = generateMockPartners(50);
      setPartners(mockPartners);
      setFilteredPartners(mockPartners);
      setIsLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPartners();

    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dados atualizados",
        description: "Lista de parceiros atualizada com sucesso"
      });
    }, 1500);
  };

  // Apply filters when they change
  useEffect(() => {
    let result = [...partners];

    if (filters.search) {
      result = result.filter(
        (partner) =>
          partner.company_name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          (partner.email && partner.email.toLowerCase().includes(filters.search!.toLowerCase())) ||
          (partner.phone && partner.phone.toLowerCase().includes(filters.search!.toLowerCase()))
      );
    }

    setFilteredPartners(result);
    setPage(1); // Reset to first page when filters change
  }, [filters, partners]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedPartners = filteredPartners.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (values: FilterValues) => {
    setFilters(values);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parceiros</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize todos os seus parceiros
          </p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            Novo parceiro
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <PartnersFilterCard
            onFilter={handleFilterChange}
            isLoading={isLoading}
          />
        </div>
        <div className="md:col-span-3">
          <PartnersTable
            partners={paginatedPartners}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Partners;
