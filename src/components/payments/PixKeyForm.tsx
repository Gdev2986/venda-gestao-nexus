
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
import { usePaymentRequests } from "@/hooks/use-payment-requests";
import { PixKeyType } from "@/types";

interface PixKeyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PixKeyForm = ({
  open,
  onOpenChange,
}: PixKeyFormProps) => {
  const { addPixKey } = usePaymentRequests();
  const [name, setName] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [type, setType] = useState<PixKeyType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!name || !key || !type) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await addPixKey({
        name,
        key,
        type: type as PixKeyType,
        is_default: false
      });
      
      if (success) {
        onOpenChange(false);
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName("");
    setKey("");
    setType("");
  };
  
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Apply formatting based on type
    if (type === PixKeyType.CPF) {
      value = value.replace(/\D/g, "").slice(0, 11);
    } else if (type === PixKeyType.CNPJ) {
      value = value.replace(/\D/g, "").slice(0, 14);
    } else if (type === PixKeyType.PHONE) {
      value = value.replace(/\D/g, "").slice(0, 11);
    } else if (type === PixKeyType.RANDOM) {
      value = value.slice(0, 36);
    }
    
    setKey(value);
  };
  
  const isFormValid = name && key && type && !isSubmitting;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Chave PIX</DialogTitle>
          <DialogDescription>
            Informe os dados da sua chave PIX para receber pagamentos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="name">Nome da Chave</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: PIX Pessoal"
            />
          </div>
          
          <div className="grid items-center gap-2">
            <Label htmlFor="type">Tipo da Chave</Label>
            <Select 
              value={type} 
              onValueChange={(value: PixKeyType) => setType(value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo de chave" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PixKeyType.CPF}>CPF</SelectItem>
                <SelectItem value={PixKeyType.CNPJ}>CNPJ</SelectItem>
                <SelectItem value={PixKeyType.EMAIL}>E-mail</SelectItem>
                <SelectItem value={PixKeyType.PHONE}>Telefone</SelectItem>
                <SelectItem value={PixKeyType.RANDOM}>Chave Aleatória</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid items-center gap-2">
            <Label htmlFor="key">Chave</Label>
            <Input
              id="key"
              value={key}
              onChange={handleKeyChange}
              placeholder={getPlaceholder(type as PixKeyType)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            disabled={!isFormValid} 
            onClick={handleSubmit}
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar Chave"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get placeholder based on PIX key type
function getPlaceholder(type: PixKeyType): string {
  switch (type) {
    case PixKeyType.CPF:
      return "000.000.000-00";
    case PixKeyType.CNPJ:
      return "00.000.000/0000-00";
    case PixKeyType.EMAIL:
      return "email@exemplo.com";
    case PixKeyType.PHONE:
      return "+55 (00) 00000-0000";
    case PixKeyType.RANDOM:
      return "Chave aleatória";
    default:
      return "Informe sua chave";
  }
}

export default PixKeyForm;
