
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Machine, MachineStatus } from '@/types/machine.types';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

interface MachineDetailsDialogProps {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MachineDetailsDialog: React.FC<MachineDetailsDialogProps> = ({
  machine,
  open,
  onOpenChange,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!machine) return null;

  const getStatusColor = (status: MachineStatus) => {
    const colors = {
      [MachineStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [MachineStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
      [MachineStatus.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
      [MachineStatus.BLOCKED]: 'bg-red-100 text-red-800',
      [MachineStatus.STOCK]: 'bg-blue-100 text-blue-800',
      [MachineStatus.TRANSIT]: 'bg-purple-100 text-purple-800',
      [MachineStatus.DEFECTIVE]: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsAddingNote(true);
    try {
      // Here you would normally call the API to add the note
      // For now, we'll just clear the form
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Detalhes da Máquina</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {/* Machine Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Número de Série:</span>
                    <span className="ml-2">{machine.serial_number}</span>
                  </div>
                  <div>
                    <span className="font-medium">Modelo:</span>
                    <span className="ml-2">{machine.model}</span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className={`ml-2 ${getStatusColor(machine.status)}`}>
                      {machine.status}
                    </Badge>
                  </div>
                  {machine.client && (
                    <div>
                      <span className="font-medium">Cliente:</span>
                      <span className="ml-2">{machine.client.business_name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Datas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {machine.created_at && (
                    <div>
                      <span className="font-medium">Criado em:</span>
                      <span className="ml-2">{formatDate(machine.created_at)}</span>
                    </div>
                  )}
                  {machine.updated_at && (
                    <div>
                      <span className="font-medium">Atualizado em:</span>
                      <span className="ml-2">{formatDate(machine.updated_at)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                {machine.notes ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{machine.notes}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma observação registrada.</p>
                )}
                
                {/* Add new note */}
                <div className="mt-4 space-y-2">
                  <Textarea
                    placeholder="Adicionar nova observação..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button 
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isAddingNote}
                    size="sm"
                  >
                    {isAddingNote ? 'Adicionando...' : 'Adicionar Observação'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
