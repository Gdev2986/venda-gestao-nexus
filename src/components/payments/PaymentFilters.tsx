
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatus } from "@/types/enums";

interface PaymentFiltersProps {
  searchTerm: string;
  statusFilter: PaymentStatus | "ALL";
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: PaymentStatus | "ALL") => void;
}

export const PaymentFilters = ({
  searchTerm,
  statusFilter,
  setSearchTerm,
  setStatusFilter,
}: PaymentFiltersProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Atualiza o valor de busca depois de um tempo para evitar muitas chamadas
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchTerm]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente, ID de pagamento..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as PaymentStatus | "ALL")}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os Status</SelectItem>
          <SelectItem value={PaymentStatus.PENDING}>Pendente</SelectItem>
          <SelectItem value={PaymentStatus.PROCESSING}>Em Processamento</SelectItem>
          <SelectItem value={PaymentStatus.APPROVED}>Aprovado</SelectItem>
          <SelectItem value={PaymentStatus.REJECTED}>Recusado</SelectItem>
          <SelectItem value={PaymentStatus.PAID}>Pago</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
