
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    subject: string;
    message: string;
    requestType: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER";
  }) => void;
  initialType?: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER";
  initialSubject?: string;
  isLoading: boolean;
}

export function NewRequestDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialType = "MACHINE",
  initialSubject = "",
  isLoading
}: NewRequestDialogProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [requestType, setRequestType] = useState<"MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER">(initialType);
  
  const { toast } = useToast();
  
  const handleSubmit = () => {
    if (!subject || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      subject,
      message,
      requestType,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Suporte</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova solicitação de suporte
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <Label htmlFor="request-type">Tipo de Solicitação</Label>
              <Select 
                value={requestType} 
                onValueChange={(value: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER") => setRequestType(value)}
              >
                <SelectTrigger id="request-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MACHINE">Máquina</SelectItem>
                  <SelectItem value="SUPPLIES">Suprimentos</SelectItem>
                  <SelectItem value="PAYMENT">Pagamento</SelectItem>
                  <SelectItem value="OTHER">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-4">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                placeholder="Descreva brevemente o problema"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="col-span-4">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Detalhe sua solicitação"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
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
            onClick={handleSubmit} 
            disabled={!subject || !message || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
