
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types for fees
interface Fee {
  id: string;
  name: string;
  pix: number;
  debit: number;
  credit: number;
  clientCount: number;
}

// Mock data for blocks
const initialBlocks: Fee[] = [
  { 
    id: "1", 
    name: "Padrão", 
    pix: 0.99, 
    debit: 1.5, 
    credit: 1.99,
    clientCount: 2
  },
  { 
    id: "2", 
    name: "Premium", 
    pix: 0.89, 
    debit: 1.4, 
    credit: 1.89,
    clientCount: 1
  },
  { 
    id: "3", 
    name: "Especial", 
    pix: 0.79, 
    debit: 1.3, 
    credit: 1.79,
    clientCount: 1
  }
];

// Mock data for clients
interface Client {
  id: string;
  name: string;
  email: string;
  blockId: string;
}

const mockClients: Client[] = [
  { id: "c1", name: "Empresa ABC Ltda", email: "contato@empresaabc.com", blockId: "1" },
  { id: "c2", name: "João Silva ME", email: "joao@jsilva.com", blockId: "1" },
  { id: "c3", name: "Maria Souza Consultoria", email: "maria@souzaconsultoria.com", blockId: "2" },
  { id: "c4", name: "Carlos Oliveira Tech", email: "carlos@oliveira.tech", blockId: "3" },
];

