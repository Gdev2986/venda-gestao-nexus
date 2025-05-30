
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertCircle, Link2 } from "lucide-react";
import { TaxBlocksService, BlockWithRates } from "@/services/tax-blocks.service";
import { useToast } from "@/hooks/use-toast";
import TaxBlockEditor from "./TaxBlockEditor";
import TaxBlockPreview from "./TaxBlockPreview";
import TaxBlockClientAssociation from "./TaxBlockClientAssociation";

const TaxBlocksManager = () => {
  const [blocks, setBlocks] = useState<BlockWithRates[]>([]);
  const [editingBlock, setEditingBlock] = useState<BlockWithRates | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssociationModal, setShowAssociationModal] = useState(false);
  const { toast } = useToast();

  const loadBlocks = async () => {
    setIsLoading(true);
    try {
      const data = await TaxBlocksService.getTaxBlocks();
      setBlocks(data);
    } catch (error) {
      console.error('Error loading tax blocks:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os blocos de taxas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const handleCreateNew = () => {
    setEditingBlock(null);
    setIsCreating(true);
  };

  const handleEdit = (block: BlockWithRates) => {
    setEditingBlock(block);
    setIsCreating(true);
  };

  const handleSave = async (blockData: BlockWithRates) => {
    setIsSubmitting(true);
    try {
      let savedBlock: any = null;
      
      if (editingBlock) {
        // Updating existing block
        savedBlock = await TaxBlocksService.updateTaxBlock(editingBlock.id, {
          name: blockData.name,
          description: blockData.description
        });
      } else {
        // Creating new block
        savedBlock = await TaxBlocksService.createTaxBlock({
          name: blockData.name,
          description: blockData.description
        });
      }

      if (savedBlock) {
        // Save rates if provided
        if (blockData.rates && blockData.rates.length > 0) {
          const validRates = blockData.rates.filter(rate => 
            rate.final_rate > 0 || rate.root_rate > 0 || rate.forwarding_rate > 0
          );
          
          if (validRates.length > 0) {
            const ratesSuccess = await TaxBlocksService.saveTaxRates(savedBlock.id, validRates);
            if (!ratesSuccess) {
              throw new Error("Erro ao salvar as taxas");
            }
          }
        }

        toast({
          title: "Sucesso",
          description: editingBlock ? "Bloco de taxas atualizado com sucesso" : "Bloco de taxas criado com sucesso"
        });

        await loadBlocks();
        setIsCreating(false);
        setEditingBlock(null);
      } else {
        throw new Error("Erro ao salvar o bloco");
      }
    } catch (error) {
      console.error('Error saving tax block:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o bloco de taxas",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await TaxBlocksService.deleteTaxBlock(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Bloco de taxas excluído com sucesso"
        });
        await loadBlocks();
        setIsCreating(false);
        setEditingBlock(null);
      } else {
        throw new Error("Erro ao excluir o bloco");
      }
    } catch (error) {
      console.error('Error deleting tax block:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o bloco de taxas",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingBlock(null);
  };

  const handleAssociationSuccess = () => {
    toast({
      title: "Sucesso",
      description: "Bloco vinculado ao cliente com sucesso"
    });
    loadBlocks();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Carregando blocos de taxas...</span>
      </div>
    );
  }

  if (isCreating) {
    return (
      <TaxBlockEditor
        block={editingBlock}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={editingBlock ? handleDelete : undefined}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Blocos de Taxas</h2>
          <p className="text-muted-foreground">Configure os blocos de taxas para diferentes clientes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAssociationModal(true)} variant="outline">
            <Link2 className="h-4 w-4 mr-2" />
            Vincular Bloco
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Bloco
          </Button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhum bloco de taxas configurado. Clique em "Novo Bloco" para começar.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blocks.map((block) => (
            <TaxBlockPreview
              key={block.id}
              block={block}
              onEdit={() => handleEdit(block)}
            />
          ))}
        </div>
      )}

      <TaxBlockClientAssociation
        isOpen={showAssociationModal}
        onClose={() => setShowAssociationModal(false)}
        onSuccess={handleAssociationSuccess}
      />
    </div>
  );
};

export default TaxBlocksManager;
