
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { TicketType, TicketPriority } from "@/types/support.types";
import { CreateTicketParams } from "@/types/support.types";
import { useSupportSystem } from "@/hooks/use-support-system";

interface SupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (ticket: CreateTicketParams) => Promise<void>;
  isLoading?: boolean;
}

export const SupportTicketDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading = false 
}: SupportTicketDialogProps) => {
  const { user } = useAuth();
  const { userClientId } = useSupportSystem();
  const [formData, setFormData] = useState({
    description: "",
    type: TicketType.MAINTENANCE,
    priority: TicketPriority.MEDIUM
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await onSubmit({
        description: formData.description,
        client_id: userClientId || user.id, // Fallback to user.id, but validation will catch this
        type: formData.type,
        priority: formData.priority
      });
      
      // Reset form
      setFormData({
        description: "",
        type: TicketType.MAINTENANCE,
        priority: TicketPriority.MEDIUM
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  // Show warning if user has no client association
  const showClientWarning = !userClientId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Chamado de Suporte</DialogTitle>
        </DialogHeader>
        
        {showClientWarning && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Seu usuário não está associado a nenhum cliente. Entre em contato com o administrador para resolver esta questão antes de criar chamados.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de Chamado</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as TicketType }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TicketType.MAINTENANCE}>Manutenção</SelectItem>
                <SelectItem value={TicketType.INSTALLATION}>Instalação</SelectItem>
                <SelectItem value={TicketType.REPLACEMENT}>Substituição</SelectItem>
                <SelectItem value={TicketType.SUPPLIES}>Materiais</SelectItem>
                <SelectItem value={TicketType.REMOVAL}>Remoção</SelectItem>
                <SelectItem value={TicketType.OTHER}>Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as TicketPriority }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TicketPriority.LOW}>Baixa</SelectItem>
                <SelectItem value={TicketPriority.MEDIUM}>Média</SelectItem>
                <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o problema em detalhes"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || showClientWarning}
            >
              {isLoading ? "Criando..." : "Criar Chamado"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
