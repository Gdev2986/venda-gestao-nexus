
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, Download } from "lucide-react";

interface SalesTableHeaderProps {
  title: string;
  totalCount?: number;
  filteredCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SalesTableHeader = ({ 
  title, 
  totalCount, 
  filteredCount, 
  searchTerm, 
  onSearchChange 
}: SalesTableHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-600" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {totalCount || filteredCount} transações encontradas
        </p>
      </div>
      
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código ou terminal..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
