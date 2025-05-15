
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { FilterValues } from "@/types";

export interface PartnersFilterCardProps {
  onFilter?: (values: FilterValues) => void;
  onSearch?: (searchTerm: string) => void;
  isLoading?: boolean;
}

export function PartnersFilterCard({ onFilter, onSearch, isLoading = false }: PartnersFilterCardProps) {
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onFilter) {
      onFilter({ search });
    }
    
    if (onSearch) {
      onSearch(search);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar parceiros..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default PartnersFilterCard;
