
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface NewShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ClientOption {
  id: string;
  businessName: string;
  contactName: string;
  address: string;
}

const NewShipmentDialog = ({ open, onOpenChange }: NewShipmentDialogProps) => {
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [itemType, setItemType] = useState<string>("");
  const [itemDescription, setItemDescription] = useState("");
  const [notes, setNotes] = useState("");

  // Mock clients for autocomplete
  const clients: ClientOption[] = [
    {
      id: "1",
      businessName: "Empresa ABC Ltda",
      contactName: "João da Silva",
      address: "Rua das Flores, 123 - São Paulo, SP"
    },
    {
      id: "2",
      businessName: "Comércio XYZ",
      contactName: "Maria Santos",
      address: "Av. Principal, 456 - Rio de Janeiro, RJ"
    },
    {
      id: "3",
      businessName: "Loja 123",
      contactName: "Carlos Lima",
      address: "Rua do Comércio, 789 - Belo Horizonte, MG"
    }
  ];

  const filteredClients = clients.filter(client =>
    client.businessName.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.contactName.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      client: selectedClient,
      itemType,
      itemDescription,
      notes
    });
    onOpenChange(false);
    // Reset form
    setSelectedClient(null);
    setClientSearch("");
    setItemType("");
    setItemDescription("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Envio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            {selectedClient ? (
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                <div>
                  <div className="font-medium">{selectedClient.businessName}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedClient.contactName} • {selectedClient.address}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedClient(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="client"
                    placeholder="Buscar cliente..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {clientSearch && filteredClients.length > 0 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        className="w-full p-3 text-left hover:bg-muted/50 border-b last:border-b-0"
                        onClick={() => {
                          setSelectedClient(client);
                          setClientSearch("");
                        }}
                      >
                        <div className="font-medium">{client.businessName}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.contactName} • {client.address}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Item Type */}
          <div className="space-y-2">
            <Label htmlFor="itemType">Tipo de Item</Label>
            <Select value={itemType} onValueChange={setItemType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="machine">Máquina</SelectItem>
                <SelectItem value="bobina">Bobina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Item Description */}
          <div className="space-y-2">
            <Label htmlFor="itemDescription">Descrição do Item</Label>
            <Input
              id="itemDescription"
              placeholder="Ex: Terminal de Pagamento POS-X1"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais sobre o envio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedClient || !itemType || !itemDescription}
            >
              Criar Envio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewShipmentDialog;
