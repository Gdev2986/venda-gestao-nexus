
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationType } from "@/types";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from "lucide-react";

interface NotificationFiltersProps {
  typeFilter?: string;
  statusFilter?: string;
  onTypeChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onMarkAllAsRead?: () => Promise<void>;
  onRefresh?: () => Promise<void>;
}

const NotificationFilters = ({ 
  typeFilter = "all", 
  statusFilter = "all", 
  onTypeChange,
  onStatusChange,
  onMarkAllAsRead,
  onRefresh
}: NotificationFiltersProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={onTypeChange}>
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
      
      <div className="flex gap-2">
        {onMarkAllAsRead && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
        
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationFilters;
