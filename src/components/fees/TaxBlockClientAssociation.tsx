
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TaxBlocksService, BlockWithRates } from "@/services/tax-blocks.service";
import { supabase } from "@/integrations/supabase/client";
import TaxBlockTransferDialog from "./TaxBlockTransferDialog";

interface Client {
  id: string;
  business_name: string;
}

interface TaxBlockClientAssociationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TaxBlockClientAssociation = ({
  isOpen,
  onClose,
  onSuccess
}: TaxBlockClientAssociationProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [blocks, setBlocks] = useState<BlockWithRates[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [transferData, setTransferData] = useState<{
    clientId: string;
    clientName: string;
    currentBlock: { id: string; name: string };
    targetBlock: { id: string; name: string };
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Buscar todos os clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, business_name')
        .eq('status', 'ACTIVE')
        .order('business_name');

      if (clientsError) throw clientsError;

      // Buscar todos os blocos
      const blocksData = await TaxBlocksService.getTaxBlocks();

      setClients(clientsData || []);
      setBlocks(blocksData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssociate = async () => {
    if (!selectedClientId || !selectedBlockId) {
      toast({
        title: "Seleção obrigatória",
        description: "Por favor, selecione um cliente e um bloco",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await TaxBlocksService.associateBlockWithClient(
        selectedBlockId,
        selectedClientId
      );

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Cliente vinculado ao bloco com sucesso"
        });
        onSuccess();
        onClose();
        resetForm();
      } else if (result.requiresTransfer && result.currentBlock) {
        // Preparar dados para transferência
        const selectedClient = clients.find(c => c.id === selectedClientId);
        const selectedBlock = blocks.find(b => b.id === selectedBlockId);
        
        if (selectedClient && selectedBlock) {
          setTransferData({
            clientId: selectedClientId,
            clientName: selectedClient.business_name,
            currentBlock: result.currentBlock,
            targetBlock: { id: selectedBlockId, name: selectedBlock.name }
          });
          setShowTransferDialog(true);
        }
      } else {
        toast({
          title: "Atenção",
          description: result.message || "Não foi possível vincular o cliente",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error associating client with block:', error);
      toast({
        title: "Erro",
        description: "Não foi possível vincular o cliente ao bloco",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedClientId('');
    setSelectedBlockId('');
  };

  const handleTransferSuccess = () => {
    setShowTransferDialog(false);
    setTransferData(null);
    onSuccess();
    onClose();
    resetForm();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Cliente ao Bloco de Taxas</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="client-select">Cliente</Label>
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

            <div>
              <Label htmlFor="block-select">Bloco de Taxas</Label>
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

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={handleAssociate} disabled={isLoading}>
                {isLoading ? "Vinculando..." : "Vincular"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {transferData && (
        <TaxBlockTransferDialog
          isOpen={showTransferDialog}
          onClose={() => {
            setShowTransferDialog(false);
            setTransferData(null);
          }}
          onSuccess={handleTransferSuccess}
          clientId={transferData.clientId}
          clientName={transferData.clientName}
          currentBlock={transferData.currentBlock}
          targetBlock={transferData.targetBlock}
        />
      )}
    </>
  );
};

export default TaxBlockClientAssociation;
