
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileText, Image } from "lucide-react";
import { SupportRequestType, SupportRequestPriority, CreateSupportTicketParams } from "@/types/support.types";

interface SupportTicketDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (params: CreateSupportTicketParams) => Promise<boolean>;
  machines?: Array<{ id: string; serial_number: string; model: string; }>;
}

export const SupportTicketDialog: React.FC<SupportTicketDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  machines = []
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SupportRequestType>(SupportRequestType.SUPPORT);
  const [priority, setPriority] = useState<SupportRequestPriority>(SupportRequestPriority.MEDIUM);
  const [machineId, setMachineId] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    
    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      type,
      priority,
      machine_id: machineId || undefined,
      attachments
    });

    if (success) {
      setTitle("");
      setDescription("");
      setType(SupportRequestType.SUPPORT);
      setPriority(SupportRequestPriority.MEDIUM);
      setMachineId("");
      setAttachments([]);
      onOpenChange(false);
    }
    
    setIsSubmitting(false);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Chamado de Suporte</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(value) => setType(value as SupportRequestType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SupportRequestType.SUPPORT}>Suporte</SelectItem>
                  <SelectItem value={SupportRequestType.MAINTENANCE}>Manutenção</SelectItem>
                  <SelectItem value={SupportRequestType.INSTALLATION}>Instalação</SelectItem>
                  <SelectItem value={SupportRequestType.REPAIR}>Reparo</SelectItem>
                  <SelectItem value={SupportRequestType.TRAINING}>Treinamento</SelectItem>
                  <SelectItem value={SupportRequestType.OTHER}>Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as SupportRequestPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SupportRequestPriority.LOW}>Baixa</SelectItem>
                  <SelectItem value={SupportRequestPriority.MEDIUM}>Média</SelectItem>
                  <SelectItem value={SupportRequestPriority.HIGH}>Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {machines.length > 0 && (
            <div>
              <Label htmlFor="machine">Máquina (opcional)</Label>
              <Select value={machineId} onValueChange={setMachineId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma máquina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma máquina</SelectItem>
                  {machines.map(machine => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.serial_number} - {machine.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descreva brevemente o problema"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o problema ou solicitação"
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Anexos</Label>
            <div className="mt-1">
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Arquivos
              </Button>
            </div>
            
            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file)}
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()}>
              {isSubmitting ? "Criando..." : "Criar Chamado"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
