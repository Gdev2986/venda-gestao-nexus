
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FilterIcon } from "lucide-react";
import { PaymentStatus } from "@/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";

interface PaymentFiltersProps {
  statusFilter: PaymentStatus | "ALL";
  searchTerm: string;
  onFilterChange: (search: string, status: PaymentStatus | "ALL") => void;
}

export const PaymentFilters = ({
  statusFilter,
  searchTerm,
  onFilterChange
}: PaymentFiltersProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

  useEffect(() => {
    onFilterChange(debouncedSearchTerm, statusFilter);
  }, [statusFilter, debouncedSearchTerm, onFilterChange]);

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou descrição"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={(value) => onFilterChange(debouncedSearchTerm, value as PaymentStatus | "ALL")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="APPROVED">Aprovado</SelectItem>
              <SelectItem value="REJECTED">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => {
            setLocalSearchTerm('');
            onFilterChange('', 'ALL');
          }}>
            <FilterIcon className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </div>
    </Card>
  );
};
