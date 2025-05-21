
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SupportHeaderProps {
  onNewRequest: () => void;
}

const SupportHeader = ({ onNewRequest }: SupportHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">Suporte</h1>
      <Button onClick={onNewRequest}>
        <Plus className="mr-2 h-4 w-4" />
        Nova Solicitação
      </Button>
    </div>
  );
};

export default SupportHeader;
