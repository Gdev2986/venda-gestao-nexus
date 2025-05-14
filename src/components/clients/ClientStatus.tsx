
import { Badge } from "@/components/ui/badge";
import { ClientStatus as ClientStatusEnum } from "@/types";

interface ClientStatusProps {
  status: string;
}

export const ClientStatus = ({ status }: ClientStatusProps) => {
  let statusProps: { variant?: "default" | "secondary" | "destructive" | "outline" | "blue" | "green" | "yellow" | "purple"; className?: string } = {};

  switch (status) {
    case ClientStatusEnum.ACTIVE:
      statusProps.className = "bg-green-100 text-green-800 hover:bg-green-100";
      break;
    case ClientStatusEnum.INACTIVE:
      statusProps.variant = "destructive";
      break;
    case ClientStatusEnum.PENDING:
      statusProps.className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      break;
    default:
      statusProps.variant = "outline";
  }

  return (
    <Badge {...statusProps}>
      {status === ClientStatusEnum.ACTIVE && "Ativo"}
      {status === ClientStatusEnum.INACTIVE && "Inativo"}
      {status === ClientStatusEnum.PENDING && "Pendente"}
      {!Object.values(ClientStatusEnum).includes(status as ClientStatusEnum) && status}
    </Badge>
  );
};
