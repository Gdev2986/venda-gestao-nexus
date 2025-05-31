
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Calculator, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { TaxBlocksService, BlockWithRates } from "@/services/tax-blocks.service";

export const ClientFeePlanDisplay = () => {
  const [taxBlock, setTaxBlock] = useState<BlockWithRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTaxBlock = async () => {
      if (!user?.id) return;

      try {
        // Buscar client_id do usuário
        const { data: clientAccess } = await supabase
          .from('user_client_access')
          .select('client_id')
          .eq('user_id', user.id)
          .single();

        if (!clientAccess) return;

        // Buscar bloco de taxa do cliente
        const clientTaxBlock = await TaxBlocksService.getClientTaxBlock(clientAccess.client_id);
        
        if (clientTaxBlock) {
          setTaxBlock(clientTaxBlock);
        }
      } catch (error) {
        console.error('Erro ao buscar bloco de taxas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaxBlock();
  }, [user?.id]);

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CREDIT': return 'Crédito';
      case 'DEBIT': return 'Débito';
      case 'PIX': return 'PIX';
      default: return method;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'CREDIT': return 'bg-blue-100 text-blue-800';
      case 'DEBIT': return 'bg-green-100 text-green-800';
      case 'PIX': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para ordenar as taxas na ordem correta: PIX, DEBIT, CREDIT (1x-18x)
  const getSortedRates = () => {
    if (!taxBlock?.rates) return [];

    return taxBlock.rates.sort((a, b) => {
      // Primeiro ordenar por método de pagamento
      const methodOrder = { 'PIX': 1, 'DEBIT': 2, 'CREDIT': 3 };
      const methodA = methodOrder[a.payment_method as keyof typeof methodOrder] || 99;
      const methodB = methodOrder[b.payment_method as keyof typeof methodOrder] || 99;
      
      if (methodA !== methodB) {
        return methodA - methodB;
      }
      
      // Depois ordenar por parcelas dentro do mesmo método
      return a.installment - b.installment;
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-16 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!taxBlock) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhum bloco de taxas vinculado</p>
        </CardContent>
      </Card>
    );
  }

  const sortedRates = getSortedRates();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Bloco de Taxas</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{taxBlock.name}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Calculator className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{taxBlock.name}</DialogTitle>
                {taxBlock.description && (
                  <p className="text-sm text-muted-foreground">{taxBlock.description}</p>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Método</TableHead>
                      <TableHead>Parcelas</TableHead>
                      <TableHead>Taxa Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRates.map((rate, index) => (
                      <TableRow key={`${rate.payment_method}-${rate.installment}-${index}`}>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={getPaymentMethodColor(rate.payment_method)}
                          >
                            {getPaymentMethodLabel(rate.payment_method)}
                          </Badge>
                        </TableCell>
                        <TableCell>{rate.installment}x</TableCell>
                        <TableCell className="font-medium">{rate.final_rate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxas configuradas:</span>
            <span className="font-medium">{taxBlock.rates?.length || 0} modalidades</span>
          </div>
          
          {/* Resumo das taxas - mostrar principais em ordem correta */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Principais taxas:</h4>
            <div className="space-y-1">
              {sortedRates.slice(0, 5).map((rate) => (
                <div key={`${rate.payment_method}-${rate.installment}`} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`${getPaymentMethodColor(rate.payment_method)} text-xs`}
                    >
                      {getPaymentMethodLabel(rate.payment_method)}
                    </Badge>
                    <span>{rate.installment}x</span>
                  </div>
                  <span className="font-medium">{rate.final_rate}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {taxBlock.description && (
            <p className="text-xs text-muted-foreground">{taxBlock.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
