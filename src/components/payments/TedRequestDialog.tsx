
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface TedRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestTED: (
    amount: number, 
    bankInfo: {
      bank_name: string;
      branch_number: string;
      account_number: string;
      account_holder: string;
    },
    description?: string
  ) => Promise<boolean>;
}

export const TedRequestDialog = ({
  isOpen,
  onOpenChange,
  onRequestTED
}: TedRequestDialogProps) => {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      setError("Informe um valor válido");
      return;
    }
    
    if (!bankName || !branchNumber || !accountNumber || !accountHolder) {
      setError("Preencha todos os dados bancários");
      return;
    }
    
    setIsLoading(true);
    try {
      const bankInfo = {
        bank_name: bankName,
        branch_number: branchNumber,
        account_number: accountNumber,
        account_holder: accountHolder
      };
      
      const success = await onRequestTED(parseFloat(amount), bankInfo, description);
      
      if (success) {
        resetForm();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setAmount("");
    setBankName("");
    setBranchNumber("");
    setAccountNumber("");
    setAccountHolder("");
    setDescription("");
    setError(null);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Pagamento via TED</DialogTitle>
          <DialogDescription>
            Informe os dados bancários para transferência
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                className="pl-8"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Nome do Banco</Label>
              <Input
                id="bankName"
                placeholder="Ex: Banco do Brasil"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branchNumber">Agência</Label>
              <Input
                id="branchNumber"
                placeholder="Ex: 1234"
                value={branchNumber}
                onChange={(e) => setBranchNumber(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Conta</Label>
              <Input
                id="accountNumber"
                placeholder="Ex: 12345-6"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Titular da Conta</Label>
              <Input
                id="accountHolder"
                placeholder="Nome completo do titular"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Finalidade da transferência"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              type="button"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Solicitar TED"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
