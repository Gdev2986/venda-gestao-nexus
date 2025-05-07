
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PaymentMethod, SalesFilterParams } from "@/types";

interface BasicFiltersProps {
  filters: SalesFilterParams;
  onFilterChange: (key: keyof SalesFilterParams, value: any) => void;
}

// Constants
const PAYMENT_METHODS = [
  { value: PaymentMethod.CREDIT, label: "Crédito" },
  { value: PaymentMethod.DEBIT, label: "Débito" },
  { value: PaymentMethod.PIX, label: "Pix" }
];

const TERMINALS = [
  "T100", "T101", "T102", "T103", "T104", "T105"
];

const HOUR_RANGES = [
  { value: [0, 23], label: "Qualquer horário" },
  { value: [9, 12], label: "Manhã (9h-12h)" },
  { value: [13, 17], label: "Tarde (13h-17h)" },
  { value: [18, 22], label: "Noite (18h-22h)" }
];

const BasicFilters = ({ filters, onFilterChange }: BasicFiltersProps) => {
  const handleHourRangeChange = (rangeString: string) => {
    if (!rangeString) {
      onFilterChange("startHour", undefined);
      onFilterChange("endHour", undefined);
      return;
    }
    
    const selectedRange = HOUR_RANGES.find(hr => hr.value.join('-') === rangeString);
    if (selectedRange) {
      onFilterChange("startHour", selectedRange.value[0]);
      onFilterChange("endHour", selectedRange.value[1]);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Payment Method Filter */}
      <div className="w-full sm:w-1/3">
        <Label htmlFor="paymentMethod" className="mb-1 block">Forma de Pagamento</Label>
        <Select
          value={filters.paymentMethod || ""}
          onValueChange={(value) => onFilterChange("paymentMethod", value || undefined)}
        >
          <SelectTrigger id="paymentMethod">
            <SelectValue placeholder="Qualquer método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer método</SelectItem>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Terminal Filter */}
      <div className="w-full sm:w-1/3">
        <Label htmlFor="terminal" className="mb-1 block">Terminal</Label>
        <Select
          value={filters.terminal || ""}
          onValueChange={(value) => onFilterChange("terminal", value || undefined)}
        >
          <SelectTrigger id="terminal">
            <SelectValue placeholder="Qualquer terminal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer terminal</SelectItem>
            {TERMINALS.map((terminal) => (
              <SelectItem key={terminal} value={terminal}>
                {terminal}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Hours Filter */}
      <div className="w-full sm:w-1/3">
        <Label htmlFor="hourRange" className="mb-1 block">Horário</Label>
        <Select
          value={filters.startHour !== undefined ? `${filters.startHour}-${filters.endHour}` : ""}
          onValueChange={handleHourRangeChange}
        >
          <SelectTrigger id="hourRange">
            <SelectValue placeholder="Qualquer horário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer horário</SelectItem>
            {HOUR_RANGES.map((range, index) => (
              <SelectItem key={index} value={range.value.join('-')}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicFilters;
