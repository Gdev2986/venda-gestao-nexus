
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{taxBlock.name}</DialogTitle>
                {taxBlock.description && (
                  <p className="text-sm text-muted-foreground">{taxBlock.description}</p>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {['CREDIT', 'DEBIT', 'PIX'].map((method) => {
                    const methodRates = taxBlock.rates?.filter(r => r.payment_method === method) || [];
                    
                    if (methodRates.length === 0) return null;

                    return (
                      <div key={method} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          {getPaymentMethodLabel(method)}
                          <Badge variant="outline">{methodRates.length} parcelas</Badge>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {methodRates.map((rate) => (
                            <div key={`${rate.payment_method}-${rate.installment}`} 
                                 className="flex justify-between p-2 bg-muted/50 rounded">
                              <span>{rate.installment}x</span>
                              <span className="font-medium">{rate.final_rate}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxas configuradas:</span>
            <span className="font-medium">{taxBlock.rates?.length || 0} modalidades</span>
          </div>
          {taxBlock.description && (
            <p className="text-xs text-muted-foreground">{taxBlock.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
