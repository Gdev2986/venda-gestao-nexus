
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page/PageHeader";
import { UserPlus } from "lucide-react";

interface ClientsHeaderProps {
  onCreateClient: () => void;
}

const ClientsHeader = ({ onCreateClient }: ClientsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <PageHeader
        title="Clientes"
        description="Gerenciar clientes do sistema"
      />
      <Button onClick={onCreateClient}>
        <UserPlus className="h-4 w-4 mr-2" />
        Novo Cliente
      </Button>
    </div>
  );
};

export default ClientsHeader;
