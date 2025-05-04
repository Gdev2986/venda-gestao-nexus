
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { debounce } from "lodash";
import { Partner } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";

interface ClientsFilterProps {
  partners: Partner[];
  feePlans: Array<{ id: string; name: string }>;
  onFilter: (filters: ClientFilters) => void;
}

export interface ClientFilters {
  search?: string;
  partnerId?: string;
  feePlanId?: string;
  balanceRange?: [number, number];
}

const DEFAULT_BALANCE_RANGE: [number, number] = [0, 10000];

export function ClientsFilter({ partners, feePlans, onFilter }: ClientsFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<ClientFilters>({
    search: "",
    partnerId: undefined,
    feePlanId: undefined,
    balanceRange: DEFAULT_BALANCE_RANGE
  });
  
  // Create debounced filter function
  const debouncedFilter = useCallback(
    debounce((newFilters: ClientFilters) => {
      onFilter(newFilters);
    }, 300),
    [onFilter]
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    debouncedFilter(newFilters);
  };
  
  const handleFilterChange = (key: keyof ClientFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedFilter(newFilters);
  };
  
  const handleBalanceChange = (value: number[]) => {
    const balanceRange: [number, number] = [value[0], value[1]];
    const newFilters = { ...filters, balanceRange };
    setFilters(newFilters);
    debouncedFilter(newFilters);
  };
  
  const clearFilters = () => {
    const newFilters = {
      search: "",
      partnerId: undefined,
      feePlanId: undefined,
      balanceRange: DEFAULT_BALANCE_RANGE,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filtrar Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                className="pl-8"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" /> 
              {showAdvanced ? "Ocultar Filtros" : "Filtros Avançados"}
            </Button>
          </div>
          
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Parceiro</label>
                <Select
                  value={filters.partnerId}
                  onValueChange={(value) => handleFilterChange("partnerId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os parceiros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os parceiros</SelectItem>
                    {partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Plano de Taxas</label>
                <Select
                  value={filters.feePlanId}
                  onValueChange={(value) => handleFilterChange("feePlanId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os planos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os planos</SelectItem>
                    {feePlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Faixa de Saldo: R${filters.balanceRange?.[0]} - R${filters.balanceRange?.[1]}
                </label>
                <Slider 
                  defaultValue={[0, 10000]}
                  min={0}
                  max={10000}
                  step={100}
                  value={filters.balanceRange}
                  onValueChange={handleBalanceChange}
                  className="py-4"
                />
              </div>
              
              <Button variant="outline" onClick={clearFilters} className="md:col-span-3">
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
