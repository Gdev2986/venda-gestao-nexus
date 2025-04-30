
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PartnersHeaderProps {
  onCreateClick: () => void;
}

export function PartnersHeader({ onCreateClick }: PartnersHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold tracking-tight">Parceiros</h2>
      <Button onClick={onCreateClick}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Novo Parceiro
      </Button>
    </div>
  );
}

export default PartnersHeader;
