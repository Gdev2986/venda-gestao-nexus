
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";

export interface UserFilters {
  search: string;
  role: UserRole | null;
}

interface UserFiltersProps {
  onFilterChange: (filters: UserFilters) => void;
}

const UserFilters = ({ onFilterChange }: UserFiltersProps) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search, role });
  };

  const handleRoleChange = (value: string) => {
    // Convert string value to UserRole or null
    const selectedRole = value === "all" ? null : value as UserRole;
    setRole(selectedRole);
    onFilterChange({ search, role: selectedRole });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // Não aplicamos o filtro imediatamente para evitar muitas chamadas
  };

  const handleClearFilters = () => {
    setSearch("");
    setRole(null);
    onFilterChange({ search: "", role: null });
  };

  return (
    <div className="mb-4 space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email"
            value={search}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filtrar por função:</span>
          <Select value={role || "all"} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as funções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as funções</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
              <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
              <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
              <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(search || role) && (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFilters;
