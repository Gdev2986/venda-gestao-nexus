
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PartnersHeaderProps {
  onCreateClick: () => void;
  onCreatePartner?: () => void; // Add this prop to support the existing code
}

export function PartnersHeader({ onCreateClick, onCreatePartner }: PartnersHeaderProps) {
  // Use onCreatePartner if provided, otherwise fall back to onCreateClick
  const handleClick = onCreatePartner || onCreateClick;
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold tracking-tight">Parceiros</h2>
      <Button onClick={handleClick}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Novo Parceiro
      </Button>
    </div>
  );
}

export default PartnersHeader;
