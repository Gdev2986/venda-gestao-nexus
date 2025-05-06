
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { usePartners } from "@/hooks/use-partners";
import PartnersTable from "@/components/partners/PartnersTable";
import { Search } from "lucide-react";

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { partners, loading: isLoading, error, filterPartners, refreshPartners } = usePartners();

  useEffect(() => {
    refreshPartners();
  }, [refreshPartners]);

  // Handle filtering
  useEffect(() => {
    filterPartners(searchTerm);
  }, [searchTerm, filterPartners]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto py-10">
      <PageHeader 
        title="Parceiros" 
        description="Visualize e encontre nossos parceiros"
      />

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>

      <PageWrapper>
        <Card>
          <CardHeader>
            <CardTitle>Nossos Parceiros</CardTitle>
            <CardDescription>Conheça os parceiros que trabalham conosco</CardDescription>
          </CardHeader>
          <CardContent>
            <PartnersTable 
              partners={partners} 
              isLoading={isLoading}
              onView={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </CardContent>
        </Card>
      </PageWrapper>
    </div>
  );
};

export default Partners;
