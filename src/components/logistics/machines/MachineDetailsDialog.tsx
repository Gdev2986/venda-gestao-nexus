import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Machine, MachineStatus, MachineNote } from "@/types/machine.types";
import { updateMachine } from "@/services/machine.service";
import { getAllClients } from "@/services/client.service";
import { getMachineNotes, addMachineNote } from "@/services/machine-notes.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Plus, Calendar, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Client {
  id: string;
  business_name: string;
}

interface MachineDetailsDialogProps {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  mode: 'view' | 'edit';
}

export const MachineDetailsDialog = ({ 
  machine, 
  open, 
  onOpenChange, 
  onUpdate, 
  mode 
}: MachineDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [notes, setNotes] = useState<MachineNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [showSerialAlert, setShowSerialAlert] = useState(false);
  const [formData, setFormData] = useState({
    serial_number: '',
    model: '',
    status: MachineStatus.STOCK,
    client_id: '',
    notes: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const MACHINE_MODELS = [
    { value: "PagBank", label: "PagBank" },
    { value: "CeoPag", label: "CeoPag" },
    { value: "Rede", label: "Rede" }
  ];

  useEffect(() => {
    if (machine) {
      setFormData({
        serial_number: machine.serial_number || '',
        model: machine.model || '',
        status: machine.status || MachineStatus.STOCK,
        client_id: machine.client_id || '',
        notes: machine.notes || ''
      });
    }
  }, [machine]);

  useEffect(() => {
    setIsEditing(mode === 'edit');
  }, [mode]);

  useEffect(() => {
    if (open) {
      loadClients();
      if (machine?.id) {
        loadNotes();
      }
    }
  }, [open, machine?.id]);

  const loadClients = async () => {
    try {
      const clientsData = await getAllClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadNotes = async () => {
    if (!machine?.id) return;
    try {
      const notesData = await getMachineNotes(machine.id);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSave = async () => {
    if (!machine) return;
    
    setIsLoading(true);
    try {
      await updateMachine(machine.id, formData);
      toast({
        title: "Máquina atualizada",
        description: "As alterações foram salvas com sucesso."
      });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating machine:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSerialNumberChange = (value: string) => {
    if (value !== machine?.serial_number && machine?.serial_number) {
      setShowSerialAlert(true);
    }
    setFormData({ ...formData, serial_number: value });
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !machine?.id || !user?.id) return;
    
    setIsAddingNote(true);
    try {
      await addMachineNote(machine.id, newNote, user.id);
      setNewNote('');
      await loadNotes();
      toast({
        title: "Nota adicionada",
        description: "A nota foi salva com sucesso."
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a nota.",
        variant: "destructive"
      });
    } finally {
      setIsAddingNote(false);
    }
  };

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-100 text-blue-800">Em Estoque</Badge>;
      case MachineStatus.DEFECTIVE:
        return <Badge className="bg-red-100 text-red-800">Defeito</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClientName = () => {
    if (formData.client_id) {
      const client = clients.find(c => c.id === formData.client_id);
      return client?.business_name || "Cliente não encontrado";
    }
    return "Não Vinculada";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? "Editar Máquina" : "Detalhes da Máquina"}
            {showSerialAlert && (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados da máquina */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="serial_number">Número de Série</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    id="serial_number"
                    value={formData.serial_number}
                    onChange={(e) => handleSerialNumberChange(e.target.value)}
                  />
                  {showSerialAlert && (
                    <div className="flex items-center gap-2 p-2 border border-yellow-300 rounded-md bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">
                        ⚠️ Alterar o número de série é uma operação crítica!
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  {machine?.serial_number}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="model">Modelo</Label>
              {isEditing ? (
                <Select 
                  value={formData.model} 
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MACHINE_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  {machine?.model}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value as MachineStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MachineStatus.ACTIVE}>Ativa</SelectItem>
                    <SelectItem value={MachineStatus.STOCK}>Em Estoque</SelectItem>
                    <SelectItem value={MachineStatus.DEFECTIVE}>Defeito</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  {getStatusBadge(machine?.status as MachineStatus)}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="client">Cliente</Label>
              {isEditing ? (
                <Select 
                  value={formData.client_id || "none"} 
                  onValueChange={(value) => setFormData({ ...formData, client_id: value === "none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Não Vinculada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não Vinculada</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  {getClientName()}
                </div>
              )}
            </div>
          </div>

          {/* Histórico de notas */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Histórico de Notas</span>
                  <Button
                    size="sm"
                    onClick={() => setIsAddingNote(!isAddingNote)}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAddingNote && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Digite sua nota aqui..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setIsAddingNote(false);
                        setNewNote('');
                      }}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
                
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {notes.length > 0 ? (
                      notes.map((note) => (
                        <div key={note.id} className="p-3 border rounded-md bg-white">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <User className="h-3 w-3" />
                            <span>{note.user?.name || 'Usuário'}</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>
                              {format(new Date(note.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm">{note.note}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        Nenhuma nota registrada
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              {showSerialAlert ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Confirmação de Alteração Crítica
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Você está alterando o número de série da máquina de 
                        <strong> {machine?.serial_number} </strong> para 
                        <strong> {formData.serial_number}</strong>.
                        <br /><br />
                        Esta é uma operação crítica que pode afetar o rastreamento da máquina.
                        Tem certeza que deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                        Confirmar Alteração
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
