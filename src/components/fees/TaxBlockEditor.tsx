
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { PaymentMethod } from "@/types/enums";
import { BlockWithRates, TaxRate } from "@/services/tax-blocks.service";

type TaxBlockEditorProps = {
  block?: BlockWithRates;
  onSave: (block: BlockWithRates) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
};

const TaxBlockEditor = ({ 
  block, 
  onSave, 
  onCancel, 
  onDelete,
  isSubmitting = false 
}: TaxBlockEditorProps) => {
  const [name, setName] = useState(block?.name || "");
  const [description, setDescription] = useState(block?.description || "");
  const [activeTab, setActiveTab] = useState<PaymentMethod>(PaymentMethod.CREDIT);
  const [selectedInstallment, setSelectedInstallment] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Initialize tax rates with default values or existing values
  const [taxRates, setTaxRates] = useState<Record<string, TaxRate[]>>({
    [PaymentMethod.CREDIT]: Array.from({ length: 21 }, (_, i) => ({
      id: "",
      block_id: block?.id || "",
      payment_method: PaymentMethod.CREDIT,
      installment: i + 1,
      root_rate: 1.99 + (i * 0.3),
      forwarding_rate: 2.49 + (i * 0.4),
      final_rate: 2.99 + (i * 0.5),
    })),
    [PaymentMethod.DEBIT]: [{
      id: "",
      block_id: block?.id || "",
      payment_method: PaymentMethod.DEBIT,
      installment: 1,
      root_rate: 0.99,
      forwarding_rate: 1.29,
      final_rate: 1.49,
    }],
    [PaymentMethod.PIX]: [{
      id: "",
      block_id: block?.id || "",
      payment_method: PaymentMethod.PIX,
      installment: 1,
      root_rate: 0.59,
      forwarding_rate: 0.79,
      final_rate: 0.99,
    }]
  });

  // Load existing rates if block is provided
  useEffect(() => {
    if (block?.rates && block.rates.length > 0) {
      const ratesByMethod: Record<string, TaxRate[]> = {
        [PaymentMethod.CREDIT]: [],
        [PaymentMethod.DEBIT]: [],
        [PaymentMethod.PIX]: []
      };
      
      // Group rates by payment method
      block.rates.forEach(rate => {
        const method = rate.payment_method;
        if (!ratesByMethod[method]) {
          ratesByMethod[method] = [];
        }
        ratesByMethod[method].push(rate);
      });
      
      // Ensure we have all credit installments (1-21)
      if (ratesByMethod[PaymentMethod.CREDIT]) {
        // Fill in any missing installments with default values
        const creditRates = Array.from({ length: 21 }, (_, i) => {
          const installment = i + 1;
          const existingRate = ratesByMethod[PaymentMethod.CREDIT].find(r => r.installment === installment);
          
          return existingRate || {
            id: "",
            block_id: block.id,
            payment_method: PaymentMethod.CREDIT,
            installment,
            root_rate: 1.99 + (i * 0.3),
            forwarding_rate: 2.49 + (i * 0.4),
            final_rate: 2.99 + (i * 0.5),
          };
        });
        
        ratesByMethod[PaymentMethod.CREDIT] = creditRates;
      }
      
      // Ensure we have debit and PIX single installment rates
      if (!ratesByMethod[PaymentMethod.DEBIT]?.length) {
        ratesByMethod[PaymentMethod.DEBIT] = [{
          id: "",
          block_id: block.id,
          payment_method: PaymentMethod.DEBIT,
          installment: 1,
          root_rate: 0.99,
          forwarding_rate: 1.29,
          final_rate: 1.49,
        }];
      }
      
      if (!ratesByMethod[PaymentMethod.PIX]?.length) {
        ratesByMethod[PaymentMethod.PIX] = [{
          id: "",
          block_id: block.id,
          payment_method: PaymentMethod.PIX,
          installment: 1,
          root_rate: 0.59,
          forwarding_rate: 0.79,
          final_rate: 0.99,
        }];
      }
      
      console.log("Setting tax rates:", ratesByMethod);
      setTaxRates(ratesByMethod);
    }
  }, [block]);

  // Get available installments for the active payment method
  const getInstallmentsForMethod = (method: PaymentMethod): number[] => {
    switch (method) {
      case PaymentMethod.CREDIT:
        return Array.from({ length: 21 }, (_, i) => i + 1);
      case PaymentMethod.DEBIT:
      case PaymentMethod.PIX:
      default:
        return [1];
    }
  };
  
  // Get current rates based on selected tab and installment
  const getCurrentRates = () => {
    const ratesForMethod = taxRates[activeTab] || [];
    return ratesForMethod.find(r => r.installment === selectedInstallment) || {
      id: "",
      block_id: block?.id || "",
      payment_method: activeTab,
      installment: selectedInstallment,
      root_rate: 0,
      forwarding_rate: 0,
      final_rate: 0,
    };
  };
  
  const currentRates = getCurrentRates();
  
  // Update a specific rate
  const updateRate = (rateType: 'root_rate' | 'forwarding_rate' | 'final_rate', value: number) => {
    setValidationError(null);
    
    if (isNaN(value)) {
      setValidationError("O valor da taxa deve ser um número");
      return;
    }
    
    if (value < 0) {
      setValidationError("O valor da taxa não pode ser negativo");
      return;
    }
    
    // Validate rate hierarchy
    if (rateType === 'root_rate' && value > currentRates.forwarding_rate) {
      setValidationError("Taxa raiz não pode ser maior que a taxa de repasse");
      return;
    }
    
    if (rateType === 'forwarding_rate') {
      if (value < currentRates.root_rate) {
        setValidationError("Taxa de repasse não pode ser menor que a taxa raiz");
        return;
      }
      if (value > currentRates.final_rate) {
        setValidationError("Taxa de repasse não pode ser maior que a taxa final");
        return;
      }
    }
    
    if (rateType === 'final_rate' && value < currentRates.forwarding_rate) {
      setValidationError("Taxa final não pode ser menor que a taxa de repasse");
      return;
    }
    
    const updatedRates = { ...taxRates };
    const methodRates = updatedRates[activeTab] || [];
    const index = methodRates.findIndex(r => r.installment === selectedInstallment);
    
    if (index !== -1) {
      updatedRates[activeTab][index] = {
        ...updatedRates[activeTab][index],
        [rateType]: value
      };
      setTaxRates(updatedRates);
    }
  };

  // Calculate commissions based on rates
  const calculateCommissions = () => {
    const officeCommission = currentRates.forwarding_rate - currentRates.root_rate;
    const partnerCommission = currentRates.final_rate - currentRates.forwarding_rate;
    
    return {
      officeCommission: officeCommission.toFixed(2),
      partnerCommission: partnerCommission.toFixed(2)
    };
  };

  const commissions = calculateCommissions();

  const validateForm = (): boolean => {
    if (name.trim() === "") {
      setValidationError("O nome do bloco é obrigatório");
      return false;
    }
    
    // Check for any issues with the rate hierarchy
    for (const method in taxRates) {
      for (const rate of taxRates[method]) {
        if (rate.root_rate > rate.forwarding_rate) {
          setValidationError(`Taxa raiz maior que taxa de repasse em ${method} ${rate.installment}x`);
          return false;
        }
        if (rate.forwarding_rate > rate.final_rate) {
          setValidationError(`Taxa de repasse maior que taxa final em ${method} ${rate.installment}x`);
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Flatten tax rates from all payment methods
    const allRates: TaxRate[] = [
      ...(taxRates[PaymentMethod.CREDIT] || []),
      ...(taxRates[PaymentMethod.DEBIT] || []),
      ...(taxRates[PaymentMethod.PIX] || [])
    ];
    
    console.log("Saving block with rates:", allRates);
    
    onSave({
      id: block?.id || "",
      name,
      description,
      rates: allRates,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="block-name">Nome do Bloco</Label>
          <Input
            id="block-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setValidationError(null);
            }}
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="block-description">Descrição</Label>
          <Textarea
            id="block-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as PaymentMethod);
        setSelectedInstallment(1); // Reset to first installment when switching tabs
        setValidationError(null);
      }}>
        <TabsList className="mb-4">
          <TabsTrigger value={PaymentMethod.CREDIT}>Crédito</TabsTrigger>
          <TabsTrigger value={PaymentMethod.DEBIT}>Débito</TabsTrigger>
          <TabsTrigger value={PaymentMethod.PIX}>PIX</TabsTrigger>
        </TabsList>
        
        {[PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.PIX].map(method => (
          <TabsContent key={method} value={method} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label className="min-w-28">Parcelas:</Label>
              <Select 
                value={selectedInstallment.toString()} 
                onValueChange={value => {
                  setSelectedInstallment(parseInt(value));
                  setValidationError(null);
                }}
                disabled={method !== PaymentMethod.CREDIT || isSubmitting}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getInstallmentsForMethod(method as PaymentMethod).map(i => (
                    <SelectItem key={i} value={i.toString()}>
                      {i}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <Label>Taxa Raiz (%)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">0%</span>
                  <span className="font-bold">{currentRates.root_rate.toFixed(2)}%</span>
                  <span className="text-sm">10%</span>
                </div>
                <Slider
                  value={[currentRates.root_rate]}
                  min={0}
                  max={10}
                  step={0.01}
                  onValueChange={([value]) => updateRate('root_rate', value)}
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  value={currentRates.root_rate}
                  onChange={(e) => updateRate('root_rate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Custo base cobrado pela processadora
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Taxa de Repasse (%)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">0%</span>
                  <span className="font-bold">{currentRates.forwarding_rate.toFixed(2)}%</span>
                  <span className="text-sm">15%</span>
                </div>
                <Slider
                  value={[currentRates.forwarding_rate]}
                  min={0}
                  max={15}
                  step={0.01}
                  onValueChange={([value]) => updateRate('forwarding_rate', value)}
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  value={currentRates.forwarding_rate}
                  onChange={(e) => updateRate('forwarding_rate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Taxa repassada ao parceiro (comissão escritório: {commissions.officeCommission}%)
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Taxa Final (%)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">0%</span>
                  <span className="font-bold">{currentRates.final_rate.toFixed(2)}%</span>
                  <span className="text-sm">20%</span>
                </div>
                <Slider
                  value={[currentRates.final_rate]}
                  min={0}
                  max={20}
                  step={0.01}
                  onValueChange={([value]) => updateRate('final_rate', value)}
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  value={currentRates.final_rate}
                  onChange={(e) => updateRate('final_rate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Taxa cobrada do cliente final (comissão parceiro: {commissions.partnerCommission}%)
                </p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-4">
        {onDelete && (
          <Button 
            variant="destructive" 
            onClick={onDelete} 
            disabled={isSubmitting}
          >
            {deleteButtonContent()}
          </Button>
        )}
        <div className="flex-1"></div>
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSubmitting}
        >
          {saveButtonContent()}
        </Button>
      </div>
    </div>
  );

  function saveButtonContent() {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvando...
        </>
      );
    }
    return "Salvar";
  }

  function deleteButtonContent() {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Excluindo...
        </>
      );
    }
    return "Excluir Bloco";
  }
};

export default TaxBlockEditor;
