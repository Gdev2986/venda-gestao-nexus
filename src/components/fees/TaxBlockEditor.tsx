
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
  baseRate: number;
  partnerRate: number;
  totalRate: number;
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
      baseRate: 2.99 + (i * 0.5),
      partnerRate: 1.5 + (i * 0.2),
      totalRate: 3.99 + (i * 0.7),
    })),
    [PaymentMethod.DEBIT]: [{
      installment: 1,
      baseRate: 1.49,
      partnerRate: 0.75,
      totalRate: 1.99,
    }],
    [PaymentMethod.PIX]: [{
      installment: 1,
      baseRate: 0.99,
      partnerRate: 0.5,
      totalRate: 1.29,
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
      baseRate: 0,
      partnerRate: 0,
      totalRate: 0,
    };
  };
  
  const currentRates = getCurrentRates();
  
  // Update a specific rate
  const updateRate = (rateType: 'baseRate' | 'partnerRate' | 'totalRate', value: number) => {
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
                <Label>Taxa Base (%)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">0%</span>
                  <span className="font-bold">{currentRates.baseRate.toFixed(2)}%</span>
                  <span className="text-sm">10%</span>
                </div>
                <Slider
                  value={[currentRates.baseRate]}
                  min={0}
                  max={10}
                  step={0.01}
                  onValueChange={([value]) => updateRate('baseRate', value)}
                />
                <Input
                  type="number"
                  value={currentRates.baseRate}
                  onChange={(e) => updateRate('baseRate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Taxa Parceiro (%)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">0%</span>
                  <span className="font-bold">{currentRates.partnerRate.toFixed(2)}%</span>
                  <span className="text-sm">10%</span>
                </div>
                <Slider
                  value={[currentRates.partnerRate]}
                  min={0}
                  max={10}
                  step={0.01}
                  onValueChange={([value]) => updateRate('partnerRate', value)}
                />
                <Input
                  type="number"
                  value={currentRates.partnerRate}
                  onChange={(e) => updateRate('partnerRate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Taxa Total (%)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">0%</span>
                  <span className="font-bold">{currentRates.totalRate.toFixed(2)}%</span>
                  <span className="text-sm">15%</span>
                </div>
                <Slider
                  value={[currentRates.totalRate]}
                  min={0}
                  max={15}
                  step={0.01}
                  onValueChange={([value]) => updateRate('totalRate', value)}
                />
                <Input
                  type="number"
                  value={currentRates.totalRate}
                  onChange={(e) => updateRate('totalRate', parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="mt-2"
                />
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
