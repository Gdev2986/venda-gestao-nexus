
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
import { Loader2, Upload } from "lucide-react";

interface BoletoRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestBoleto: (amount: number, dueDate: string, description?: string, document?: File) => Promise<boolean>;
}

export const BoletoRequestDialog = ({ 
  isOpen, 
  onOpenChange,
  onRequestBoleto 
}: BoletoRequestDialogProps) => {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState<File | null>(null);
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
    
    if (!dueDate) {
      setError("Informe a data de vencimento");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await onRequestBoleto(
        parseFloat(amount), 
        dueDate, 
        description,
        document || undefined
      );
      
      if (success) {
        resetForm();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setAmount("");
    setDueDate("");
    setDescription("");
    setDocument(null);
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
          <DialogTitle>Solicitar Pagamento via Boleto</DialogTitle>
          <DialogDescription>
            Informe os detalhes do boleto para registro
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
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="boletoFile">Arquivo do Boleto (opcional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="boletoFile"
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={(e) => setDocument(e.target.files?.[0] || null)}
              />
            </div>
            {document && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {document.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descrição ou número do boleto"
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
                "Registrar Boleto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
