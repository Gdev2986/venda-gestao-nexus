
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MachineList from "@/components/logistics/machines/MachineList";

export interface MachinesAllTabProps {
  searchTerm: string;
  modelFilter: string;
  statusFilter: string;
  onSearchChange?: (value: string) => void;
  onModelFilterChange?: (value: string) => void;
  onStatusFilterChange?: (value: string) => void;
  onAddNewClick?: () => void;
}

const MachinesAllTab: React.FC<MachinesAllTabProps> = ({
  searchTerm,
  modelFilter,
  statusFilter,
  onSearchChange = () => {},
  onModelFilterChange = () => {},
  onStatusFilterChange = () => {},
  onAddNewClick = () => {},
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar máquinas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-row gap-2">
          <Select
            value={modelFilter}
            onValueChange={onModelFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os modelos</SelectItem>
              <SelectItem value="pos">POS</SelectItem>
              <SelectItem value="terminal">Terminal</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={onStatusFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="maintenance">Em manutenção</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onAddNewClick}>Nova Máquina</Button>
        </div>
      </div>
      
      <MachineList
        searchTerm={searchTerm}
        modelFilter={modelFilter}
        statusFilter={statusFilter}
      />
    </div>
  );
};

export default MachinesAllTab;
