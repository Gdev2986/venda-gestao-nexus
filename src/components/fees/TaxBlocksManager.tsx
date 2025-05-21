
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Link, Settings, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import TaxBlockEditor from "./TaxBlockEditor";
import TaxBlockClientAssociation from "./TaxBlockClientAssociation";
import { TaxBlocksService, BlockWithRates } from "@/services/tax-blocks.service";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const TaxBlocksManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<BlockWithRates | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAssociating, setIsAssociating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tax blocks
  const { data: blocks = [], isLoading, error } = useQuery({
    queryKey: ['taxBlocks'],
    queryFn: () => TaxBlocksService.getTaxBlocks()
  });

  // Filter blocks based on search term
  const filteredBlocks = blocks.filter(block => 
    block.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (block.description && block.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Create tax block mutation
  const createBlockMutation = useMutation({
    mutationFn: (block: { name: string; description: string | null }) => 
      TaxBlocksService.createTaxBlock(block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxBlocks'] });
      toast({
        title: "Bloco criado",
        description: "Bloco de taxas criado com sucesso",
      });
      setIsCreating(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao criar bloco: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Update tax block mutation
  const updateBlockMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BlockWithRates> }) =>
      TaxBlocksService.updateTaxBlock(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxBlocks'] });
      toast({
        title: "Bloco atualizado",
        description: "Bloco de taxas atualizado com sucesso",
      });
      setSelectedBlock(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao atualizar bloco: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Delete tax block mutation
  const deleteBlockMutation = useMutation({
    mutationFn: (id: string) => TaxBlocksService.deleteTaxBlock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxBlocks'] });
      toast({
        title: "Bloco excluído",
        description: "Bloco de taxas excluído com sucesso",
      });
      setSelectedBlock(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao excluir bloco: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleCreateBlock = (newBlock: { name: string; description: string | null }) => {
    createBlockMutation.mutate(newBlock);
  };

  const handleEditBlock = (updatedBlock: BlockWithRates) => {
    if (!updatedBlock.id) return;
    
    // First update the block info
    updateBlockMutation.mutate({ 
      id: updatedBlock.id, 
      updates: {
        name: updatedBlock.name,
        description: updatedBlock.description
      }
    });
    
    // Then update the rates if they exist
    if (updatedBlock.rates && updatedBlock.rates.length > 0) {
      const ratesToSave = updatedBlock.rates.map(rate => ({
        payment_method: rate.payment_method,
        installment: rate.installment,
        root_rate: rate.root_rate,
        forwarding_rate: rate.forwarding_rate,
        final_rate: rate.final_rate
      }));
      
      TaxBlocksService.saveTaxRates(updatedBlock.id, ratesToSave)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['taxBlocks'] });
        })
        .catch(error => {
          toast({
            title: "Erro",
            description: `Erro ao salvar taxas: ${error}`,
            variant: "destructive",
          });
        });
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    deleteBlockMutation.mutate(blockId);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erro ao carregar blocos de taxas. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Buscar blocos de taxa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <span className="absolute left-3 top-2.5 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-1" /> Novo Bloco
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Bloco de Taxas</DialogTitle>
              </DialogHeader>
              <TaxBlockEditor 
                onSave={handleCreateBlock} 
                onCancel={() => setIsCreating(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAssociating} onOpenChange={setIsAssociating}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Link className="h-4 w-4 mr-1" /> Associar Clientes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Associar Blocos a Clientes</DialogTitle>
              </DialogHeader>
              <TaxBlockClientAssociation 
                blocks={blocks} 
                onClose={() => setIsAssociating(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando blocos de taxas...</span>
        </div>
      ) : filteredBlocks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {searchTerm ? 
              "Nenhum bloco de taxa corresponde à sua pesquisa." : 
              "Nenhum bloco de taxa cadastrado. Clique em 'Novo Bloco' para criar."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlocks.map((block) => (
            <Card key={block.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-muted p-4">
                  <h3 className="font-semibold text-lg">{block.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{block.description}</p>
                </div>
                <div className="p-4 pt-2 flex gap-2 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedBlock(block)}
                      >
                        <Settings className="h-4 w-4 mr-1" /> Configurar Taxas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Configurar Taxas - {block.name}</DialogTitle>
                      </DialogHeader>
                      <TaxBlockEditor 
                        block={block} 
                        onSave={handleEditBlock} 
                        onCancel={() => setSelectedBlock(null)}
                        onDelete={() => handleDeleteBlock(block.id)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaxBlocksManager;
