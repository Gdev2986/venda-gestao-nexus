
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateRangeFilter, { DateRange } from "@/components/dashboard/client/DateRangeFilter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface SalesAdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const TERMINALS = [
  "POS001",
  "POS002",
  "POS003",
  "POS004",
  "POS005",
  "POS006",
  "POS007",
  "POS008",
  "POS009",
  "POS010",
];

const INSTALLMENTS = ["1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x", "11x", "12x"];

const SalesAdvancedFilters = ({ onFilterChange, dateRange, onDateRangeChange }: SalesAdvancedFiltersProps) => {
  const [terminal, setTerminal] = useState<string | undefined>(undefined);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [installments, setInstallments] = useState<string | undefined>(undefined);
  const [amountRange, setAmountRange] = useState<{ min?: number; max?: number }>({});
  const [sliderValues, setSliderValues] = useState([0, 10000]);

  // Checkbox state for payment methods
  const [creditChecked, setCreditChecked] = useState(false);
  const [debitChecked, setDebitChecked] = useState(false);
  const [pixChecked, setPixChecked] = useState(false);

  // Effect to update payment methods array when checkboxes change
  useEffect(() => {
    const methods: PaymentMethod[] = [];
    if (creditChecked) methods.push(PaymentMethod.CREDIT);
    if (debitChecked) methods.push(PaymentMethod.DEBIT);
    if (pixChecked) methods.push(PaymentMethod.PIX);
    setSelectedPaymentMethods(methods);
  }, [creditChecked, debitChecked, pixChecked]);

  // Handle slider change for amount range
  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    setAmountRange({
      min: values[0] === 0 ? undefined : values[0],
      max: values[1] === 10000 ? undefined : values[1]
    });
  };

  // Handle filter application
  const handleApplyFilters = () => {
    onFilterChange({
      dateRange,
      terminal,
      paymentMethods: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
      installments,
      amountRange: (amountRange.min !== undefined || amountRange.max !== undefined) 
        ? amountRange 
        : undefined,
    });
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setTerminal(undefined);
    setCreditChecked(false);
    setDebitChecked(false);
    setPixChecked(false);
    setInstallments(undefined);
    setSliderValues([0, 10000]);
    setAmountRange({});
    
    // Reset date range to last 7 days
    onDateRangeChange({
      from: new Date(new Date().setDate(new Date().getDate() - 7)),
      to: new Date(new Date().setDate(new Date().getDate() - 1)),
    });
    
    // Apply reset filters
    onFilterChange({
      dateRange: {
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date(new Date().setDate(new Date().getDate() - 1)),
      }
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Filtros Avançados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Período</Label>
          <div className="mt-2">
            <DateRangeFilter 
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </div>
        
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="terminal">
            <AccordionTrigger className="py-2">Terminal</AccordionTrigger>
            <AccordionContent>
              <Select value={terminal} onValueChange={setTerminal}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um terminal" />
                </SelectTrigger>
                <SelectContent>
                  {TERMINALS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="payment">
            <AccordionTrigger className="py-2">Tipo de Pagamento</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="credit"
                    checked={creditChecked}
                    onCheckedChange={(checked) => setCreditChecked(checked === true)}
                  />
                  <Label htmlFor="credit">Crédito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="debit"
                    checked={debitChecked}
                    onCheckedChange={(checked) => setDebitChecked(checked === true)}
                  />
                  <Label htmlFor="debit">Débito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pix"
                    checked={pixChecked}
                    onCheckedChange={(checked) => setPixChecked(checked === true)}
                  />
                  <Label htmlFor="pix">PIX</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="installments">
            <AccordionTrigger className="py-2">Parcelas</AccordionTrigger>
            <AccordionContent>
              <Select value={installments} onValueChange={setInstallments}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o número de parcelas" />
                </SelectTrigger>
                <SelectContent>
                  {INSTALLMENTS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="amount">
            <AccordionTrigger className="py-2">Faixa de Valor</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider 
                  value={sliderValues} 
                  min={0} 
                  max={10000} 
                  step={100}
                  onValueChange={handleSliderChange}
                />
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Valor Mínimo</Label>
                    <Input 
                      type="number" 
                      value={sliderValues[0] === 0 ? "" : sliderValues[0]}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                        setSliderValues([val, sliderValues[1]]);
                        setAmountRange({...amountRange, min: val === 0 ? undefined : val});
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Valor Máximo</Label>
                    <Input 
                      type="number"
                      value={sliderValues[1] === 10000 ? "" : sliderValues[1]}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 10000 : Number(e.target.value);
                        setSliderValues([sliderValues[0], val]);
                        setAmountRange({...amountRange, max: val === 10000 ? undefined : val});
                      }}
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-between pt-2">
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
          >
            Limpar Filtros
          </Button>
          <Button 
            onClick={handleApplyFilters}
          >
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesAdvancedFilters;
