
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Por favor, insira um valor válido maior que zero."
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        variant: "destructive",
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da alteração do saldo."
      });
      return;
    }

    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Usuário não autenticado."
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const finalAmount = updateType === "ADD" ? parseFloat(amount) : -parseFloat(amount);
      const previousBalance = client.balance || 0;
      const newBalance = previousBalance + finalAmount;

      // Atualizar saldo do cliente
      const { error: updateError } = await supabase
        .from('clients')
        .update({ balance: newBalance })
        .eq('id', client.id);

      if (updateError) throw updateError;

      // Registrar histórico de alteração (que dispara a notificação automaticamente via trigger)
      const { error: historyError } = await supabase
        .from('balance_changes')
        .insert({
          client_id: client.id,
          previous_balance: previousBalance,
          new_balance: newBalance,
          amount_changed: finalAmount,
          reason: reason.trim(),
          changed_by: user.id
        });

      if (historyError) throw historyError;

      toast({
        title: "Saldo atualizado",
        description: `Saldo ${updateType === "ADD" ? "creditado" : "debitado"} com sucesso. O cliente será notificado.`,
      });
      
      onOpenChange(false);
      setAmount("");
      setReason("");
      setUpdateType("ADD");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o saldo do cliente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Atualizar Saldo de {client.business_name || client.contact_name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Saldo atual: <strong>R$ {(client.balance || 0).toFixed(2).replace('.', ',')}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium">Tipo de Operação</Label>
            <RadioGroup 
              className="flex space-x-4 mt-2" 
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="balance-amount">Valor (R$) *</Label>
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
            <Label htmlFor="balance-reason">Motivo da alteração *</Label>
            <Textarea
              id="balance-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Informe o motivo desta alteração de saldo..."
              rows={3}
              maxLength={500}
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
            disabled={isLoading || !amount || isNaN(Number(amount)) || Number(amount) <= 0 || !reason.trim()}
          >
            {isLoading ? "Atualizando..." : "Confirmar Alteração"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
