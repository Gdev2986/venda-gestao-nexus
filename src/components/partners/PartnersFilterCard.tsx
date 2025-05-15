
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterValues } from "@/types";
import { Search } from "lucide-react";

interface PartnersFilterCardProps {
  onFilter: (values: FilterValues) => void;
  isLoading?: boolean;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
}

const PartnersFilterCard = ({ 
  onFilter, 
  isLoading,
  searchTerm: externalSearchTerm,
  onSearchTermChange
}: PartnersFilterCardProps) => {
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || "");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchTermChange) {
      onSearchTermChange(value);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search: searchTerm });
  };
  
  const handleClearFilters = () => {
    setSearchTerm("");
    if (onSearchTermChange) {
      onSearchTermChange("");
    }
    onFilter({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-9"
                placeholder="Buscar por nome, email ou telefone" 
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                Filtrar
              </Button>
              <Button type="button" variant="outline" onClick={handleClearFilters} disabled={isLoading}>
                Limpar
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PartnersFilterCard;
export { PartnersFilterCard };
