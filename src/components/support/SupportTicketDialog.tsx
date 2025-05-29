
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { TicketType, TicketPriority } from "@/types/support.types";
import { CreateTicketParams } from "@/types/support.types";

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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: TicketType.SUPPORT,
    priority: TicketPriority.MEDIUM,
    machine_id: "",
    attachments: [] as File[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        client_id: user.id,
        type: formData.type,
        priority: formData.priority,
        machine_id: formData.machine_id || undefined,
        attachments: formData.attachments
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        type: TicketType.SUPPORT,
        priority: TicketPriority.MEDIUM,
        machine_id: "",
        attachments: []
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: Array.from(e.target.files || [])
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Chamado de Suporte</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Descreva brevemente o problema"
              required
            />
          </div>

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

          <div>
            <Label htmlFor="attachments">Anexos (opcional)</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            {formData.attachments.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {formData.attachments.length} arquivo(s) selecionado(s)
              </p>
            )}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Chamado"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
