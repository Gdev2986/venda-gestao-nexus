
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link2, AlertCircle, Check } from "lucide-react";
import { TaxBlocksService, BlockWithRates } from "@/services/tax-blocks.service";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  business_name: string;
}

interface TaxBlockClientAssociationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TaxBlockClientAssociation = ({ isOpen, onClose, onSuccess }: TaxBlockClientAssociationProps) => {
  const [blocks, setBlocks] = useState<BlockWithRates[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carregar blocos
      const blocksData = await TaxBlocksService.getTaxBlocks();
      setBlocks(blocksData);

      // Carregar clientes ativos
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select('id, business_name')
        .eq('status', 'ACTIVE')
        .order('business_name');

      if (error) throw error;
      setClients(clientsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBlockId || !selectedClientId) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um bloco e um cliente",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await TaxBlocksService.associateBlockWithClient(selectedBlockId, selectedClientId);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Bloco de taxas vinculado ao cliente com sucesso"
        });
        onSuccess();
        handleClose();
      } else {
        throw new Error("Erro ao vincular bloco");
      }
    } catch (error) {
      console.error('Error associating block with client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível vincular o bloco ao cliente",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedBlockId("");
    setSelectedClientId("");
    onClose();
  };

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);
  const selectedClient = clients.find(client => client.id === selectedClientId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Vincular Bloco de Taxas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bloco de Taxas</label>
                <Select value={selectedBlockId} onValueChange={setSelectedBlockId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um bloco" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Cliente</label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBlock && selectedClient && (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    O bloco "{selectedBlock.name}" será vinculado ao cliente "{selectedClient.business_name}".
                  </AlertDescription>
                </Alert>
              )}

              {blocks.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum bloco de taxas disponível. Crie um bloco primeiro.
                  </AlertDescription>
                </Alert>
              )}

              {clients.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum cliente ativo encontrado.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedBlockId || !selectedClientId || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Vinculando...
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Vincular
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxBlockClientAssociation;
