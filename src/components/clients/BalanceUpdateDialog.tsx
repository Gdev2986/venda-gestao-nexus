
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Client } from "@/types";
import { useClientBalance } from "@/hooks/useClientBalance";

interface BalanceUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onSuccess?: () => void;
}

export function BalanceUpdateDialog({
  open,
  onOpenChange,
  client,
  onSuccess
}: BalanceUpdateDialogProps) {
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [updateType, setUpdateType] = useState<"ADD" | "SUBTRACT">("ADD");
  const { updateBalance, isLoading } = useClientBalance();

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return;
    }
    
    const finalAmount = updateType === "ADD" ? parseFloat(amount) : -parseFloat(amount);
    
    const success = await updateBalance(
      client.id,
      finalAmount,
      reason,
      updateType.toLowerCase()
    );
    
    if (success && onSuccess) {
      onSuccess();
    }
    
    if (success) {
      onOpenChange(false);
      setAmount("");
      setReason("");
      setUpdateType("ADD");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Atualizar Saldo de {client.business_name || client.contact_name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Saldo atual: <strong>R$ {client.balance?.toFixed(2) || "0,00"}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <RadioGroup 
            className="flex space-x-4" 
            value={updateType} 
            onValueChange={(val) => setUpdateType(val as "ADD" | "SUBTRACT")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ADD" id="add" />
              <Label htmlFor="add" className="cursor-pointer">Adicionar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SUBTRACT" id="subtract" />
              <Label htmlFor="subtract" className="cursor-pointer">Subtrair</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label htmlFor="balance-amount">Valor (R$)</Label>
            <Input
              id="balance-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="balance-reason">Motivo da alteração</Label>
            <Textarea
              id="balance-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Informe o motivo desta alteração de saldo..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Esta mensagem será enviada como notificação para o cliente.
            </p>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit} 
            disabled={isLoading || !amount || isNaN(Number(amount)) || Number(amount) <= 0}
          >
            {isLoading ? "Atualizando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
