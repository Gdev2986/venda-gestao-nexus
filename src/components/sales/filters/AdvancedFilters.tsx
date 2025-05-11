
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SalesFilterParams } from "@/types";

interface AdvancedFiltersProps {
  filters: SalesFilterParams;
  onFilterChange: (key: keyof SalesFilterParams, value: any) => void;
}

const AdvancedFilters = ({ filters, onFilterChange }: AdvancedFiltersProps) => {
  const handleValueChange = (key: keyof SalesFilterParams, value: any) => {
    onFilterChange(key, value);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Filtros avançados</h4>
      
      {/* Amount Range */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="amount-range">Valor da transação</Label>
          <span className="text-xs text-muted-foreground">
            R$ {filters.minAmount || 0} - R$ {filters.maxAmount || 5000}
          </span>
        </div>
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minAmount || ""}
            onChange={(e) => handleValueChange('minAmount', Number(e.target.value))}
            className="w-24"
          />
          <Slider
            id="amount-range"
            defaultValue={[filters.minAmount || 0, filters.maxAmount || 5000]}
            max={10000}
            step={100}
            onValueChange={(values) => {
              handleValueChange('minAmount', values[0]);
              handleValueChange('maxAmount', values[1]);
            }}
            className="flex-1 mx-2"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxAmount || ""}
            onChange={(e) => handleValueChange('maxAmount', Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-hour">Hora inicial</Label>
          <Select
            value={String(filters.startHour || "")}
            onValueChange={(value) => handleValueChange('startHour', Number(value))}
          >
            <SelectTrigger id="start-hour">
              <SelectValue placeholder="Qualquer hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer hora</SelectItem>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={`start-${i}`} value={String(i)}>
                  {String(i).padStart(2, '0')}:00
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-hour">Hora final</Label>
          <Select
            value={String(filters.endHour || "")}
            onValueChange={(value) => handleValueChange('endHour', Number(value))}
          >
            <SelectTrigger id="end-hour">
              <SelectValue placeholder="Qualquer hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer hora</SelectItem>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={`end-${i}`} value={String(i)}>
                  {String(i).padStart(2, '0')}:00
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Installments */}
      <div className="space-y-2">
        <Label htmlFor="installments">Parcelas</Label>
        <Select
          value={filters.installments || ""}
          onValueChange={(value) => handleValueChange('installments', value)}
        >
          <SelectTrigger id="installments">
            <SelectValue placeholder="Qualquer parcela" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer parcela</SelectItem>
            <SelectItem value="1">À vista</SelectItem>
            <SelectItem value="2-6">2 a 6 parcelas</SelectItem>
            <SelectItem value="7-12">7 a 12 parcelas</SelectItem>
            <SelectItem value="13+">13+ parcelas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdvancedFilters;
