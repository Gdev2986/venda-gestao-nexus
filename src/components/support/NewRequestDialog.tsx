
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Send } from "lucide-react";

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (subject: string, message: string, requestType: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER") => void;
  isLoading: boolean;
  initialSubject?: string;
  initialType?: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER";
}

const NewRequestDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading,
  initialSubject = "",
  initialType = "MACHINE" 
}: NewRequestDialogProps) => {
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [requestType, setRequestType] = useState<"MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER">(initialType);

  const handleSubmit = () => {
    onSubmit(subject, message, requestType);
  };

  const handleOpenChange = (newOpenState: boolean) => {
    // Reset form when closing the dialog
    if (!newOpenState) {
      setSubject(initialSubject);
      setMessage("");
      setRequestType(initialType);
    }
    onOpenChange(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            disabled={isLoading}
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
};

export default NewRequestDialog;
