
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Percent } from "lucide-react";
import { FeePlansService, ClientFeePlan } from "@/services/fee-plans.service";

interface ClientFeePlanDisplayProps {
  clientId: string;
}

export const ClientFeePlanDisplay: React.FC<ClientFeePlanDisplayProps> = ({ clientId }) => {
  const [clientFeePlan, setClientFeePlan] = useState<ClientFeePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientFeePlan = async () => {
      try {
        const feePlanData = await FeePlansService.getClientFeePlan(clientId);
        setClientFeePlan(feePlanData);
      } catch (error) {
        console.error('Error fetching client fee plan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientFeePlan();
  }, [clientId]);

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
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientFeePlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plano de Taxa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhum plano de taxa vinculado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plano de Taxa
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">{clientFeePlan.fee_plan?.name}</h4>
          {clientFeePlan.fee_plan?.description && (
            <p className="text-sm text-muted-foreground">{clientFeePlan.fee_plan.description}</p>
          )}
        </div>

        {clientFeePlan.fee_plan?.rates && clientFeePlan.fee_plan.rates.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Taxas
            </h5>
            <div className="space-y-1 text-sm">
              {clientFeePlan.fee_plan.rates.map((rate) => (
                <div key={rate.id} className="flex justify-between">
                  <span>
                    {getPaymentMethodName(rate.payment_method)}
                    {rate.installments > 1 ? ` (${rate.installments}x)` : ''}
                  </span>
                  <span className="font-medium">{(rate.rate_percentage * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Vinculado em {new Date(clientFeePlan.assigned_at).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};
