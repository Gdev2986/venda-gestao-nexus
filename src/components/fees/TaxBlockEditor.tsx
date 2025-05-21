
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethod } from "@/types/enums";
import { BlockWithRates, TaxRate } from "@/services/tax-blocks.service";

type TaxBlockEditorProps = {
  block?: BlockWithRates;
  onSave: (block: BlockWithRates) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const TaxBlockEditor = ({ block, onSave, onCancel, onDelete }: TaxBlockEditorProps) => {
  const [name, setName] = useState(block?.name || "");
  const [description, setDescription] = useState(block?.description || "");
  const [activeTab, setActiveTab] = useState<PaymentMethod>(PaymentMethod.CREDIT);
  const [selectedInstallment, setSelectedInstallment] = useState(1);
  
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

  const handleSave = () => {
    if (name.trim() === "") return;
    
    // Flatten tax rates from all payment methods
    const allRates: TaxRate[] = [
      ...(taxRates[PaymentMethod.CREDIT] || []),
      ...(taxRates[PaymentMethod.DEBIT] || []),
      ...(taxRates[PaymentMethod.PIX] || [])
    ];
    
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
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="block-description">Descrição</Label>
          <Textarea
            id="block-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as PaymentMethod);
        setSelectedInstallment(1); // Reset to first installment when switching tabs
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
                onValueChange={value => setSelectedInstallment(parseInt(value))}
                disabled={method !== PaymentMethod.CREDIT}
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
                />
                <Input
                  type="number"
                  value={currentRates.root_rate}
                  onChange={(e) => updateRate('root_rate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
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
                />
                <Input
                  type="number"
                  value={currentRates.forwarding_rate}
                  onChange={(e) => updateRate('forwarding_rate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
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
                />
                <Input
                  type="number"
                  value={currentRates.final_rate}
                  onChange={(e) => updateRate('final_rate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
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
          <Button variant="destructive" onClick={onDelete}>
            Excluir Bloco
          </Button>
        )}
        <div className="flex-1"></div>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default TaxBlockEditor;
