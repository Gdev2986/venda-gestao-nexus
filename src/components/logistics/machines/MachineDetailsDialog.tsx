
import { useState, useEffect } from "react";
import { Machine, MachineStatus, MachineNote } from "@/types/machine.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Settings, MessageSquare, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getMachineNotes, createMachineNote, deleteMachineNote } from "@/services/machine-notes.service";
import { toast } from "sonner";

interface MachineDetailsDialogProps {
  machine: Machine | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Machine>) => Promise<void>;
  onTransfer?: (machineId: string, newClientId: string | null) => Promise<void>;
}

const statusColors = {
  [MachineStatus.ACTIVE]: "bg-green-500",
  [MachineStatus.INACTIVE]: "bg-gray-500",
  [MachineStatus.MAINTENANCE]: "bg-yellow-500",
  [MachineStatus.BLOCKED]: "bg-red-500",
  [MachineStatus.STOCK]: "bg-blue-500",
  [MachineStatus.TRANSIT]: "bg-purple-500",
};

const statusLabels = {
  [MachineStatus.ACTIVE]: "Ativa",
  [MachineStatus.INACTIVE]: "Inativa",
  [MachineStatus.MAINTENANCE]: "Manutenção",
  [MachineStatus.BLOCKED]: "Bloqueada",
  [MachineStatus.STOCK]: "Estoque",
  [MachineStatus.TRANSIT]: "Trânsito",
};

export const MachineDetailsDialog = ({
  machine,
  isOpen,
  onClose,
  onUpdate,
  onTransfer
}: MachineDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMachine, setEditedMachine] = useState<Partial<Machine>>({});
  const [notes, setNotes] = useState<MachineNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    if (machine && isOpen) {
      setEditedMachine({
        model: machine.model,
        status: machine.status,
        notes: machine.notes || "",
      });
      loadNotes();
    }
  }, [machine, isOpen]);

  const loadNotes = async () => {
    if (!machine) return;
    
    try {
      const machineNotes = await getMachineNotes(machine.id);
      setNotes(machineNotes);
    } catch (error) {
      console.error("Error loading machine notes:", error);
    }
  };

  const handleSave = async () => {
    if (!machine) return;

    try {
      await onUpdate(machine.id, editedMachine);
      setIsEditing(false);
      toast.success("Máquina atualizada com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar máquina");
    }
  };

  const handleAddNote = async () => {
    if (!machine || !newNote.trim()) return;

    try {
      setIsAddingNote(true);
      const note = await createMachineNote(machine.id, newNote.trim());
      setNotes(prev => [note, ...prev]);
      setNewNote("");
      toast.success("Nota adicionada com sucesso");
    } catch (error) {
      toast.error("Erro ao adicionar nota");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteMachineNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success("Nota removida com sucesso");
    } catch (error) {
      toast.error("Erro ao remover nota");
    }
  };

  if (!machine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Detalhes da Máquina
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Número de Série</label>
                <Input value={machine.serial_number} disabled />
              </div>

              <div>
                <label className="text-sm font-medium">Modelo</label>
                {isEditing ? (
                  <Input
                    value={editedMachine.model || ""}
                    onChange={(e) => setEditedMachine(prev => ({ ...prev, model: e.target.value }))}
                  />
                ) : (
                  <Input value={machine.model} disabled />
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                {isEditing ? (
                  <Select
                    value={editedMachine.status}
                    onValueChange={(value) => setEditedMachine(prev => ({ ...prev, status: value as MachineStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge 
                    className={`${statusColors[machine.status]} text-white`}
                  >
                    {statusLabels[machine.status]}
                  </Badge>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Cliente</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{machine.client?.business_name || "Não atribuída"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Data de Criação</label>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(machine.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Última Atualização</label>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(machine.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Observações</label>
                {isEditing ? (
                  <Textarea
                    value={editedMachine.notes || ""}
                    onChange={(e) => setEditedMachine(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Adicione observações sobre a máquina..."
                    rows={3}
                  />
                ) : (
                  <Textarea
                    value={machine.notes || "Nenhuma observação"}
                    disabled
                    rows={3}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notas da Máquina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Histórico de Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Adicionar nova nota */}
            <div className="flex gap-2 mb-4">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Adicionar uma nova nota..."
                rows={2}
                className="flex-1"
              />
              <Button 
                onClick={handleAddNote}
                disabled={!newNote.trim() || isAddingNote}
                size="sm"
              >
                {isAddingNote ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>

            <Separator className="mb-4" />

            {/* Lista de notas */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhuma nota encontrada</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm">{note.note}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Por {note.user?.name || note.user?.email} em{" "}
                          {format(new Date(note.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            {onTransfer && (
              <Button variant="outline" onClick={() => {/* TODO: Implement transfer dialog */}}>
                Transferir
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Salvar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
