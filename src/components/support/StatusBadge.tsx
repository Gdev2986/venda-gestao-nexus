
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch(status) {
    case "OPEN":
      return <Badge className="bg-green-500">Aberto</Badge>;
    case "IN_PROGRESS":
      return <Badge className="bg-amber-500">Em Andamento</Badge>;
    case "RESOLVED":
      return <Badge className="bg-gray-500">Resolvido</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default StatusBadge;
