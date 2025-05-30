
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { StyledCard } from "@/components/ui/styled-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Settings, Percent, Link, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaxBlocksService } from "@/services/tax-blocks.service";
import { supabase } from "@/integrations/supabase/client";

interface TaxBlock {
  id: string;
  name: string;
  description?: string;
  rates?: TaxRate[];
}

interface TaxRate {
  id: string;
  payment_method: string;
  installment: number;
  final_rate: number;
}

interface Client {
  id: string;
  business_name: string;
  contact_name: string;
  status: string;
}

const TaxBlocksManager = () => {
  const [taxBlocks, setTaxBlocks] = useState<TaxBlock[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<TaxBlock | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockDescription, setNewBlockDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const { toast } = useToast();

  const fetchTaxBlocks = async () => {
    try {
      const blocks = await TaxBlocksService.getTaxBlocks();
      setTaxBlocks(blocks);
    } catch (error) {
      console.error('Error fetching tax blocks:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar blocos de taxa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name, contact_name, status')
        .eq('status', 'ACTIVE')
        .order('business_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTaxBlocks();
    fetchClients();
  }, []);

  const handleCreateBlock = async () => {
    try {
      await TaxBlocksService.createTaxBlock(newBlockName, newBlockDescription);
      toast({
        title: "Bloco criado",
        description: "Bloco de taxa criado com sucesso"
      });
      setIsCreateDialogOpen(false);
      setNewBlockName("");
      setNewBlockDescription("");
      fetchTaxBlocks();
    } catch (error) {
      console.error('Error creating tax block:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar bloco de taxa",
        variant: "destructive"
      });
    }
  };

  const handleLinkClient = async () => {
    if (!selectedBlock || !selectedClientId) return;

    try {
      const { error } = await supabase
        .from('client_tax_blocks')
        .insert({
          client_id: selectedClientId,
          block_id: selectedBlock.id
        });

      if (error) throw error;

      toast({
        title: "Cliente vinculado",
        description: "Cliente vinculado ao bloco de taxa com sucesso"
      });
      setIsLinkDialogOpen(false);
      setSelectedClientId("");
    } catch (error) {
      console.error('Error linking client:', error);
      toast({
        title: "Erro",
        description: "Erro ao vincular cliente ao bloco de taxa",
        variant: "destructive"
      });
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'PIX': return 'PIX';
      case 'CREDIT': return 'Crédito';
      case 'DEBIT': return 'Débito';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Blocos de Taxas</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Bloco
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Bloco de Taxa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="block-name">Nome do Bloco</Label>
                <Input
                  id="block-name"
                  value={newBlockName}
                  onChange={(e) => setNewBlockName(e.target.value)}
                  placeholder="Ex: Teste 1"
                />
              </div>
              <div>
                <Label htmlFor="block-description">Descrição</Label>
                <Textarea
                  id="block-description"
                  value={newBlockDescription}
                  onChange={(e) => setNewBlockDescription(e.target.value)}
                  placeholder="Descrição do bloco..."
                />
              </div>
              <Button onClick={handleCreateBlock} disabled={!newBlockName.trim()}>
                Criar Bloco
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando blocos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxBlocks.map((block) => (
            <StyledCard key={block.id} borderColor="border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg truncate">{block.name}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBlock(block);
                        setIsLinkDialogOpen(true);
                      }}
                      title="Vincular Cliente"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Configurar Taxas"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {block.description && (
                  <p className="text-sm text-muted-foreground mb-3">{block.description}</p>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Taxas ({block.rates?.length || 0})
                  </h4>
                  {block.rates?.length ? (
                    <div className="space-y-1">
                      {block.rates.slice(0, 3).map((rate) => (
                        <div key={rate.id} className="flex justify-between items-center text-sm">
                          <span>
                            {getPaymentMethodName(rate.payment_method)}
                            {rate.installment > 1 ? ` (${rate.installment}x)` : ''}
                          </span>
                          <Badge variant="outline">
                            {rate.final_rate.toFixed(2)}%
                          </Badge>
                        </div>
                      ))}
                      {block.rates.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{block.rates.length - 3} mais taxas
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">Nenhuma taxa configurada</p>
                      <Button variant="outline" size="sm">
                        Configurar Taxas
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </StyledCard>
          ))}
        </div>
      )}

      {/* Dialog para vincular cliente */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Vincular Cliente ao Bloco: {selectedBlock?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="client-select">Cliente</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name || client.contact_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleLinkClient} 
              disabled={!selectedClientId}
              className="w-full"
            >
              <Link className="h-4 w-4 mr-2" />
              Vincular Cliente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxBlocksManager;
