
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/payments/FileUploader";
import { PaymentType, PixKey } from "@/types";
import { AlertCircle, BanknoteIcon, FileIcon, SendIcon, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PaymentRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientBalance: number;
  pixKeys: PixKey[];
  isLoadingPixKeys?: boolean;
  onRequestPayment: (
    amount: string,
    description: string,
    pixKeyId: string | null,
    documentFile?: File | null
  ) => void;
}

export const PaymentRequestDialog = ({
  isOpen,
  onOpenChange,
  clientBalance,
  pixKeys = [],
  isLoadingPixKeys = false,
  onRequestPayment
}: PaymentRequestDialogProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPixKeyId, setSelectedPixKeyId] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  
  // Reset form data when dialog is opened/closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form data
      setAmount("");
      setDescription("");
      setSelectedPixKeyId(null);
      setDocumentFile(null);
    } else if (pixKeys.length > 0) {
      // Preselect default key if available
      const defaultKey = pixKeys.find(key => key.isDefault);
      if (defaultKey) {
        setSelectedPixKeyId(defaultKey.id);
      } else {
        setSelectedPixKeyId(pixKeys[0].id);
      }
    }
    
    onOpenChange(open);
  };
  
  const handleSubmit = () => {
    // Validate amount
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

    // Validate PIX key selection
    if (!selectedPixKeyId) {
      toast({
        variant: "destructive",
        title: "Chave PIX não selecionada",
        description: "Por favor, selecione uma chave PIX para receber o pagamento",
      });
      return;
    }
    
    // Call the parent onRequestPayment function with all the necessary data
    onRequestPayment(
      amount,
      description,
      selectedPixKeyId,
      documentFile
    );
    
    // Reset fields
    setAmount("");
    setDescription("");
    setSelectedPixKeyId(null);
    setDocumentFile(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitar Pagamento</DialogTitle>
          <DialogDescription>
            Escolha a chave PIX e informe o valor que deseja retirar do seu saldo disponível.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Saldo Disponível:</span>
            <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(clientBalance)}</span>
          </div>
          
          <Separator />
          
          {pixKeys.length === 0 && !isLoadingPixKeys && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nenhuma chave PIX cadastrada</AlertTitle>
              <AlertDescription>
                Você precisa cadastrar pelo menos uma chave PIX nas configurações antes de solicitar pagamentos.
              </AlertDescription>
            </Alert>
          )}
          
          {isLoadingPixKeys && (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-muted-foreground">Carregando chaves PIX...</span>
            </div>
          )}
          
          {pixKeys.length > 0 && !isLoadingPixKeys && (
            <div className="space-y-2">
              <Label htmlFor="pix-key">Chave PIX para recebimento</Label>
              <Select 
                value={selectedPixKeyId || ""} 
                onValueChange={(value) => setSelectedPixKeyId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma chave PIX" />
                </SelectTrigger>
                <SelectContent>
                  {pixKeys.map((pixKey) => (
                    <SelectItem 
                      key={pixKey.id} 
                      value={pixKey.id}
                      className="flex items-center"
                    >
                      <div className="flex flex-col">
                        <span>{pixKey.owner_name || pixKey.name}</span>
                        <span className="text-xs text-muted-foreground">{pixKey.type}: {pixKey.key}</span>
                      </div>
                      {pixKey.isDefault && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Padrão
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              placeholder="Informe a finalidade da solicitação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attachment">Comprovante (opcional)</Label>
            <FileUploader
              onFileSelect={(file) => setDocumentFile(file)}
              accept=".pdf,.jpg,.jpeg,.png"
              label="Arraste e solte o comprovante aqui ou clique para selecionar"
              currentFile={documentFile}
            />
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 5MB
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedPixKeyId || pixKeys.length === 0 || !amount || parseFloat(amount) <= 0}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Solicitar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
