
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaymentRequests, PixKey } from "@/hooks/use-payment-requests";
import { formatCurrency } from "@/lib/utils";

interface PaymentRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPixKey: () => void;
}

const PaymentRequestForm = ({
  open,
  onOpenChange,
  onAddPixKey,
}: PaymentRequestFormProps) => {
  const { pixKeys, currentBalance, createPaymentRequest } = usePaymentRequests();
  const [amount, setAmount] = useState<string>("");
  const [selectedPixKey, setSelectedPixKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };
  
  const handleSubmit = async () => {
    if (!amount || !selectedPixKey) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await createPaymentRequest(parseFloat(amount), selectedPixKey);
      if (success) {
        onOpenChange(false);
        setAmount("");
        setSelectedPixKey("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatPixKey = (pixKey: PixKey) => {
    const { type, key, name } = pixKey;
    return `${name} - ${type}: ${maskPixKey(type, key)}`;
  };
  
  const maskPixKey = (type: string, key: string): string => {
    switch (type) {
      case "CPF":
        return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      case "CNPJ":
        return key.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      case "PHONE":
        return key.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      case "EMAIL":
      case "RANDOM":
      default:
        return key;
    }
  };
  
  // Determine if form can be submitted
  const isFormValid = amount && 
    parseFloat(amount) > 0 && 
    parseFloat(amount) <= currentBalance && 
    selectedPixKey;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Pagamento</DialogTitle>
          <DialogDescription>
            Informe o valor e selecione a chave PIX para receber o pagamento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
            />
            <p className="text-sm text-muted-foreground">
              Saldo disponível: {formatCurrency(currentBalance)}
            </p>
          </div>
          <div className="grid items-center gap-2">
            <Label htmlFor="pixKey">Chave PIX</Label>
            {pixKeys.length > 0 ? (
              <Select value={selectedPixKey} onValueChange={setSelectedPixKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma chave PIX" />
                </SelectTrigger>
                <SelectContent>
                  {pixKeys.map((pixKey) => (
                    <SelectItem key={pixKey.id} value={pixKey.id}>
                      {formatPixKey(pixKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Você não possui chaves PIX cadastradas.
                </p>
                <Button variant="outline" onClick={onAddPixKey}>
                  Cadastrar Chave PIX
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {pixKeys.length > 0 && (
            <Button variant="outline" onClick={onAddPixKey}>
              Cadastrar Nova Chave PIX
            </Button>
          )}
          <Button 
            disabled={!isFormValid || isSubmitting} 
            onClick={handleSubmit}
          >
            {isSubmitting ? "Enviando..." : "Solicitar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRequestForm;
