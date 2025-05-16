
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatus } from "@/types";
import { Search } from "lucide-react";

export interface PaymentFiltersProps {
  searchTerm: string;
  statusFilter: PaymentStatus | "ALL";
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: PaymentStatus | "ALL") => void;
  // Add backwards compatibility for components that use old prop names
  onSearchChange?: (value: string) => void;
  onStatusFilterChange?: (value: PaymentStatus | "ALL") => void;
}

export function PaymentFilters({
  searchTerm,
  statusFilter,
  setSearchTerm,
  setStatusFilter,
  onSearchChange,
  onStatusFilterChange
}: PaymentFiltersProps) {
  // Handle both old and new prop patterns
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (onSearchChange) onSearchChange(value);
  };

  const handleStatusChange = (value: PaymentStatus | "ALL") => {
    setStatusFilter(value);
    if (onStatusFilterChange) onStatusFilterChange(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar pagamentos..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={statusFilter}
        onValueChange={(value: PaymentStatus | "ALL") => handleStatusChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os Status</SelectItem>
          <SelectItem value="PENDING">Pendentes</SelectItem>
          <SelectItem value="APPROVED">Aprovados</SelectItem>
          <SelectItem value="REJECTED">Rejeitados</SelectItem>
          <SelectItem value="PAID">Pagos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
