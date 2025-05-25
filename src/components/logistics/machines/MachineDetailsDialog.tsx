
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Machine, MachineStatus } from "@/types/machine.types";
import { toast } from "sonner";

interface MachineDetailsDialogProps {
  machine: Machine | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Machine>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const MachineDetailsDialog: React.FC<MachineDetailsDialogProps> = ({
  machine,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Machine>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      serial_number: machine?.serial_number,
      model: machine?.model,
      status: machine?.status,
      notes: machine?.notes
    });
  };

  const handleSave = async () => {
    if (!machine) return;
    
    try {
      await onUpdate(machine.id, editData);
      toast("Máquina atualizada com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast("Erro ao atualizar máquina");
    }
  };

  const handleDelete = async () => {
    if (!machine) return;
    
    try {
      await onDelete(machine.id);
      toast("Máquina removida com sucesso!");
      onClose();
    } catch (error) {
      toast("Erro ao remover máquina");
    }
  };

  const handleStatusChange = async (newStatus: MachineStatus) => {
    if (!machine) return;
    
    try {
      await onUpdate(machine.id, { status: newStatus });
      toast("Status da máquina atualizado!");
    } catch (error) {
      toast("Erro ao atualizar status");
    }
  };

  if (!machine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Máquina</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isEditing ? (
            <>
              <Input
                value={editData.serial_number || ''}
                onChange={(e) => setEditData({...editData, serial_number: e.target.value})}
                placeholder="Número de série"
              />
              <Input
                value={editData.model || ''}
                onChange={(e) => setEditData({...editData, model: e.target.value})}
                placeholder="Modelo"
              />
              <Textarea
                value={editData.notes || ''}
                onChange={(e) => setEditData({...editData, notes: e.target.value})}
                placeholder="Observações"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave}>Salvar</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>Série:</strong> {machine.serial_number}
              </div>
              <div>
                <strong>Modelo:</strong> {machine.model}
              </div>
              <div>
                <strong>Status:</strong> {machine.status}
              </div>
              {machine.notes && (
                <div>
                  <strong>Observações:</strong> {machine.notes}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleEdit}>Editar</Button>
                <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
