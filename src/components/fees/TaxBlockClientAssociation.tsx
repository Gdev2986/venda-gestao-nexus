
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

// Mock clients data
const mockClients = [
  { id: "1", name: "Cliente Premium", blockId: "2" },
  { id: "2", name: "Cliente Padrão", blockId: "1" },
  { id: "3", name: "Cliente Novo", blockId: "3" },
  { id: "4", name: "Cliente A", blockId: null },
  { id: "5", name: "Cliente B", blockId: null },
  { id: "6", name: "Cliente C", blockId: null },
];

type TaxBlockClientAssociationProps = {
  blocks: { id: string; name: string; description: string }[];
  onClose: () => void;
};

const TaxBlockClientAssociation = ({ blocks, onClose }: TaxBlockClientAssociationProps) => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyAssigned, setOnlyAssigned] = useState(false);
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);

  // Filter clients based on search and filters
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (onlyAssigned && !client.blockId) return false;
    if (onlyUnassigned && client.blockId) return false;
    
    return matchesSearch;
  });

  // Update client block association
  const updateClientBlock = (clientId: string, blockId: string | null) => {
    setClients(
      clients.map(client =>
        client.id === clientId ? { ...client, blockId } : client
      )
    );
  };

  const handleSaveChanges = () => {
    console.log("Saving client-block associations:", clients);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <span className="absolute left-3 top-2.5 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="filter-assigned" 
              checked={onlyAssigned} 
              onCheckedChange={(checked) => {
                setOnlyAssigned(checked);
                if (checked) setOnlyUnassigned(false);
              }}
            />
            <Label htmlFor="filter-assigned">Somente com bloco</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="filter-unassigned" 
              checked={onlyUnassigned} 
              onCheckedChange={(checked) => {
                setOnlyUnassigned(checked);
                if (checked) setOnlyAssigned(false);
              }}
            />
            <Label htmlFor="filter-unassigned">Somente sem bloco</Label>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Bloco de Taxas</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>
                  <Select
                    value={client.blockId || ""}
                    onValueChange={(value) => updateClientBlock(client.id, value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar bloco..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum bloco</SelectItem>
                      {blocks.map((block) => (
                        <SelectItem key={block.id} value={block.id}>
                          {block.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateClientBlock(client.id, null)}
                      disabled={!client.blockId}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSaveChanges}>
          Salvar Associações
        </Button>
      </div>
    </div>
  );
};

export default TaxBlockClientAssociation;
