
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethod } from "@/types/enums";

type TaxRate = {
  installment: number;
  rootRate: number;      // Taxa raiz cobrada pela empresa de adquirência
  forwardingRate: number; // Taxa de repasse para o parceiro
  finalRate: number;     // Taxa final cobrada do cliente
};

type TaxRatesByMethod = {
  [key in PaymentMethod]: TaxRate[];
};

type TaxBlockEditorProps = {
  block?: { id: string; name: string; description: string };
  onSave: (block: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const TaxBlockEditor = ({ block, onSave, onCancel, onDelete }: TaxBlockEditorProps) => {
  const [name, setName] = useState(block?.name || "");
  const [description, setDescription] = useState(block?.description || "");
  const [activeTab, setActiveTab] = useState<PaymentMethod>(PaymentMethod.CREDIT);
  const [selectedInstallment, setSelectedInstallment] = useState(1);
  
  // Initialize tax rates with default values
  const [taxRates, setTaxRates] = useState<TaxRatesByMethod>({
    [PaymentMethod.CREDIT]: Array.from({ length: 21 }, (_, i) => ({
      installment: i + 1,
      rootRate: 1.99 + (i * 0.3),
      forwardingRate: 2.49 + (i * 0.4),
      finalRate: 2.99 + (i * 0.5),
    })),
    [PaymentMethod.DEBIT]: [{
      installment: 1,
      rootRate: 0.99,
      forwardingRate: 1.29,
      finalRate: 1.49,
    }],
    [PaymentMethod.PIX]: [{
      installment: 1,
      rootRate: 0.59,
      forwardingRate: 0.79,
      finalRate: 0.99,
    }]
  });

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
    const ratesForMethod = taxRates[activeTab];
    return ratesForMethod.find(r => r.installment === selectedInstallment) || {
      installment: selectedInstallment,
      rootRate: 0,
      forwardingRate: 0,
      finalRate: 0,
    };
  };
  
  const currentRates = getCurrentRates();
  
  // Update a specific rate
  const updateRate = (rateType: 'rootRate' | 'forwardingRate' | 'finalRate', value: number) => {
    const updatedRates = { ...taxRates };
    const index = updatedRates[activeTab].findIndex(r => r.installment === selectedInstallment);
    
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
    const officeCommission = currentRates.forwardingRate - currentRates.rootRate;
    const partnerCommission = currentRates.finalRate - currentRates.forwardingRate;
    
    return {
      officeCommission: officeCommission.toFixed(2),
      partnerCommission: partnerCommission.toFixed(2)
    };
  };

  const commissions = calculateCommissions();

  const handleSave = () => {
    if (name.trim() === "") return;
    
    onSave({
      id: block?.id || "",
      name,
      description,
      taxRates,
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
                  <span className="font-bold">{currentRates.rootRate.toFixed(2)}%</span>
                  <span className="text-sm">10%</span>
                </div>
                <Slider
                  value={[currentRates.rootRate]}
                  min={0}
                  max={10}
                  step={0.01}
                  onValueChange={([value]) => updateRate('rootRate', value)}
                />
                <Input
                  type="number"
                  value={currentRates.rootRate}
                  onChange={(e) => updateRate('rootRate', parseFloat(e.target.value) || 0)}
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
                  <span className="font-bold">{currentRates.forwardingRate.toFixed(2)}%</span>
                  <span className="text-sm">15%</span>
                </div>
                <Slider
                  value={[currentRates.forwardingRate]}
                  min={0}
                  max={15}
                  step={0.01}
                  onValueChange={([value]) => updateRate('forwardingRate', value)}
                />
                <Input
                  type="number"
                  value={currentRates.forwardingRate}
                  onChange={(e) => updateRate('forwardingRate', parseFloat(e.target.value) || 0)}
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
                  <span className="font-bold">{currentRates.finalRate.toFixed(2)}%</span>
                  <span className="text-sm">20%</span>
                </div>
                <Slider
                  value={[currentRates.finalRate]}
                  min={0}
                  max={20}
                  step={0.01}
                  onValueChange={([value]) => updateRate('finalRate', value)}
                />
                <Input
                  type="number"
                  value={currentRates.finalRate}
                  onChange={(e) => updateRate('finalRate', parseFloat(e.target.value) || 0)}
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
