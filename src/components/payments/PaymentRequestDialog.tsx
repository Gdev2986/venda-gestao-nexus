
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/payments/FileUploader";
import { PaymentType } from "@/types";
import { SendIcon, BanknoteIcon, CircleDollarSignIcon, FileIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientBalance: number;
  onRequestPayment: (
    amount: string, 
    description: string, 
    paymentType: PaymentType, 
    bankInfo?: {
      bank_name: string;
      branch_number: string;
      account_number: string;
      account_holder: string;
    },
    documentFile?: File | null
  ) => void;
}

export const PaymentRequestDialog = ({
  isOpen,
  onOpenChange,
  clientBalance,
  onRequestPayment
}: PaymentRequestDialogProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.PIX);
  const [bankInfo, setBankInfo] = useState({
    bank_name: "",
    branch_number: "",
    account_number: "",
    account_holder: ""
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  
  // Reset form data when payment type changes
  const handlePaymentTypeChange = (value: PaymentType) => {
    setPaymentType(value);
    // Reset form fields based on payment type
    setAmount("");
    setDescription("");
    setBankInfo({
      bank_name: "",
      branch_number: "",
      account_number: "",
      account_holder: ""
    });
    setDocumentFile(null);
  };
  
  const handleSubmit = () => {
    // Validate amount for all payment types
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Informe um valor válido para solicitação",
      });
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    
    if (parsedAmount > clientBalance) {
      toast({
        variant: "destructive",
        title: "Saldo insuficiente",
        description: "O valor solicitado é maior que seu saldo disponível",
      });
      return;
    }

    // Validate fields based on payment type
    if (paymentType === PaymentType.TED) {
      if (!bankInfo.bank_name || !bankInfo.branch_number || !bankInfo.account_number || !bankInfo.account_holder) {
        toast({
          variant: "destructive",
          title: "Informações bancárias incompletas",
          description: "Preencha todos os campos de informações bancárias",
        });
        return;
      }
    } else if (paymentType === PaymentType.BOLETO) {
      if (!documentFile) {
        toast({
          variant: "destructive",
          title: "Documento não anexado",
          description: "Anexe o boleto para prosseguir",
        });
        return;
      }
    }
    
    // Call the parent onRequestPayment function with all the necessary data
    onRequestPayment(
      amount,
      description,
      paymentType,
      paymentType === PaymentType.TED ? bankInfo : undefined,
      paymentType === PaymentType.BOLETO ? documentFile : null
    );
    
    // Reset fields
    setAmount("");
    setDescription("");
    setPaymentType(PaymentType.PIX);
    setBankInfo({
      bank_name: "",
      branch_number: "",
      account_number: "",
      account_holder: ""
    });
    setDocumentFile(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitar Pagamento</DialogTitle>
          <DialogDescription>
            Escolha o método e informe o valor que deseja retirar do seu saldo disponível.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Saldo Disponível:</span>
            <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(clientBalance)}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="payment-type">Tipo de Pagamento</Label>
            <Select value={paymentType} onValueChange={(value) => handlePaymentTypeChange(value as PaymentType)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentType.PIX}>
                  <div className="flex items-center">
                    <BanknoteIcon className="h-4 w-4 mr-2" />
                    <span>PIX</span>
                  </div>
                </SelectItem>
                <SelectItem value={PaymentType.TED}>
                  <div className="flex items-center">
                    <CircleDollarSignIcon className="h-4 w-4 mr-2" />
                    <span>TED</span>
                  </div>
                </SelectItem>
                <SelectItem value={PaymentType.BOLETO}>
                  <div className="flex items-center">
                    <FileIcon className="h-4 w-4 mr-2" />
                    <span>Boleto</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Valor da Solicitação</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {/* TED specific fields */}
          {paymentType === PaymentType.TED && (
            <div className="space-y-4 border p-4 rounded-md bg-gray-50">
              <h4 className="font-medium">Informações Bancárias para TED</h4>
              <div className="space-y-2">
                <Label htmlFor="bank_name">Nome do Banco</Label>
                <Input
                  id="bank_name"
                  value={bankInfo.bank_name}
                  onChange={(e) => setBankInfo({...bankInfo, bank_name: e.target.value})}
                  placeholder="Ex: Banco do Brasil"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch_number">Agência</Label>
                <Input
                  id="branch_number"
                  value={bankInfo.branch_number}
                  onChange={(e) => setBankInfo({...bankInfo, branch_number: e.target.value})}
                  placeholder="Ex: 0001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_number">Conta</Label>
                <Input
                  id="account_number"
                  value={bankInfo.account_number}
                  onChange={(e) => setBankInfo({...bankInfo, account_number: e.target.value})}
                  placeholder="Ex: 12345-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_holder">Titular da Conta</Label>
                <Input
                  id="account_holder"
                  value={bankInfo.account_holder}
                  onChange={(e) => setBankInfo({...bankInfo, account_holder: e.target.value})}
                  placeholder="Ex: João da Silva"
                />
              </div>
            </div>
          )}
          
          {/* Boleto specific fields */}
          {paymentType === PaymentType.BOLETO && (
            <div className="space-y-4 border p-4 rounded-md bg-gray-50">
              <h4 className="font-medium">Anexar Boleto</h4>
              <FileUploader
                onFileSelect={(file) => setDocumentFile(file)}
                accept=".pdf,.jpg,.jpeg,.png"
                label="Arraste e solte o boleto aqui ou clique para selecionar"
                currentFile={documentFile}
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 5MB
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              placeholder="Informe a finalidade da solicitação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            <SendIcon className="h-4 w-4 mr-2" />
            Solicitar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
