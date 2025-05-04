
import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ClientsFilterProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetFilters: () => void;
  showFiltersToggle: boolean;
  onToggleFilters: () => void;
}

const ClientsFilter = ({
  searchTerm,
  onSearchChange,
  onResetFilters,
  showFiltersToggle,
  onToggleFilters,
}: ClientsFilterProps) => {
  return (
    <div className="flex justify-between items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-8"
        />
      </div>

      <div className="flex gap-2">
        {searchTerm && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
          >
            <FilterX className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
        >
          {showFiltersToggle ? "Ocultar filtros" : "Mostrar filtros"}
        </Button>
      </div>
    </div>
  );
};

export default ClientsFilter;
