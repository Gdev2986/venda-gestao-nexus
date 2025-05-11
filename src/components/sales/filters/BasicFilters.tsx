
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SalesFilterParams } from "@/types";
import { Label } from "@/components/ui/label";

interface BasicFiltersProps {
  filters: SalesFilterParams;
  onFilterChange: (key: keyof SalesFilterParams, value: any) => void;
}

const BasicFilters = ({ filters, onFilterChange }: BasicFiltersProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {/* Terminal Filter */}
      <div className="space-y-2">
        <Label htmlFor="terminal-filter">Terminal</Label>
        <Select
          value={filters.terminal || ""}
          onValueChange={(value) => onFilterChange('terminal', value)}
        >
          <SelectTrigger id="terminal-filter">
            <SelectValue placeholder="Todos os terminais" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os terminais</SelectItem>
            <SelectItem value="POS-001">POS-001</SelectItem>
            <SelectItem value="POS-002">POS-002</SelectItem>
            <SelectItem value="POS-003">POS-003</SelectItem>
            <SelectItem value="MOBILE-001">MOBILE-001</SelectItem>
            <SelectItem value="MOBILE-002">MOBILE-002</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Method Filter */}
      <div className="space-y-2">
        <Label htmlFor="payment-method-filter">Método de Pagamento</Label>
        <Select
          value={filters.paymentMethod || ""}
          onValueChange={(value) => onFilterChange('paymentMethod', value)}
        >
          <SelectTrigger id="payment-method-filter">
            <SelectValue placeholder="Todos os métodos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os métodos</SelectItem>
            <SelectItem value="credit">Crédito</SelectItem>
            <SelectItem value="debit">Débito</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicFilters;
