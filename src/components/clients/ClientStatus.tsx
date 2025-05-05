
import { Badge } from "@/components/ui/badge";

type StatusType = "active" | "inactive" | "pending" | string;

interface ClientStatusProps {
  status: StatusType;
}

export const ClientStatus = ({ status }: ClientStatusProps) => {
  const variants: Record<StatusType, { variant: string; label: string }> = {
    "active": { variant: "success", label: "Ativo" },
    "inactive": { variant: "destructive", label: "Inativo" },
    "pending": { variant: "warning", label: "Pendente" },
    "default": { variant: "secondary", label: "Desconhecido" }
  };

  const { variant, label } = variants[status] || variants.default;

  return (
    <Badge variant={variant as any} className="capitalize">
      {label}
    </Badge>
  );
};

export default ClientStatus;
