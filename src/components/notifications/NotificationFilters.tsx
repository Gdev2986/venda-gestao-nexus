
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationFiltersProps {
  typeFilter: string;
  statusFilter: string;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const NotificationFilters = ({ 
  typeFilter, 
  statusFilter, 
  onTypeChange, 
  onStatusChange 
}: NotificationFiltersProps) => {
  return (
    <div className="flex gap-4">
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="GENERAL">Geral</SelectItem>
          <SelectItem value="SALE">Vendas</SelectItem>
          <SelectItem value="PAYMENT">Pagamentos</SelectItem>
          <SelectItem value="MACHINE">Máquinas</SelectItem>
          <SelectItem value="SUPPORT">Suporte</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="unread">Não lidas</SelectItem>
          <SelectItem value="read">Lidas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NotificationFilters;
