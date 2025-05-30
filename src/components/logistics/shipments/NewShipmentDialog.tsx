
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useShipments } from "@/hooks/use-shipments";
import { useClients } from "@/hooks/use-clients";
import { CreateShipmentData } from "@/types/shipment.types";
import { Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NewShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewShipmentDialog = ({ open, onOpenChange }: NewShipmentDialogProps) => {
  const { createShipment } = useShipments();
  const { clients, loading: clientsLoading } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateShipmentData>({
    client_id: '',
    item_type: 'machine',
    item_description: '',
    tracking_code: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_id || !formData.item_description) {
      return;
    }

    setIsSubmitting(true);
    
    const shipment = await createShipment({
      client_id: formData.client_id,
      item_type: formData.item_type,
      item_description: formData.item_description,
      tracking_code: formData.tracking_code || undefined,
      notes: formData.notes || undefined
    });

    if (shipment) {
      onOpenChange(false);
      setFormData({
        client_id: '',
        item_type: 'machine',
        item_description: '',
        tracking_code: '',
        notes: ''
      });
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData({
      client_id: '',
      item_type: 'machine',
      item_description: '',
      tracking_code: '',
      notes: ''
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Novo Envio
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Dados do Envio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsLoading ? (
                        <SelectItem value="loading" disabled>Carregando clientes...</SelectItem>
                      ) : (
                        clients?.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.business_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item_type">Tipo de Item *</Label>
                  <Select
                    value={formData.item_type}
                    onValueChange={(value: 'machine' | 'bobina' | 'other') => 
                      setFormData(prev => ({ ...prev, item_type: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="machine">Máquina</SelectItem>
                      <SelectItem value="bobina">Bobina</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tracking_code">Código de Rastreamento</Label>
                  <Input
                    id="tracking_code"
                    value={formData.tracking_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, tracking_code: e.target.value }))}
                    placeholder="Ex: BR123456789"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_description">Descrição do Item *</Label>
                <Input
                  id="item_description"
                  value={formData.item_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, item_description: e.target.value }))}
                  placeholder="Ex: Terminal POS-X1, Bobina 80mm, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações adicionais sobre o envio..."
                  rows={3}
                />
              </div>

              <DialogFooter className="sm:justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.client_id || !formData.item_description}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Envio
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default NewShipmentDialog;
