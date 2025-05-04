
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Partner, ClientStatus } from "@/types";
import { Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ClientFiltersProps {
  onFilterChange: (filters: ClientFiltersValues) => void;
  partners: Partner[];
  feeGroups?: { id: string; name: string }[];
  className?: string;
}

interface ClientFiltersValues {
  partner_id?: string;
  fee_group_id?: string;
  status?: ClientStatus;
  balance_min?: number;
  balance_max?: number;
}

const ClientFilters = ({ onFilterChange, partners, feeGroups = [], className }: ClientFiltersProps) => {
  const [filters, setFilters] = useState<ClientFiltersValues>({});
  const [minBalance, setMinBalance] = useState<string>("");
  const [maxBalance, setMaxBalance] = useState<string>("");
  
  // Initialize demo fee groups if none provided
  const availableFeeGroups = feeGroups.length > 0 ? feeGroups : [
    { id: "1", name: "Padrão" },
    { id: "2", name: "Premium" },
    { id: "3", name: "Corporate" }
  ];
  
  // When filters change, notify parent component
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  const handlePartnerChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      partner_id: value === "all" ? undefined : value 
    }));
  };
  
  const handleFeeGroupChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      fee_group_id: value === "all" ? undefined : value 
    }));
  };
  
  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: value === "all" ? undefined : value as ClientStatus 
    }));
  };
  
  const handleMinBalanceChange = (value: string) => {
    setMinBalance(value);
    
    // Convert to cents for storage (currency in cents)
    const balanceInCents = value ? parseFloat(value) * 100 : undefined;
    setFilters(prev => ({ 
      ...prev, 
      balance_min: isNaN(balanceInCents as number) ? undefined : balanceInCents 
    }));
  };
  
  const handleMaxBalanceChange = (value: string) => {
    setMaxBalance(value);
    
    // Convert to cents for storage (currency in cents)
    const balanceInCents = value ? parseFloat(value) * 100 : undefined;
    setFilters(prev => ({ 
      ...prev, 
      balance_max: isNaN(balanceInCents as number) ? undefined : balanceInCents
    }));
  };
  
  const handleReset = () => {
    setFilters({});
    setMinBalance("");
    setMaxBalance("");
  };

  return (
    <div className={cn("bg-muted/20 rounded-lg p-4 space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Partner Filter */}
        <div className="space-y-2">
          <Label htmlFor="partner-filter">Parceiro</Label>
          <Select 
            value={filters.partner_id || "all"} 
            onValueChange={handlePartnerChange}
          >
            <SelectTrigger id="partner-filter">
              <SelectValue placeholder="Todos os parceiros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os parceiros</SelectItem>
              {partners.map(partner => (
                <SelectItem key={partner.id} value={partner.id}>
                  {partner.company_name || partner.business_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Fee Group Filter */}
        <div className="space-y-2">
          <Label htmlFor="fee-group-filter">Bloco de Taxas</Label>
          <Select 
            value={filters.fee_group_id || "all"} 
            onValueChange={handleFeeGroupChange}
          >
            <SelectTrigger id="fee-group-filter">
              <SelectValue placeholder="Todos os blocos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os blocos</SelectItem>
              {availableFeeGroups.map(group => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select 
            value={filters.status || "all"} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value={ClientStatus.ACTIVE}>Ativo</SelectItem>
              <SelectItem value={ClientStatus.BLOCKED}>Bloqueado</SelectItem>
              <SelectItem value={ClientStatus.PENDING}>Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Balance Range Filter */}
        <div className="space-y-2">
          <Label>Saldo Mínimo</Label>
          <div className="relative">
            <Wallet className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="R$ 0,00"
              className="pl-9"
              value={minBalance}
              onChange={(e) => handleMinBalanceChange(e.target.value)}
              step="0.01"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Saldo Máximo</Label>
          <div className="relative">
            <Wallet className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="R$ 0,00"
              className="pl-9"
              value={maxBalance}
              onChange={(e) => handleMaxBalanceChange(e.target.value)}
              step="0.01"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end">
        <Button variant="ghost" onClick={handleReset}>Limpar Filtros</Button>
      </div>
    </div>
  );
};

export default ClientFilters;
