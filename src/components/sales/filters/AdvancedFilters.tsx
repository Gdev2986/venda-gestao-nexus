import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SalesFilterParams } from "@/types";

interface AdvancedFiltersProps {
  filters: SalesFilterParams;
  onFilterChange: (key: keyof SalesFilterParams, value: any) => void;
}

// Constants
const INSTALLMENTS = [
  { value: "1", label: "À vista (1x)" },
  { value: "2-6", label: "2 a 6 vezes" },
  { value: "7-12", label: "7 a 12 vezes" }
];

const AdvancedFilters = ({ filters, onFilterChange }: AdvancedFiltersProps) => {
  // Use the filters directly instead of local state to avoid unnecessary re-renders
  const amountRange: [number, number] = [
    filters.minAmount || 0, 
    filters.maxAmount || 2000
  ];
  
  const handleAmountRangeChange = (values: number[]) => {
    onFilterChange("minAmount", values[0]);
    onFilterChange("maxAmount", values[1]);
  };

  return (
    <div className="pt-4 border-t">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Amount Range Filter */}
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <Label>Valor</Label>
            <span className="text-sm text-muted-foreground">
              R$ {amountRange[0]} - R$ {amountRange[1]}
            </span>
          </div>
          <Slider
            value={amountRange}
            max={2000} 
            step={50}
            onValueChange={handleAmountRangeChange}
            className="mt-6"
          />
        </div>
        
        {/* Installments Filter */}
        <div className="w-full sm:w-1/3">
          <Label htmlFor="installments" className="mb-1 block">Parcelas</Label>
          <Select
            value={filters.installments || ""}
            onValueChange={(value) => onFilterChange("installments", value || undefined)}
          >
            <SelectTrigger id="installments">
              <SelectValue placeholder="Qualquer parcela" />
            </SelectTrigger>
            <SelectContent>
                                <SelectItem value="any">Qualquer parcela</SelectItem>
              {INSTALLMENTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
