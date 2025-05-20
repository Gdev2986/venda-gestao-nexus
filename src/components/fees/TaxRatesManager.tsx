
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

// Payment type constants
const PAYMENT_TYPES = ["PIX", "DÉBITO", "CRÉDITO"];

// Maximum installments based on payment type
const MAX_INSTALLMENTS = {
  PIX: 1,
  DÉBITO: 1,
  CRÉDITO: 21
};

const TaxRatesManager = () => {
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
  
  const handleSave = () => {
    // Validation
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
    
    if (baseRate < 0 || partnerRate < 0 || totalRate < 0) {
      setValidationError("Taxas não podem ser negativas.");
      return;
    }
    
    setValidationError("");
    toast({
      title: "Taxa salva",
      description: `Taxa para ${selectedTab.toUpperCase()} em ${installments}x foi salva com sucesso.`
    });
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
            <Button className="w-full sm:w-auto">Associar Clientes</Button>
            <Button className="w-full sm:w-auto">Adicionar</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
                    {Array.from({ length: MAX_INSTALLMENTS.CRÉDITO }, (_, i) => i + 1).map(num => (
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
