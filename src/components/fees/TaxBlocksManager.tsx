
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Link, Settings, Loader2, AlertCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [associatingBlockId, setAssociatingBlockId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tax blocks
  const { 
    data: blocks = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
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
    mutationFn: async (block: { name: string; description: string | null }) => {
      // Create the tax block
      const createdBlock = await TaxBlocksService.createTaxBlock(block);
      if (!createdBlock) {
        throw new Error("Failed to create tax block");
      }
      
      // Verify the block was created
      const verified = await TaxBlocksService.verifyTaxBlockSave(createdBlock);
      if (!verified) {
        throw new Error("Tax block created but verification failed");
      }
      
      return createdBlock;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxBlocks'] });
      toast({
        title: "Bloco criado",
        description: "Bloco de taxas criado com sucesso",
      });
      setIsCreating(false);
      setSaveError(null);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setSaveError(`Erro ao criar bloco: ${errorMessage}`);
      toast({
        title: "Erro",
        description: `Erro ao criar bloco: ${errorMessage}`,
        variant: "destructive",
      });
    }
  });

  // Update tax block mutation
  const updateBlockMutation = useMutation({
    mutationFn: async ({ id, updates, rates }: { 
      id: string; 
      updates: Partial<BlockWithRates>;
      rates?: any[]
    }) => {
      console.log("Updating block:", id, updates);
      console.log("With rates:", rates);
      
      // Update the block info
      const updatedBlock = await TaxBlocksService.updateTaxBlock(id, updates);
      if (!updatedBlock) {
        throw new Error("Failed to update tax block");
      }
      
      // Then update the rates if they exist
      if (rates && rates.length > 0) {
        const ratesSaved = await TaxBlocksService.saveTaxRates(id, rates);
        if (!ratesSaved) {
          throw new Error("Failed to save tax rates");
        }
        
        // Verify everything was saved correctly
        const verified = await TaxBlocksService.verifyTaxBlockSave(updatedBlock);
        if (!verified) {
          throw new Error("Updates made but verification failed");
        }
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxBlocks'] });
      toast({
        title: "Bloco atualizado",
        description: "Bloco de taxas atualizado com sucesso",
      });
      setSelectedBlock(null);
      setSaveError(null);
      refetch(); // Force refetch to ensure we have the latest data
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setSaveError(`Erro ao atualizar bloco: ${errorMessage}`);
      toast({
        title: "Erro",
        description: `Erro ao atualizar bloco: ${errorMessage}`,
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
    if (!updatedBlock.id) {
      toast({
        title: "Erro",
        description: "ID do bloco não encontrado",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Saving updated block:", updatedBlock);
    
    // Extract rates to save
    const rates = updatedBlock.rates?.map(rate => ({
      payment_method: rate.payment_method,
      installment: rate.installment,
      root_rate: rate.root_rate,
      forwarding_rate: rate.forwarding_rate,
      final_rate: rate.final_rate
    }));
    
    // Update the block
    updateBlockMutation.mutate({ 
      id: updatedBlock.id, 
      updates: {
        name: updatedBlock.name,
        description: updatedBlock.description
      },
      rates
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    deleteBlockMutation.mutate(blockId);
  };

  const handleOpenAssociateDialog = (blockId: string) => {
    setAssociatingBlockId(blockId);
    setIsAssociating(true);
  };

  // Monitor save operations
  const isSaving = createBlockMutation.isPending || updateBlockMutation.isPending || deleteBlockMutation.isPending;

  // Clear error when dialog closes
  useEffect(() => {
    if (!isCreating && !selectedBlock) {
      setSaveError(null);
    }
  }, [isCreating, selectedBlock]);

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Erro ao carregar blocos de taxas. Por favor, tente novamente.
            {error instanceof Error ? `: ${error.message}` : ""}
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => refetch()}>
          Tentar novamente
        </Button>
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
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" disabled={isSaving}>
              {createBlockMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Criando...</>
              ) : (
                <><Plus className="h-4 w-4 mr-1" /> Novo Bloco</>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Bloco de Taxas</DialogTitle>
              {saveError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{saveError}</AlertDescription>
                </Alert>
              )}
            </DialogHeader>
            <TaxBlockEditor 
              onSave={handleCreateBlock} 
              onCancel={() => setIsCreating(false)} 
              isSubmitting={createBlockMutation.isPending}
            />
          </DialogContent>
        </Dialog>
          
        <Dialog open={isAssociating} onOpenChange={(open) => {
          setIsAssociating(open);
          if (!open) setAssociatingBlockId(null);
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {associatingBlockId 
                  ? `Associar Clientes ao Bloco: ${blocks.find(b => b.id === associatingBlockId)?.name || ''}`
                  : 'Associar Clientes a Blocos'}
              </DialogTitle>
            </DialogHeader>
            <TaxBlockClientAssociation 
              blocks={blocks} 
              selectedBlockId={associatingBlockId}
              onClose={() => {
                setIsAssociating(false);
                setAssociatingBlockId(null);
              }} 
            />
          </DialogContent>
        </Dialog>
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
                <div className="p-4 pt-2 flex flex-wrap gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAssociateDialog(block.id)}
                    disabled={isSaving}
                  >
                    <Link className="h-4 w-4 mr-1" /> Associar Clientes
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedBlock(block)}
                        disabled={isSaving}
                      >
                        <Settings className="h-4 w-4 mr-1" /> Configurar Taxas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Configurar Taxas - {block.name}</DialogTitle>
                        {saveError && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{saveError}</AlertDescription>
                          </Alert>
                        )}
                      </DialogHeader>
                      <TaxBlockEditor 
                        block={block} 
                        onSave={handleEditBlock} 
                        onCancel={() => setSelectedBlock(null)}
                        onDelete={() => handleDeleteBlock(block.id)}
                        isSubmitting={updateBlockMutation.isPending || deleteBlockMutation.isPending}
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