const Fees = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Fee[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<Fee | null>(null);
  const [selectedTab, setSelectedTab] = useState("pix");
  const [showNewBlockDialog, setShowNewBlockDialog] = useState(false);
  const [showEditFeeDialog, setShowEditFeeDialog] = useState(false);
  const [showAssociateClientsDialog, setShowAssociateClientsDialog] = useState(false);
  
  const [newBlock, setNewBlock] = useState({
    name: "",
    pix: 0.99,
    debit: 1.50,
    credit: 1.99
  });
  
  const [editFee, setEditFee] = useState({
    pix: 0,
    debit: 0,
    credit: 0
  });
  
  // Handle block creation
  const handleCreateBlock = () => {
    if (!newBlock.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do bloco é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    const newBlockWithId = {
      id: `block-${Date.now()}`,
      name: newBlock.name,
      pix: newBlock.pix,
      debit: newBlock.debit,
      credit: newBlock.credit,
      clientCount: 0
    };
    
    setBlocks([...blocks, newBlockWithId]);
    setShowNewBlockDialog(false);
    
    toast({
      title: "Bloco criado",
      description: `Bloco "${newBlock.name}" criado com sucesso.`
    });
    
    // Reset form
    setNewBlock({
      name: "",
      pix: 0.99,
      debit: 1.50,
      credit: 1.99
    });
  };
  
  // Handle fee update
  const handleUpdateFee = () => {
    if (!selectedBlock) return;
    
    setBlocks(blocks.map(block => 
      block.id === selectedBlock.id 
        ? { 
            ...block, 
            pix: editFee.pix,
            debit: editFee.debit,
            credit: editFee.credit
          } 
        : block
    ));
    
    setShowEditFeeDialog(false);
    
    toast({
      title: "Taxas atualizadas",
      description: `As taxas do bloco "${selectedBlock.name}" foram atualizadas com sucesso.`
    });
  };
  
  // Handle block deletion
  const handleDeleteBlock = (block: Fee) => {
    if (block.clientCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: `O bloco "${block.name}" tem ${block.clientCount} cliente(s) associado(s). Remova as associações primeiro.`,
        variant: "destructive"
      });
      return;
    }
    
    setBlocks(blocks.filter(b => b.id !== block.id));
    
    toast({
      title: "Bloco excluído",
      description: `Bloco "${block.name}" excluído com sucesso.`
    });
  };
  
  // Set edit fee values when dialog opens
  const openEditFeeDialog = (block: Fee) => {
    setSelectedBlock(block);
    setEditFee({
      pix: block.pix,
      debit: block.debit,
      credit: block.credit
    });
    setShowEditFeeDialog(true);
  };
  
  // Handle block selection
  const handleBlockSelect = (block: Fee) => {
    setSelectedBlock(block);
  };
  
  const getBlockClients = (blockId: string) => {
    return mockClients.filter(client => client.blockId === blockId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Taxas</h2>
        <Button onClick={() => setShowNewBlockDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Bloco de Taxas
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Blocos de Taxas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione um bloco para gerenciar suas taxas
            </p>
            <div className="space-y-2">
              {blocks.map((block) => (
                <div 
                  key={block.id} 
                  className={`p-4 rounded-md border cursor-pointer flex justify-between items-center ${
                    selectedBlock?.id === block.id ? 'bg-muted border-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => handleBlockSelect(block)}
                >
                  <div>
                    <h3 className="font-medium">{block.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {block.clientCount} cliente(s)
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBlock(block);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {selectedBlock ? (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gerenciar Taxas</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAssociateClientsDialog(true)}
                >
                  Associar Clientes
                </Button>
                <Button onClick={() => openEditFeeDialog(selectedBlock)}>
                  Adicionar Taxa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Bloco: {selectedBlock.name}
              </p>
              
              <Tabs defaultValue="pix" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pix">PIX</TabsTrigger>
                  <TabsTrigger value="debit">DÉBITO</TabsTrigger>
                  <TabsTrigger value="credit">CRÉDITO</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pix" className="mt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Base (%)</h3>
                      <p className="text-xl">{selectedBlock.pix.toFixed(2)}%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Parceiro (%)</h3>
                      <p className="text-xl">{(selectedBlock.pix * 1.5).toFixed(2)}%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Final (%)</h3>
                      <p className="text-xl">{(selectedBlock.pix * 2).toFixed(2)}%</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => openEditFeeDialog(selectedBlock)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="debit" className="mt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Base (%)</h3>
                      <p className="text-xl">{selectedBlock.debit.toFixed(2)}%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Parceiro (%)</h3>
                      <p className="text-xl">{(selectedBlock.debit * 1.5).toFixed(2)}%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Final (%)</h3>
                      <p className="text-xl">{(selectedBlock.debit * 2).toFixed(2)}%</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => openEditFeeDialog(selectedBlock)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="credit" className="mt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Base (%)</h3>
                      <p className="text-xl">{selectedBlock.credit.toFixed(2)}%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Parceiro (%)</h3>
                      <p className="text-xl">{(selectedBlock.credit * 1.5).toFixed(2)}%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Taxa Final (%)</h3>
                      <p className="text-xl">{(selectedBlock.credit * 2).toFixed(2)}%</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => openEditFeeDialog(selectedBlock)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              {getBlockClients(selectedBlock.id).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-4">Clientes associados</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getBlockClients(selectedBlock.id).map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Remover</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Selecione um bloco de taxas</h3>
                <p className="text-muted-foreground">
                  Escolha um bloco para gerenciar suas taxas ou crie um novo.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* New Block Dialog */}
      <Dialog open={showNewBlockDialog} onOpenChange={setShowNewBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Bloco de Taxas</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Nome do Bloco</Label>
              <Input 
                id="name" 
                value={newBlock.name} 
                onChange={(e) => setNewBlock({...newBlock, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pix">Taxa PIX (%)</Label>
                <Input 
                  id="pix" 
                  type="number" 
                  step="0.01"
                  value={newBlock.pix} 
                  onChange={(e) => setNewBlock({...newBlock, pix: parseFloat(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="debit">Taxa Débito (%)</Label>
                <Input 
                  id="debit" 
                  type="number" 
                  step="0.01"
                  value={newBlock.debit} 
                  onChange={(e) => setNewBlock({...newBlock, debit: parseFloat(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="credit">Taxa Crédito (%)</Label>
                <Input 
                  id="credit" 
                  type="number" 
                  step="0.01"
                  value={newBlock.credit} 
                  onChange={(e) => setNewBlock({...newBlock, credit: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewBlockDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBlock}>
              Criar Bloco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Fee Dialog */}
      <Dialog open={showEditFeeDialog} onOpenChange={setShowEditFeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Taxas</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-pix">Taxa PIX (%)</Label>
                <Input 
                  id="edit-pix" 
                  type="number" 
                  step="0.01"
                  value={editFee.pix} 
                  onChange={(e) => setEditFee({...editFee, pix: parseFloat(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-debit">Taxa Débito (%)</Label>
                <Input 
                  id="edit-debit" 
                  type="number" 
                  step="0.01"
                  value={editFee.debit} 
                  onChange={(e) => setEditFee({...editFee, debit: parseFloat(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-credit">Taxa Crédito (%)</Label>
                <Input 
                  id="edit-credit" 
                  type="number" 
                  step="0.01"
                  value={editFee.credit} 
                  onChange={(e) => setEditFee({...editFee, credit: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFeeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateFee}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Associate Clients Dialog */}
      <Dialog open={showAssociateClientsDialog} onOpenChange={setShowAssociateClientsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Associar Clientes ao Bloco</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input 
              placeholder="Pesquisar clientes..." 
              className="mb-4"
            />
            
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Bloco Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={client.blockId === selectedBlock?.id}
                        />
                      </TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        {blocks.find(b => b.id === client.blockId)?.name || "Nenhum"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssociateClientsDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setShowAssociateClientsDialog(false);
              toast({
                title: "Clientes associados",
                description: "Associação de clientes atualizada com sucesso."
              });
            }}>
              Salvar Associações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fees;
