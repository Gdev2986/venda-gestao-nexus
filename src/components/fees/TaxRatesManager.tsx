
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClientSelect, Client } from "@/components/clients/ClientSelect";

// Payment type constants
const PAYMENT_TYPES = ["PIX", "DÉBITO", "CRÉDITO"];

// Maximum installments based on payment type
const MAX_INSTALLMENTS = {
  PIX: 1,
  DÉBITO: 1,
  CRÉDITO: 21
};

// Example tax rates data structure (in production, this would come from Supabase)
interface TaxRate {
  id: string;
  paymentType: string;
  installments: number;
  baseRate: number;
  partnerRate: number;
  totalRate: number;
  clients: string[];
}

const TaxRatesManager = () => {
  // Mock data for client selection demo
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [mockClients, setMockClients] = useState<Client[]>([
    { id: "1", business_name: "Empresa A" },
    { id: "2", business_name: "Empresa B" },
    { id: "3", business_name: "Empresa C" },
    { id: "4", business_name: "Empresa D" },
    { id: "5", business_name: "Empresa E" },
  ]);

  // Track existing tax rates (mock data - would be from Supabase in production)
  const [existingRates, setExistingRates] = useState<TaxRate[]>([]);
  
  const [selectedTab, setSelectedTab] = useState("pix");
  const [baseRate, setBaseRate] = useState(0.99);
  const [partnerRate, setPartnerRate] = useState(1.5);
  const [totalRate, setTotalRate] = useState(1.99);
  const [installments, setInstallments] = useState(1);
  const [validationError, setValidationError] = useState("");
  const { toast } = useToast();
  
  // Reset validation error when tab changes
  useEffect(() => {
    setValidationError("");
    
    // Set installments to 1 when switching to PIX or Debit
    if (selectedTab === "pix" || selectedTab === "debit") {
      setInstallments(1);
    }
  }, [selectedTab]);
  
  // Generate options for installment selection based on payment type
  const getInstallmentOptions = () => {
    const maxInstallments = selectedTab === "credit" 
      ? MAX_INSTALLMENTS.CRÉDITO 
      : MAX_INSTALLMENTS.PIX; // PIX and DÉBITO are both 1
      
    return Array.from({ length: maxInstallments }, (_, i) => i + 1);
  };
  
  // Validate that there are no duplicate installment values for the same payment type
  const validateUniqueInstallments = () => {
    const paymentTypeMap = {
      "pix": "PIX",
      "debit": "DÉBITO",
      "credit": "CRÉDITO"
    };
    
    const currentPaymentType = paymentTypeMap[selectedTab as keyof typeof paymentTypeMap];
    
    const rateWithSameInstallments = existingRates.find(
      rate => rate.paymentType === currentPaymentType && rate.installments === installments
    );
    
    if (rateWithSameInstallments) {
      return `Já existe uma taxa cadastrada para ${currentPaymentType} em ${installments}x.`;
    }
    
    return "";
  };
  
  const handleSave = () => {
    // Validate client selection
    if (selectedClientIds.length === 0) {
      setValidationError("Selecione pelo menos um cliente para associar a este bloco de taxas.");
      return;
    }
    
    // Validate payment type specific rules
    if (selectedTab === "pix" || selectedTab === "debit") {
      if (installments !== 1) {
        setValidationError(`${selectedTab.toUpperCase()} só pode ter 1 parcela.`);
        return;
      }
    } else if (selectedTab === "credit") {
      if (installments < 1 || installments > MAX_INSTALLMENTS.CRÉDITO) {
        setValidationError(`Crédito deve ter entre 1 e ${MAX_INSTALLMENTS.CRÉDITO} parcelas.`);
        return;
      }
    }
    
    // Validate tax rates are not negative
    if (baseRate < 0 || partnerRate < 0 || totalRate < 0) {
      setValidationError("Taxas não podem ser negativas.");
      return;
    }
    
    // Validate unique installments
    const duplicateError = validateUniqueInstallments();
    if (duplicateError) {
      setValidationError(duplicateError);
      return;
    }
    
    // Clear validation errors
    setValidationError("");
    
    // Convert payment type for storage
    const paymentTypeMap = {
      "pix": "PIX",
      "debit": "DÉBITO",
      "credit": "CRÉDITO"
    };
    
    // Mock saving the rate (would be a Supabase insert in production)
    const newRate: TaxRate = {
      id: Date.now().toString(), // Just for mock data
      paymentType: paymentTypeMap[selectedTab as keyof typeof paymentTypeMap],
      installments,
      baseRate,
      partnerRate,
      totalRate,
      clients: [...selectedClientIds]
    };
    
    // Add to existing rates
    setExistingRates([...existingRates, newRate]);
    
    toast({
      title: "Taxa salva",
      description: `Taxa para ${selectedTab.toUpperCase()} em ${installments}x associada a ${selectedClientIds.length} cliente(s) foi salva com sucesso.`
    });
    
    // Reset form
    setSelectedClientIds([]);
  };

  // Only show installment selection for credit
  const showInstallmentSelection = selectedTab === "credit";
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Gerenciar Taxas</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Bloco: Padrão</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button className="w-full sm:w-auto" variant="outline">Adicionar</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <Label>Clientes Associados</Label>
          <ClientSelect
            clients={mockClients}
            selectedClientIds={selectedClientIds}
            onSelectedChange={setSelectedClientIds}
            placeholder="Selecione os clientes para este bloco de taxas..."
          />
          <p className="text-sm text-muted-foreground">
            {selectedClientIds.length} cliente(s) selecionado(s)
          </p>
        </div>
      
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pix">PIX</TabsTrigger>
            <TabsTrigger value="debit">DÉBITO</TabsTrigger>
            <TabsTrigger value="credit">CRÉDITO</TabsTrigger>
          </TabsList>
          
          {validationError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {showInstallmentSelection && (
              <div className="space-y-2">
                <Label>Parcelas</Label>
                <Select 
                  value={String(installments)} 
                  onValueChange={(value) => setInstallments(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o número de parcelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {getInstallmentOptions().map(num => (
                      <SelectItem key={num} value={String(num)}>{num}x</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Taxa Base (%) <span className="font-bold">{baseRate.toFixed(2)}%</span></Label>
                <Slider 
                  defaultValue={[baseRate]} 
                  max={5} 
                  step={0.01} 
                  onValueChange={(value) => setBaseRate(value[0])}
                />
                <Input 
                  type="number" 
                  value={baseRate} 
                  onChange={(e) => setBaseRate(parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  max={5}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Parceiro (%) <span className="font-bold">{partnerRate.toFixed(2)}%</span></Label>
                <Slider 
                  defaultValue={[partnerRate]} 
                  max={5} 
                  step={0.01}
                  onValueChange={(value) => setPartnerRate(value[0])}
                />
                <Input 
                  type="number" 
                  value={partnerRate} 
                  onChange={(e) => setPartnerRate(parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  max={5}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Final <span className="font-bold">{totalRate.toFixed(2)}%</span></Label>
                <Slider 
                  defaultValue={[totalRate]} 
                  max={10} 
                  step={0.01}
                  onValueChange={(value) => setTotalRate(value[0])} 
                />
                <Input 
                  type="number" 
                  value={totalRate} 
                  onChange={(e) => setTotalRate(parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  max={10}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleSave}>
                Salvar Taxa
              </Button>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxRatesManager;
