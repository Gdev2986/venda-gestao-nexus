
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BlockWithRates } from "@/services/tax-blocks.service";

interface TaxBlockEditorProps {
  block?: BlockWithRates;
  onSave: (block: BlockWithRates) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  isSubmitting: boolean;
}

const PAYMENT_METHODS = [
  { id: 'CREDIT', label: 'Crédito' },
  { id: 'DEBIT', label: 'Débito' },
  { id: 'PIX', label: 'PIX' }
];

const DEFAULT_INSTALLMENTS = [1, 2, 3, 6, 12];

const TaxBlockEditor: React.FC<TaxBlockEditorProps> = ({ 
  block,
  onSave,
  onCancel,
  onDelete,
  isSubmitting 
}) => {
  const [activeTab, setActiveTab] = useState<string>("info");
  const [name, setName] = useState(block?.name || "");
  const [description, setDescription] = useState(block?.description || "");
  const [rates, setRates] = useState<any[]>(block?.rates || []);
  const [validation, setValidation] = useState({ name: true });

  // Format the initial rates for editing
  useEffect(() => {
    if (block?.rates) {
      setRates(block.rates);
    } else {
      // Initialize with default empty rates
      const initialRates = [];
      
      // For CREDIT, add standard installment counts
      for (const installment of DEFAULT_INSTALLMENTS) {
        initialRates.push({
          payment_method: 'CREDIT',
          installment,
          root_rate: 0,
          forwarding_rate: 0,
          final_rate: 0
        });
      }
      
      // For DEBIT and PIX, add only installment 1
      initialRates.push({
        payment_method: 'DEBIT',
        installment: 1,
        root_rate: 0,
        forwarding_rate: 0,
        final_rate: 0
      });
      
      initialRates.push({
        payment_method: 'PIX',
        installment: 1,
        root_rate: 0,
        forwarding_rate: 0,
        final_rate: 0
      });
      
      setRates(initialRates);
    }
  }, [block]);

  const validateForm = (): boolean => {
    const nameValid = name.trim().length > 0;
    setValidation({ name: nameValid });
    return nameValid;
  };

  const handleRateChange = (index: number, field: string, value: number) => {
    const updatedRates = [...rates];
    updatedRates[index] = {
      ...updatedRates[index],
      [field]: value
    };
    setRates(updatedRates);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const updatedBlock = {
      id: block?.id || '',
      name,
      description,
      rates
    };
    
    onSave(updatedBlock);
  };

  // Group rates by payment method
  const creditRates = rates.filter(r => r.payment_method === 'CREDIT').sort((a, b) => a.installment - b.installment);
  const debitRates = rates.filter(r => r.payment_method === 'DEBIT');
  const pixRates = rates.filter(r => r.payment_method === 'PIX');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Informações Gerais</TabsTrigger>
          <TabsTrigger value="rates">Taxas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome do Bloco
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do bloco de taxas"
                className={!validation.name ? "border-red-500" : ""}
              />
              {!validation.name && (
                <p className="text-sm text-red-500 mt-1">Nome é obrigatório</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Descrição (opcional)
              </label>
              <Textarea
                id="description"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do bloco de taxas"
                rows={4}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rates" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Configure as taxas para cada método de pagamento e número de parcelas.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-6">
            {/* Crédito */}
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Crédito</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Taxa Raíz (%)</TableHead>
                    <TableHead>Taxa de Repasse (%)</TableHead>
                    <TableHead>Taxa Final (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditRates.map((rate, index) => {
                    const rateIndex = rates.findIndex(r => 
                      r.payment_method === rate.payment_method && 
                      r.installment === rate.installment
                    );
                    
                    return (
                      <TableRow key={`credit-${rate.installment}`}>
                        <TableCell>{rate.installment}x</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.root_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'root_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.forwarding_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'forwarding_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.final_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'final_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {/* Débito */}
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Débito</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Taxa Raíz (%)</TableHead>
                    <TableHead>Taxa de Repasse (%)</TableHead>
                    <TableHead>Taxa Final (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debitRates.map((rate) => {
                    const rateIndex = rates.findIndex(r => 
                      r.payment_method === rate.payment_method && 
                      r.installment === rate.installment
                    );
                    
                    return (
                      <TableRow key={`debit-${rate.installment}`}>
                        <TableCell>{rate.installment}x</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.root_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'root_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.forwarding_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'forwarding_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.final_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'final_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {/* PIX */}
            <div className="space-y-2">
              <h3 className="font-medium text-lg">PIX</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Taxa Raíz (%)</TableHead>
                    <TableHead>Taxa de Repasse (%)</TableHead>
                    <TableHead>Taxa Final (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pixRates.map((rate) => {
                    const rateIndex = rates.findIndex(r => 
                      r.payment_method === rate.payment_method && 
                      r.installment === rate.installment
                    );
                    
                    return (
                      <TableRow key={`pix-${rate.installment}`}>
                        <TableCell>{rate.installment}x</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.root_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'root_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.forwarding_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'forwarding_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={rate.final_rate}
                            onChange={(e) => handleRateChange(rateIndex, 'final_rate', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-4 border-t">
        <div>
          {block && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isSubmitting}>
                  <Trash2 className="h-4 w-4 mr-1" /> 
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir bloco de taxas</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o bloco de taxas e todas as taxas associadas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => block.id && onDelete(block.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir Permanentemente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Salvando...</>
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxBlockEditor;
