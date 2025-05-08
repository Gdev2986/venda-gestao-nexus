
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Calendar, Download, Check, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { usePartnerCommissions } from "@/hooks/use-partner-commissions";
import { usePixKeys } from "@/hooks/usePixKeys";

const Commissions = () => {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedPixKeyId, setSelectedPixKeyId] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { summary, commissions, isLoading, requestPayment } = usePartnerCommissions();
  const { pixKeys, isLoadingPixKeys } = usePixKeys();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRequestPayment = async () => {
    if (!selectedPixKeyId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione uma chave PIX para continuar.",
      });
      return;
    }

    setIsSubmitting(true);
    const success = await requestPayment(
      summary.pendingCommission,
      selectedPixKeyId,
      description
    );
    
    setIsSubmitting(false);
    
    if (success) {
      setIsRequestDialogOpen(false);
      setSelectedPixKeyId("");
      setDescription("");
    }
  };

  return (
    <div>
      <PageHeader 
        title="Minhas Comissões" 
        description="Gerencie e solicite pagamentos de comissões"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Comissão Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalCommission)}</div>
            <p className="text-xs text-muted-foreground mt-1">Valor total acumulado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Comissão Paga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.paidCommission)}</div>
            <p className="text-xs text-muted-foreground mt-1">Valor já pago</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Comissão Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.pendingCommission)}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">Disponível para saque</p>
              <Button 
                size="sm" 
                disabled={summary.pendingCommission <= 0}
                onClick={() => setIsRequestDialogOpen(true)}
              >
                Solicitar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PageWrapper>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Histórico de Comissões
                </CardTitle>
                <CardDescription>
                  Acompanhe suas comissões geradas e pagas
                </CardDescription>
              </div>
              <Button variant="outline" className="mt-2 sm:mt-0">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full p-8 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : commissions.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium">Nenhuma comissão encontrada</h3>
                <p className="text-muted-foreground mt-1">
                  Você ainda não gerou comissões.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>ID da Venda</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pago em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {formatDate(new Date(commission.created_at))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{commission.sale_id.substring(0, 8)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(commission.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={commission.is_paid ? "success" : "outline"}>
                            {commission.is_paid ? "Pago" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {commission.paid_at ? formatDate(new Date(commission.paid_at)) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageWrapper>
      
      {/* Payment Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Pagamento</DialogTitle>
            <DialogDescription>
              Solicite o pagamento da sua comissão disponível de {formatCurrency(summary.pendingCommission)}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecione uma chave PIX</label>
              {isLoadingPixKeys ? (
                <div className="w-full p-2 flex justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <Select value={selectedPixKeyId} onValueChange={setSelectedPixKeyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma chave PIX" />
                  </SelectTrigger>
                  <SelectContent>
                    {pixKeys.map((pixKey) => (
                      <SelectItem key={pixKey.id} value={pixKey.id}>
                        {pixKey.name} ({pixKey.key})
                        {pixKey.is_default && " - Favorita"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Observação (opcional)</label>
              <Textarea 
                placeholder="Adicione uma observação se necessário"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsRequestDialogOpen(false)}
              disabled={isSubmitting}
              className="mb-2 sm:mb-0"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleRequestPayment}
              disabled={isSubmitting || !selectedPixKeyId}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-white"></div>
                  Solicitando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmar Solicitação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Commissions;
