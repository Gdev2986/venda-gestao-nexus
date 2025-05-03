
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, Settings2Icon, Trash2Icon } from "lucide-react";

// Define fee types for different payment methods
const PAYMENT_TYPES = ["PIX", "DÉBITO", "CRÉDITO"];
const INSTALLMENT_OPTIONS = Array.from({ length: 21 }, (_, i) => i + 1); // 1 to 21

interface FeeBlock {
  id: string;
  name: string;
  color: string;
  fees: Fee[];
  clients: string[];
}

interface Fee {
  id: string;
  paymentMethod: string;
  installments: number;
  baseRate: number;
  partnerRate: number;
  finalRate: number;
}

interface Client {
  id: string;
  business_name: string;
}

const FEE_BLOCK_COLORS = [
  { name: "Padrão", value: "blue" },
  { name: "Verde", value: "green" },
  { name: "Vermelho", value: "red" },
  { name: "Amarelo", value: "yellow" },
  { name: "Roxo", value: "purple" },
];

const Fees = () => {
  const [feeBlocks, setFeeBlocks] = useState<FeeBlock[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PIX");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showAssignClientsDialog, setShowAssignClientsDialog] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [editingBlock, setEditingBlock] = useState<FeeBlock | null>(null);
  
  const [newFee, setNewFee] = useState({
    paymentMethod: "PIX",
    installments: 1,
    baseRate: 0,
    partnerRate: 0,
    finalRate: 0,
  });

  const [newBlock, setNewBlock] = useState({
    name: "",
    color: "blue",
  });

  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchFeeBlocks();
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Mock clients data
      setClients([
        { id: "1", business_name: "Empresa A" },
        { id: "2", business_name: "Empresa B" },
        { id: "3", business_name: "Empresa C" },
        { id: "4", business_name: "Empresa D" },
      ]);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  const fetchFeeBlocks = async () => {
    setIsLoading(true);
    
    try {
      // This is mock data since we don't have the actual table yet
      const mockFeeBlocks: FeeBlock[] = [
        {
          id: "1",
          name: "Padrão",
          color: "blue",
          clients: ["1", "4"],
          fees: [
            { id: "1", paymentMethod: "PIX", installments: 1, baseRate: 0.99, partnerRate: 1.5, finalRate: 1.99 },
            { id: "2", paymentMethod: "DÉBITO", installments: 1, baseRate: 1.5, partnerRate: 2.0, finalRate: 2.5 },
            { id: "3", paymentMethod: "CRÉDITO", installments: 1, baseRate: 2.0, partnerRate: 2.8, finalRate: 3.5 },
            { id: "4", paymentMethod: "CRÉDITO", installments: 2, baseRate: 3.0, partnerRate: 4.0, finalRate: 5.0 },
          ]
        },
        {
          id: "2",
          name: "Premium",
          color: "green",
          clients: ["2"],
          fees: [
            { id: "5", paymentMethod: "PIX", installments: 1, baseRate: 0.8, partnerRate: 1.2, finalRate: 1.5 },
            { id: "6", paymentMethod: "DÉBITO", installments: 1, baseRate: 1.2, partnerRate: 1.7, finalRate: 2.0 },
            { id: "7", paymentMethod: "CRÉDITO", installments: 1, baseRate: 1.8, partnerRate: 2.5, finalRate: 3.0 },
            { id: "8", paymentMethod: "CRÉDITO", installments: 2, baseRate: 2.5, partnerRate: 3.5, finalRate: 4.0 },
          ]
        },
        {
          id: "3",
          name: "Especial",
          color: "purple",
          clients: ["3"],
          fees: [
            { id: "9", paymentMethod: "PIX", installments: 1, baseRate: 0.9, partnerRate: 1.3, finalRate: 1.8 },
            { id: "10", paymentMethod: "DÉBITO", installments: 1, baseRate: 1.3, partnerRate: 1.8, finalRate: 2.2 },
          ]
        }
      ];
      
      setFeeBlocks(mockFeeBlocks);
      if (mockFeeBlocks.length > 0) {
        setSelectedBlock(mockFeeBlocks[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar taxas:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar taxas",
        description: "Não foi possível carregar as taxas de pagamento.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFee = () => {
    if (!selectedBlock) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar taxa",
        description: "Selecione um bloco de taxas primeiro.",
      });
      return;
    }

    const blockToUpdate = feeBlocks.find(block => block.id === selectedBlock);
    if (!blockToUpdate) return;

    if (editingFee) {
      // Update existing fee
      const updatedBlocks = feeBlocks.map(block => {
        if (block.id === selectedBlock) {
          return {
            ...block,
            fees: block.fees.map(f => f.id === editingFee.id ? { ...newFee, id: editingFee.id } : f)
          };
        }
        return block;
      });
      
      setFeeBlocks(updatedBlocks);
      toast({
        title: "Taxa atualizada",
        description: "A taxa foi atualizada com sucesso.",
      });
    } else {
      // Add new fee
      const newId = Math.random().toString();
      
      const updatedBlocks = feeBlocks.map(block => {
        if (block.id === selectedBlock) {
          return {
            ...block,
            fees: [...block.fees, { ...newFee, id: newId }]
          };
        }
        return block;
      });
      
      setFeeBlocks(updatedBlocks);
      toast({
        title: "Taxa adicionada",
        description: "A nova taxa foi adicionada com sucesso.",
      });
    }
    
    setShowAddFeeDialog(false);
    setEditingFee(null);
    resetNewFee();
  };

  const handleAddBlock = () => {
    if (!newBlock.name.trim()) {
      toast({
        variant: "destructive",
        title: "Nome inválido",
        description: "O bloco de taxas precisa ter um nome.",
      });
      return;
    }

    if (editingBlock) {
      // Update existing block
      const updatedBlocks = feeBlocks.map(block => 
        block.id === editingBlock.id ? { 
          ...block, 
          name: newBlock.name, 
          color: newBlock.color 
        } : block
      );
      
      setFeeBlocks(updatedBlocks);
      toast({
        title: "Bloco atualizado",
        description: "O bloco de taxas foi atualizado com sucesso.",
      });
    } else {
      // Add new block
      const newId = Math.random().toString();
      
      setFeeBlocks([
        ...feeBlocks,
        {
          id: newId,
          name: newBlock.name,
          color: newBlock.color,
          fees: [],
          clients: []
        }
      ]);
      
      setSelectedBlock(newId);
      
      toast({
        title: "Bloco adicionado",
        description: "O novo bloco de taxas foi adicionado com sucesso.",
      });
    }
    
    setShowBlockDialog(false);
    setEditingBlock(null);
    setNewBlock({ name: "", color: "blue" });
  };

  const handleAssignClients = () => {
    if (!selectedBlock) return;
    
    const updatedBlocks = feeBlocks.map(block => {
      if (block.id === selectedBlock) {
        return { ...block, clients: selectedClients };
      }
      return block;
    });
    
    setFeeBlocks(updatedBlocks);
    setShowAssignClientsDialog(false);
    
    toast({
      title: "Clientes associados",
      description: "Os clientes foram associados ao bloco com sucesso.",
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este bloco de taxas?")) {
      const updatedBlocks = feeBlocks.filter(block => block.id !== blockId);
      setFeeBlocks(updatedBlocks);
      
      if (updatedBlocks.length > 0) {
        setSelectedBlock(updatedBlocks[0].id);
      } else {
        setSelectedBlock(null);
      }
      
      toast({
        title: "Bloco removido",
        description: "O bloco de taxas foi removido com sucesso.",
      });
    }
  };

  const handleEditFee = (fee: Fee) => {
    setEditingFee(fee);
    setNewFee({
      paymentMethod: fee.paymentMethod,
      installments: fee.installments,
      baseRate: fee.baseRate,
      partnerRate: fee.partnerRate,
      finalRate: fee.finalRate,
    });
    setShowAddFeeDialog(true);
  };

  const handleEditBlock = (block: FeeBlock) => {
    setEditingBlock(block);
    setNewBlock({
      name: block.name,
      color: block.color,
    });
    setShowBlockDialog(true);
  };

  const handleRemoveFee = (feeId: string) => {
    if (selectedBlock && window.confirm("Tem certeza que deseja excluir esta taxa?")) {
      const updatedBlocks = feeBlocks.map(block => {
        if (block.id === selectedBlock) {
          return {
            ...block,
            fees: block.fees.filter(fee => fee.id !== feeId)
          };
        }
        return block;
      });
      
      setFeeBlocks(updatedBlocks);
      toast({
        title: "Taxa removida",
        description: "A taxa foi removida com sucesso.",
      });
    }
  };

  const openAssignClientsDialog = () => {
    if (!selectedBlock) return;
    
    const currentBlock = feeBlocks.find(block => block.id === selectedBlock);
    if (currentBlock) {
      setSelectedClients([...currentBlock.clients]);
    } else {
      setSelectedClients([]);
    }
    
    setShowAssignClientsDialog(true);
  };

  const toggleClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const resetNewFee = () => {
    setNewFee({
      paymentMethod: activeTab,
      installments: activeTab === "CRÉDITO" ? 1 : 1,
      baseRate: 0,
      partnerRate: 0,
      finalRate: 0,
    });
  };

  const getSelectedBlockFees = () => {
    if (!selectedBlock) return [];
    
    const block = feeBlocks.find(b => b.id === selectedBlock);
    if (!block) return [];
    
    return block.fees.filter(fee => fee.paymentMethod === activeTab);
  };

  const getBlockColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 border-blue-300",
      green: "bg-green-100 text-green-800 border-green-300",
      red: "bg-red-100 text-red-800 border-red-300",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
      purple: "bg-purple-100 text-purple-800 border-purple-300",
    };
    
    return colors[color] || colors.blue;
  };

  const getAssociatedClientNames = (clientIds: string[]) => {
    return clients
      .filter(client => clientIds.includes(client.id))
      .map(client => client.business_name)
      .join(", ");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Taxas</h2>
        <Button onClick={() => {
          setEditingBlock(null);
          setNewBlock({ name: "", color: "blue" });
          setShowBlockDialog(true);
        }}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Bloco de Taxas
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Blocos de Taxas</CardTitle>
            <CardDescription>
              Selecione um bloco para gerenciar suas taxas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Carregando blocos...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {feeBlocks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum bloco de taxas cadastrado.
                  </p>
                ) : (
                  feeBlocks.map((block) => (
                    <div 
                      key={block.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer border ${
                        selectedBlock === block.id ? 'border-primary' : 'border-border'
                      } hover:border-primary transition-colors`}
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${getBlockColor(block.color)}`} />
                        <div className="max-w-[150px]">
                          <p className="font-medium truncate">{block.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {block.clients.length > 0 
                              ? `${block.clients.length} cliente(s)`
                              : "Nenhum cliente"}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1 shrink-0 ml-1">
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleEditBlock(block);
                        }}>
                          <Settings2Icon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlock(block.id);
                        }}>
                          <Trash2Icon className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gerenciar Taxas</CardTitle>
              {selectedBlock && (
                <CardDescription>
                  Bloco: {feeBlocks.find(b => b.id === selectedBlock)?.name}
                </CardDescription>
              )}
            </div>
            {selectedBlock && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={openAssignClientsDialog}>
                  Associar Clientes
                </Button>
                <Button onClick={() => {
                  resetNewFee();
                  setEditingFee(null);
                  setNewFee(prev => ({ ...prev, paymentMethod: activeTab }));
                  setShowAddFeeDialog(true);
                }}>
                  Adicionar Taxa
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!selectedBlock ? (
              <div className="text-center py-8 text-muted-foreground">
                Selecione um bloco de taxas para gerenciar suas taxas
              </div>
            ) : (
              <Tabs defaultValue="PIX" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  {PAYMENT_TYPES.map(type => (
                    <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
                  ))}
                </TabsList>

                {PAYMENT_TYPES.map(type => (
                  <TabsContent key={type} value={type} className="mt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {type === "CRÉDITO" && <TableHead>Parcelas</TableHead>}
                          <TableHead>Taxa Base (%)</TableHead>
                          <TableHead>Taxa Parceiro (%)</TableHead>
                          <TableHead>Taxa Final (%)</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSelectedBlockFees().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={type === "CRÉDITO" ? 5 : 4} className="text-center py-10">
                              Nenhuma taxa cadastrada para {type.toLowerCase()}.
                            </TableCell>
                          </TableRow>
                        ) : (
                          getSelectedBlockFees().map((fee) => (
                            <TableRow key={fee.id}>
                              {type === "CRÉDITO" && <TableCell>{fee.installments}x</TableCell>}
                              <TableCell>{fee.baseRate.toFixed(2)}%</TableCell>
                              <TableCell>{fee.partnerRate.toFixed(2)}%</TableCell>
                              <TableCell>{fee.finalRate.toFixed(2)}%</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditFee(fee)}
                                  >
                                    Editar
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleRemoveFee(fee.id)}
                                  >
                                    Remover
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Fee Dialog */}
      <Dialog open={showAddFeeDialog} onOpenChange={setShowAddFeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFee ? "Editar Taxa" : "Adicionar Nova Taxa"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                  <select 
                    id="paymentMethod"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newFee.paymentMethod}
                    onChange={(e) => setNewFee({...newFee, paymentMethod: e.target.value})}
                  >
                    {PAYMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {newFee.paymentMethod === "CRÉDITO" && (
                  <div>
                    <Label htmlFor="installments">Parcelas</Label>
                    <select 
                      id="installments"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newFee.installments}
                      onChange={(e) => setNewFee({...newFee, installments: parseInt(e.target.value)})}
                    >
                      {INSTALLMENT_OPTIONS.map(num => (
                        <option key={num} value={num}>{num}x</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="baseRate">Taxa Base (%)</Label>
                <Input 
                  id="baseRate"
                  type="number"
                  step="0.01"
                  value={newFee.baseRate}
                  onChange={(e) => setNewFee({...newFee, baseRate: parseFloat(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="partnerRate">Taxa Parceiro (%)</Label>
                <Input 
                  id="partnerRate"
                  type="number"
                  step="0.01"
                  value={newFee.partnerRate}
                  onChange={(e) => setNewFee({...newFee, partnerRate: parseFloat(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="finalRate">Taxa Final (%)</Label>
                <Input 
                  id="finalRate"
                  type="number"
                  step="0.01"
                  value={newFee.finalRate}
                  onChange={(e) => setNewFee({...newFee, finalRate: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddFeeDialog(false);
              setEditingFee(null);
            }}>Cancelar</Button>
            <Button onClick={handleAddFee}>{editingFee ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Block Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBlock ? "Editar Bloco" : "Novo Bloco de Taxas"}</DialogTitle>
            <DialogDescription>
              Configure o nome e a cor do bloco de taxas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="blockName">Nome do Bloco</Label>
                <Input 
                  id="blockName"
                  value={newBlock.name}
                  onChange={(e) => setNewBlock({...newBlock, name: e.target.value})}
                  placeholder="Ex: Premium, Padrão, Especial"
                />
              </div>
              
              <div>
                <Label>Cor</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {FEE_BLOCK_COLORS.map(color => (
                    <div 
                      key={color.value}
                      className={`flex items-center justify-center p-2 border rounded-md cursor-pointer ${
                        newBlock.color === color.value ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-border'
                      } ${getBlockColor(color.value)}`}
                      onClick={() => setNewBlock({...newBlock, color: color.value})}
                    >
                      {color.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowBlockDialog(false);
              setEditingBlock(null);
            }}>Cancelar</Button>
            <Button onClick={handleAddBlock}>{editingBlock ? "Salvar" : "Criar Bloco"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Clients Dialog */}
      <Dialog open={showAssignClientsDialog} onOpenChange={setShowAssignClientsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Associar Clientes</DialogTitle>
            <DialogDescription>
              Selecione os clientes que utilizarão este bloco de taxas
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[300px] overflow-y-auto">
            {clients.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum cliente encontrado.
              </p>
            ) : (
              <div className="space-y-2">
                {clients.map(client => (
                  <div 
                    key={client.id} 
                    className={`flex items-center p-2 rounded-md ${
                      selectedClients.includes(client.id) ? 'bg-primary/10' : ''
                    } hover:bg-secondary/50 cursor-pointer`}
                    onClick={() => toggleClient(client.id)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedClients.includes(client.id)}
                      onChange={() => toggleClient(client.id)}
                      className="mr-3"
                    />
                    <span>{client.business_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignClientsDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignClients}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fees;
