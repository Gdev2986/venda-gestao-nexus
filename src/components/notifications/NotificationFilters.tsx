
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationType } from "@/types";

interface NotificationFiltersProps {
  typeFilter?: string;
  statusFilter?: string;
  filter?: string; // Added for Notifications.tsx
  onTypeChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  setFilter?: (value: string) => void; // Added for Notifications.tsx
}

const NotificationFilters = ({ 
  typeFilter = 'all',
  statusFilter = 'all',
  filter,
  onTypeChange,
  onStatusChange,
  setFilter
}: NotificationFiltersProps) => {
  // Handle the different props based on which component is calling this
  const handleTypeChange = (value: string) => {
    if (onTypeChange) onTypeChange(value);
  };
  
  const handleStatusChange = (value: string) => {
    if (onStatusChange) onStatusChange(value);
    if (setFilter) setFilter(value);
  };
  
  return (
    <div className="flex gap-4">
      <Select 
        value={filter || typeFilter} 
        onValueChange={filter !== undefined ? setFilter : handleTypeChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
          <SelectItem value={NotificationType.SALE}>Vendas</SelectItem>
          <SelectItem value={NotificationType.PAYMENT}>Pagamentos</SelectItem>
          <SelectItem value={NotificationType.MACHINE}>Máquinas</SelectItem>
          <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
          <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
        </SelectContent>
      </Select>
      
      <Select 
        value={statusFilter} 
        onValueChange={handleStatusChange}
      >
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
