
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Percent, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FeePlansService, ClientFeePlan } from "@/services/fee-plans.service";

const ClientFeePlans = () => {
  const [clientFeePlan, setClientFeePlan] = useState<ClientFeePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClientFeePlan = async () => {
    if (!user?.id) return;

    try {
      // Buscar o client_id do usuário
      const { data: clientAccess, error: accessError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (accessError || !clientAccess) {
        console.error('No client access found for user');
        return;
      }

      // Buscar plano de taxa do cliente
      const feePlanData = await FeePlansService.getClientFeePlan(clientAccess.client_id);
      setClientFeePlan(feePlanData);
    } catch (error) {
      console.error('Error fetching client fee plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar informações do plano de taxa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientFeePlan();
  }, [user?.id]);

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'PIX': return 'PIX';
      case 'CREDIT': return 'Cartão de Crédito';
      case 'DEBIT': return 'Cartão de Débito';
      default: return method;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Plano de Taxas"
          description="Carregando informações do seu plano..."
        />
        <Card>
          <CardContent className="py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientFeePlan) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Plano de Taxas"
          description="Informações sobre suas taxas de transação"
        />
        <Card>
          <CardContent className="py-8 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum plano vinculado</h3>
            <p className="text-muted-foreground">
              Ainda não há um plano de taxas vinculado à sua conta. Entre em contato com o suporte.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Plano de Taxas"
        description="Informações sobre suas taxas de transação"
      />
      
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              {clientFeePlan.fee_plan?.name}
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
          </div>
          {clientFeePlan.fee_plan?.description && (
            <p className="text-muted-foreground">{clientFeePlan.fee_plan.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Sobre as taxas:</p>
                <p>As taxas são aplicadas automaticamente em cada transação. O valor líquido (valor bruto - taxa) é creditado em seu saldo.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Taxas por Modalidade
              </h4>
              
              <div className="grid gap-3">
                {clientFeePlan.fee_plan?.rates?.map((rate) => (
                  <Card key={rate.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{getPaymentMethodName(rate.payment_method)}</div>
                          <div className="text-sm text-muted-foreground">
                            {rate.installments > 1 ? `${rate.installments} parcelas` : 'À vista'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {(rate.rate_percentage * 100).toFixed(2)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Taxa final</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {clientFeePlan.notes && (
              <div className="pt-4 border-t border-gray-200">
                <h5 className="font-medium mb-2">Observações</h5>
                <p className="text-sm text-muted-foreground">{clientFeePlan.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 text-xs text-muted-foreground">
              Plano vinculado em {new Date(clientFeePlan.assigned_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientFeePlans;
