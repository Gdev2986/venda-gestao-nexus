
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PixKey } from "@/types";

export interface PaymentRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientBalance: number;
  pixKeys: PixKey[];
  isLoadingPixKeys: boolean;
  onRequestPayment: (amount: number, description: string, pixKeyId: string) => Promise<void>;
}

export const PaymentRequestDialog = ({
  open,
  onOpenChange,
  clientBalance,
  pixKeys,
  isLoadingPixKeys,
  onRequestPayment
}: PaymentRequestDialogProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [pixKeyId, setPixKeyId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setPixKeyId("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError("Por favor, insira um valor válido");
      return;
    }

    if (parseFloat(amount) > clientBalance) {
      setError("Valor solicitado é maior que o saldo disponível");
      return;
    }

    if (!description.trim()) {
      setError("Por favor, insira uma descrição");
      return;
    }

    if (!pixKeyId) {
      setError("Por favor, selecione uma chave PIX");
      return;
    }

    try {
      setIsSubmitting(true);
      await onRequestPayment(parseFloat(amount), description, pixKeyId);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Erro ao solicitar pagamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                required
              />
              <div className="text-xs text-muted-foreground">
                Saldo disponível: R$ {clientBalance.toFixed(2)}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o motivo do pagamento"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pixKey">Chave PIX para pagamento</Label>
              <Select
                value={pixKeyId}
                onValueChange={setPixKeyId}
                disabled={isLoadingPixKeys || pixKeys.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma chave PIX" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingPixKeys ? (
                    <SelectItem value="loading" disabled>
                      Carregando...
                    </SelectItem>
                  ) : pixKeys.length > 0 ? (
                    pixKeys.map((key) => (
                      <SelectItem key={key.id} value={key.id}>
                        {key.name || key.key} {key.is_default && "(Padrão)"}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      Nenhuma chave cadastrada
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {error && <div className="text-sm font-medium text-red-500">{error}</div>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Solicitar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
