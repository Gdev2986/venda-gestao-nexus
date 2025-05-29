
import { useState, useEffect } from "react";
import { usePartnerCommissions } from "@/hooks/use-partner-commissions";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { usePixKeys } from "@/hooks/usePixKeys";
import { PixKey } from "@/types";
import { 
  CalendarRange, 
  DollarSign, 
  PlusCircle, 
  FileText, 
  ArrowUpCircle,
  Calendar,
} from "lucide-react";

const Commissions = () => {
  const { summary, isLoading, requestPayment } = usePartnerCommissions();
  const { pixKeys, isLoading: isLoadingPixKeys } = usePixKeys();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedPixKey, setSelectedPixKey] = useState<string>("");
  const [requestAmount, setRequestAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleRequestPayment = async () => {
    if (!selectedPixKey) {
      toast({
        variant: "destructive",
        title: "Chave PIX obrigatória",
        description: "Selecione uma chave PIX para receber o pagamento",
      });
      return;
    }
    
    const amount = parseFloat(requestAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Insira um valor válido para solicitação",
      });
      return;
    }
    
    setIsSubmitting(true);
    const success = await requestPayment(amount, selectedPixKey, description);
    setIsSubmitting(false);
    
    if (success) {
      setIsRequestDialogOpen(false);
      setSelectedPixKey("");
      setRequestAmount("");
      setDescription("");
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  return (
    <div>
      <PageHeader
        title="Comissões"
        description="Acompanhe suas comissões e solicite pagamentos"
      >
        <Button onClick={() => setIsRequestDialogOpen(true)} className="inline-flex items-center gap-2">
          <ArrowUpCircle className="h-4 w-4" />
          Solicitar Pagamento
        </Button>
      </PageHeader>
      
      <PageWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total acumulado</div>
              <div className="text-3xl font-bold">
                {isLoading ? "..." : formatCurrency(summary.totalCommission)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Já recebido</div>
              <div className="text-3xl font-bold text-green-600">
                {isLoading ? "..." : formatCurrency(summary.paidCommission)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Disponível para saque</div>
              <div className="text-3xl font-bold text-blue-600">
                {isLoading ? "..." : formatCurrency(summary.pendingCommission)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="history">
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="history">Histórico de Comissões</TabsTrigger>
            <TabsTrigger value="payments">Solicitações de Pagamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Comissões</CardTitle>
                <CardDescription>Todas as comissões geradas por vendas dos seus clientes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-100 rounded"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2">Data</th>
                          <th className="pb-2">Cliente</th>
                          <th className="pb-2">Venda</th>
                          <th className="pb-2 text-right">Comissão</th>
                          <th className="pb-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.recentCommissions && summary.recentCommissions.length > 0 ? (
                          summary.recentCommissions.map(commission => (
                            <tr key={commission.id} className="border-b hover:bg-muted/50">
                              <td className="py-3">{formatDate(commission.created_at)}</td>
                              <td className="py-3">Cliente {commission.sale_id.substring(0, 5)}</td>
                              <td className="py-3">Venda #{commission.sale_id.substring(0, 8)}</td>
                              <td className="py-3 text-right font-medium">{formatCurrency(commission.amount)}</td>
                              <td className="py-3 text-center">
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                  commission.is_paid 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {commission.is_paid ? "Pago" : "Pendente"}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-muted-foreground">
                              Nenhuma comissão registrada
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    Mostrando últimas comissões
                  </div>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Exportar Extrato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações de Pagamento</CardTitle>
                <CardDescription>Acompanhe as solicitações de pagamento das suas comissões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2">Data</th>
                        <th className="pb-2">Valor</th>
                        <th className="pb-2">Chave PIX</th>
                        <th className="pb-2 text-center">Status</th>
                        <th className="pb-2">Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          Nenhuma solicitação de pagamento registrada
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Pagamento de Comissões</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                  <Input
                    id="amount"
                    type="text"
                    className="pl-8"
                    placeholder="0,00"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pixKey">Chave PIX</Label>
                {isLoadingPixKeys ? (
                  <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                ) : pixKeys && pixKeys.length > 0 ? (
                  <Select value={selectedPixKey} onValueChange={setSelectedPixKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma chave PIX" />
                    </SelectTrigger>
                    <SelectContent>
                      {pixKeys.map((key) => (
                        <SelectItem key={key.id} value={key.id}>
                          {key.name} - {key.key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma chave PIX cadastrada. Adicione uma chave nas configurações.
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Observação (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Adicione uma observação"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRequestDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleRequestPayment} 
                disabled={isSubmitting || !selectedPixKey || !requestAmount}
              >
                {isSubmitting ? "Enviando..." : "Solicitar Pagamento"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageWrapper>
    </div>
  );
};

export default Commissions;
