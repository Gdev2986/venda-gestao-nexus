
import { NotificationType } from "@/types/notification.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface NotificationTypeSelectorProps {
  type: NotificationType;
  onTypeChange: (value: NotificationType) => void;
}

export const NotificationTypeSelector = ({ type, onTypeChange }: NotificationTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="type">
        Tipo
      </Label>
      <Select
        value={type}
        onValueChange={(value) => onTypeChange(value as NotificationType)}
      >
        <SelectTrigger id="type">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
          <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
          <SelectItem value={NotificationType.MACHINE}>Máquinas</SelectItem>
          <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
          <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
          <SelectItem value={NotificationType.SALE}>Vendas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
