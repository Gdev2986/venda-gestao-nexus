
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatus } from "@/types";
import { Search, Filter } from "lucide-react";

interface PaymentFiltersProps {
  statusFilter: PaymentStatus | "ALL";
  searchTerm: string;
  onFilterChange: (statusFilter: PaymentStatus | "ALL", searchTerm: string) => void;
}

export const PaymentFilters = ({
  statusFilter,
  searchTerm,
  onFilterChange,
}: PaymentFiltersProps) => {
  const [localStatusFilter, setLocalStatusFilter] = useState<PaymentStatus | "ALL">(statusFilter);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleApplyFilters = () => {
    onFilterChange(localStatusFilter, localSearchTerm);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente, descrição..."
          className="pl-8 bg-background"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={localStatusFilter}
          onValueChange={(value) => setLocalStatusFilter(value as PaymentStatus | "ALL")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            <SelectItem value={PaymentStatus.PENDING}>Pendentes</SelectItem>
            <SelectItem value={PaymentStatus.APPROVED}>Aprovados</SelectItem>
            <SelectItem value={PaymentStatus.REJECTED}>Rejeitados</SelectItem>
            <SelectItem value={PaymentStatus.PAID}>Pagos</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={handleApplyFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>
    </div>
  );
};
