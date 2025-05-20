
import { Button } from "@/components/ui/button";

interface SupportHeaderProps {
  onNewRequest: () => void;
}

export function SupportHeader({ onNewRequest }: SupportHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">Suporte</h1>
      <Button onClick={onNewRequest}>
        Nova Solicitação
      </Button>
    </div>
  );
}
