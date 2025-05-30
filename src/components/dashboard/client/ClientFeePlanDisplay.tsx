
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

interface FeePlanRate {
  payment_method: string;
  installments: number;
  rate_percentage: number;
}

interface FeePlan {
  id: string;
  name: string;
  description: string;
  rates: FeePlanRate[];
}

export const ClientFeePlanDisplay = () => {
  const [feePlan, setFeePlan] = useState<FeePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeePlan = async () => {
      if (!user?.id) return;

      try {
        // Buscar client_id do usuário
        const { data: clientAccess } = await supabase
          .from('user_client_access')
          .select('client_id')
          .eq('user_id', user.id)
          .single();

        if (!clientAccess) return;

        // Buscar plano de taxa do cliente
        const { data: clientFeePlan } = await supabase
          .from('client_fee_plans')
          .select(`
            fee_plan_id,
            fee_plans!inner(
              id,
              name,
              description,
              fee_plan_rates(
                payment_method,
                installments,
                rate_percentage
              )
            )
          `)
          .eq('client_id', clientAccess.client_id)
          .single();

        if (clientFeePlan?.fee_plans) {
          setFeePlan({
            id: clientFeePlan.fee_plans.id,
            name: clientFeePlan.fee_plans.name,
            description: clientFeePlan.fee_plans.description || '',
            rates: clientFeePlan.fee_plans.fee_plan_rates || []
          });
        }
      } catch (error) {
        console.error('Erro ao buscar plano de taxas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeePlan();
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

  if (!feePlan) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhum plano de taxas vinculado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Plano de Taxas</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{feePlan.name}</p>
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
                <DialogTitle>{feePlan.name}</DialogTitle>
                {feePlan.description && (
                  <p className="text-sm text-muted-foreground">{feePlan.description}</p>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {['CREDIT', 'DEBIT', 'PIX'].map((method) => {
                    const methodRates = feePlan.rates.filter(r => r.payment_method === method);
                    
                    if (methodRates.length === 0) return null;

                    return (
                      <div key={method} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          {getPaymentMethodLabel(method)}
                          <Badge variant="outline">{methodRates.length} parcelas</Badge>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {methodRates.map((rate) => (
                            <div key={`${rate.payment_method}-${rate.installments}`} 
                                 className="flex justify-between p-2 bg-muted/50 rounded">
                              <span>{rate.installments}x</span>
                              <span className="font-medium">{rate.rate_percentage}%</span>
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
            <span className="font-medium">{feePlan.rates.length} modalidades</span>
          </div>
          {feePlan.description && (
            <p className="text-xs text-muted-foreground">{feePlan.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
