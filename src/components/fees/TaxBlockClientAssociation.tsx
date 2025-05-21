
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BlockWithRates, TaxBlocksService } from "@/services/tax-blocks.service";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

type TaxBlockClientAssociationProps = {
  blocks: BlockWithRates[];
  onClose: () => void;
};

const TaxBlockClientAssociation = ({ blocks, onClose }: TaxBlockClientAssociationProps) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"assign" | "view">("assign");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch clients without tax block associations
  const { data: clientsWithoutBlock = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clientsWithoutTaxBlock'],
    queryFn: () => TaxBlocksService.getClientsWithoutTaxBlock(),
    enabled: activeTab === "assign"
  });

  // Fetch existing client-block associations
  const { data: associations = [], isLoading: isLoadingAssociations } = useQuery({
    queryKey: ['clientTaxBlockAssociations'],
    queryFn: () => TaxBlocksService.getClientTaxBlockAssociations(),
    enabled: activeTab === "view"
  });

  // Filter associations based on search term
  const filteredAssociations = associations.filter(assoc => 
    assoc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    assoc.blockName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Associate block with client mutation
  const associateMutation = useMutation({
    mutationFn: ({ blockId, clientId }: { blockId: string; clientId: string }) => 
      TaxBlocksService.associateBlockWithClient(blockId, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientsWithoutTaxBlock'] });
      queryClient.invalidateQueries({ queryKey: ['clientTaxBlockAssociations'] });
      toast({
        title: "Associação realizada",
        description: "Cliente associado ao bloco de taxas com sucesso",
      });
      setSelectedClient("");
      setSelectedBlock("");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao associar cliente: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleAssociate = () => {
    if (!selectedClient || !selectedBlock) {
      toast({
        title: "Seleção necessária",
        description: "Selecione um cliente e um bloco de taxas",
        variant: "destructive",
      });
      return;
    }

    associateMutation.mutate({ blockId: selectedBlock, clientId: selectedClient });
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "assign" | "view")}>
        <TabsList className="mb-4">
          <TabsTrigger value="assign">Associar Cliente</TabsTrigger>
          <TabsTrigger value="view">Visualizar Associações</TabsTrigger>
        </TabsList>

        <TabsContent value="assign">
          <div className="space-y-4">
            <div>
              <Label htmlFor="client-select">Cliente</Label>
              <Select
                value={selectedClient}
                onValueChange={setSelectedClient}
                disabled={isLoadingClients || associateMutation.isPending}
              >
                <SelectTrigger id="client-select" className="mt-1">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientsWithoutBlock.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="block-select">Bloco de Taxas</Label>
              <Select
                value={selectedBlock}
                onValueChange={setSelectedBlock}
                disabled={associateMutation.isPending}
              >
                <SelectTrigger id="block-select" className="mt-1">
                  <SelectValue placeholder="Selecione um bloco de taxas" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={onClose} disabled={associateMutation.isPending}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAssociate} 
                disabled={!selectedClient || !selectedBlock || associateMutation.isPending}
              >
                {associateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Associar
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="view">
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Buscar associações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
            </div>

            {isLoadingAssociations ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Carregando associações...</span>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Bloco de Taxas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssociations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-6">
                          {searchTerm 
                            ? "Nenhuma associação corresponde à sua pesquisa." 
                            : "Nenhuma associação encontrada."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssociations.map((assoc, index) => (
                        <TableRow key={index}>
                          <TableCell>{assoc.clientName}</TableCell>
                          <TableCell>{assoc.blockName}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxBlockClientAssociation;
