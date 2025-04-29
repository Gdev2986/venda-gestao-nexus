
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define fee types for different payment methods
const PAYMENT_TYPES = ["PIX", "DÉBITO", "CRÉDITO"];
const INSTALLMENT_OPTIONS = Array.from({ length: 21 }, (_, i) => i + 1); // 1 to 21

interface Fee {
  id: string;
  paymentMethod: string;
  installments: number;
  baseRate: number;
  partnerRate: number;
  finalRate: number;
}

const Fees = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PIX");
  const [showAddFeeDialog, setShowAddFeeDialog] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  
  const [newFee, setNewFee] = useState({
    paymentMethod: "PIX",
    installments: 1,
    baseRate: 0,
    partnerRate: 0,
    finalRate: 0,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchFees();
  }, []);

  // Mock data generation for demo
  const fetchFees = async () => {
    setIsLoading(true);
    
    try {
      // This is mock data since we don't have the actual table yet
      const mockFees: Fee[] = [
        // PIX fees
        { id: "1", paymentMethod: "PIX", installments: 1, baseRate: 0.99, partnerRate: 1.5, finalRate: 1.99 },
        
        // DÉBITO fees
        { id: "2", paymentMethod: "DÉBITO", installments: 1, baseRate: 1.5, partnerRate: 2.0, finalRate: 2.5 },
        
        // CRÉDITO fees by installments
        { id: "3", paymentMethod: "CRÉDITO", installments: 1, baseRate: 2.0, partnerRate: 2.8, finalRate: 3.5 },
        { id: "4", paymentMethod: "CRÉDITO", installments: 2, baseRate: 3.0, partnerRate: 4.0, finalRate: 5.0 },
        { id: "5", paymentMethod: "CRÉDITO", installments: 3, baseRate: 3.5, partnerRate: 4.5, finalRate: 5.5 },
        { id: "6", paymentMethod: "CRÉDITO", installments: 6, baseRate: 5.0, partnerRate: 6.5, finalRate: 8.0 },
        { id: "7", paymentMethod: "CRÉDITO", installments: 12, baseRate: 8.0, partnerRate: 10.0, finalRate: 12.0 },
        { id: "8", paymentMethod: "CRÉDITO", installments: 18, baseRate: 12.0, partnerRate: 14.0, finalRate: 16.0 },
        { id: "9", paymentMethod: "CRÉDITO", installments: 21, baseRate: 15.0, partnerRate: 17.0, finalRate: 19.0 },
      ];
      
      setFees(mockFees);
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
    if (editingFee) {
      setFees(fees.map(f => f.id === editingFee.id ? { ...newFee, id: editingFee.id } : f));
      toast({
        title: "Taxa atualizada",
        description: "A taxa foi atualizada com sucesso.",
      });
    } else {
      setFees([...fees, { ...newFee, id: Math.random().toString() }]);
      toast({
        title: "Taxa adicionada",
        description: "A nova taxa foi adicionada com sucesso.",
      });
    }
    setShowAddFeeDialog(false);
    setEditingFee(null);
    resetNewFee();
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

  const handleRemoveFee = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta taxa?")) {
      setFees(fees.filter(fee => fee.id !== id));
      toast({
        title: "Taxa removida",
        description: "A taxa foi removida com sucesso.",
      });
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

  const getFilteredFees = () => {
    return fees.filter(fee => fee.paymentMethod === activeTab);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Taxas</h2>
          <Button onClick={() => { 
            resetNewFee();
            setEditingFee(null);
            setShowAddFeeDialog(true); 
          }}>Adicionar Taxa</Button>
        </div>

        <Tabs defaultValue="PIX" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            {PAYMENT_TYPES.map(type => (
              <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
            ))}
          </TabsList>

          {PAYMENT_TYPES.map(type => (
            <TabsContent key={type} value={type} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Taxas de {type}</CardTitle>
                  <CardDescription>
                    {type === "CRÉDITO" 
                      ? "Taxas para pagamentos com cartão de crédito por parcela" 
                      : `Taxas para pagamentos com ${type.toLowerCase()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Carregando taxas...</p>
                    </div>
                  ) : (
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
                        {getFilteredFees().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={type === "CRÉDITO" ? 5 : 4} className="text-center py-10">
                              Nenhuma taxa cadastrada para {type.toLowerCase()}.
                            </TableCell>
                          </TableRow>
                        ) : (
                          getFilteredFees().map((fee) => (
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

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
      </div>
    </MainLayout>
  );
};

export default Fees;
