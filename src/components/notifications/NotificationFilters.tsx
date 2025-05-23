
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw, Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";

interface NotificationFiltersProps {
  typeFilter: string;
  statusFilter: string;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
}

const NotificationFilters = ({
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
  onMarkAllAsRead,
  onRefresh,
}: NotificationFiltersProps) => {
  const { soundEnabled, setSoundEnabled } = useNotifications();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
            <SelectItem value="payment">Pagamento</SelectItem>
            <SelectItem value="sale">Venda</SelectItem>
            <SelectItem value="machine">Máquina</SelectItem>
            <SelectItem value="support">Suporte</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="read">Lidos</SelectItem>
            <SelectItem value="unread">Não lidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 ml-auto">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Desativar sons" : "Ativar sons"}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onMarkAllAsRead}
          title="Marcar todas como lidas"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onRefresh}
          title="Atualizar"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationFilters;
