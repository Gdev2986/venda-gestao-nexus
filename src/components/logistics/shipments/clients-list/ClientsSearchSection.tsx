
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClientsSearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ClientsSearchSection = ({ searchTerm, onSearchChange }: ClientsSearchSectionProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar clientes por nome, empresa, email ou cidade..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default ClientsSearchSection;
