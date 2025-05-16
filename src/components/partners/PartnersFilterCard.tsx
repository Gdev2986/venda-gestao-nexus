
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export interface FilterValues {
  search?: string;
  status?: string;
  [key: string]: any;
}

export interface PartnersFilterCardProps {
  onFilter: (values: FilterValues) => void;
  isLoading?: boolean;
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

export const PartnersFilterCard = ({ 
  onFilter, 
  isLoading, 
  onSearch, 
  searchTerm = "" 
}: PartnersFilterCardProps) => {
  const [searchValue, setSearchValue] = useState(searchTerm);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search: searchValue });
    if (onSearch) onSearch(searchValue);
  };
  
  const handleClearFilters = () => {
    setSearchValue("");
    onFilter({});
    if (onSearch) onSearch("");
  };

  // If the searchTerm prop changes, update our local state
  if (searchTerm !== searchValue && searchTerm !== undefined) {
    setSearchValue(searchTerm);
  }

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
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
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
