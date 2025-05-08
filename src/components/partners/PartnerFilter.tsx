
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FilterValues } from "@/types";

interface PartnerFilterProps {
  onApplyFilter: (values: FilterValues) => void;
  isLoading?: boolean;
}

const PartnerFilter: React.FC<PartnerFilterProps> = ({ onApplyFilter, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [commissionRange, setCommissionRange] = useState<[number, number]>([0, 100]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values: FilterValues = {
      search: searchTerm, // Use search which is in the FilterValues interface
      searchTerm: searchTerm, // Keep for backward compatibility
      commissionRange: commissionRange
    };
    onApplyFilter(values);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCommissionRange([0, 100]);
    
    const values: FilterValues = {
      search: "",
      searchTerm: "",
      commissionRange: [0, 100]
    };
    onApplyFilter(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          placeholder="Nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label>Comissão (%)</Label>
          <span className="text-sm text-muted-foreground">
            {commissionRange[0]}% - {commissionRange[1]}%
          </span>
        </div>
        <Slider
          defaultValue={[0, 100]}
          max={100}
          step={1}
          value={commissionRange}
          onValueChange={(value: [number, number]) => setCommissionRange(value)}
        />
      </div>
      
      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Limpar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Filtrando...' : 'Aplicar Filtros'}
        </Button>
      </div>
    </form>
  );
};

export default PartnerFilter;
