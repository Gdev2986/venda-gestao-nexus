
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface ClientBalanceEditorProps {
  clientId: string;
  currentBalance: number;
  onBalanceUpdated: () => void;
}

export const ClientBalanceEditor: React.FC<ClientBalanceEditorProps> = ({
  clientId,
  currentBalance,
  onBalanceUpdated
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newBalance, setNewBalance] = useState(currentBalance.toString());
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateBalance = async () => {
    if (!reason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "É necessário informar o motivo da alteração do saldo",
        variant: "destructive"
      });
      return;
    }

    const balance = parseFloat(newBalance);
    if (isNaN(balance)) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor numérico válido",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Atualizar o saldo do cliente
      const { error } = await supabase
        .from('clients')
        .update({ 
          balance: balance,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "Saldo atualizado",
        description: `Saldo alterado para ${formatCurrency(balance)}`
      });

      setIsOpen(false);
      setReason("");
      onBalanceUpdated();
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar saldo do cliente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <DollarSign className="h-4 w-4 mr-2" />
          Editar Saldo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Saldo do Cliente</DialogTitle>
          <DialogDescription>
            Atualize o saldo do cliente. O cliente será notificado sobre a alteração.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-balance">Saldo Atual</Label>
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(currentBalance)}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-balance">Novo Saldo</Label>
            <Input
              id="new-balance"
              type="number"
              step="0.01"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Alteração *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo da alteração do saldo..."
              className="min-h-[80px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateBalance} disabled={isLoading}>
            {isLoading ? "Atualizando..." : "Atualizar Saldo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
