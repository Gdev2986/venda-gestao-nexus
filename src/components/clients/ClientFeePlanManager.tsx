
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { FeePlansService, FeePlan, ClientFeePlan } from "@/services/fee-plans.service";
import { CreditCard, Percent } from "lucide-react";

interface ClientFeePlanManagerProps {
  clientId: string;
}

export const ClientFeePlanManager: React.FC<ClientFeePlanManagerProps> = ({ clientId }) => {
  const [feePlans, setFeePlans] = useState<FeePlan[]>([]);
  const [clientFeePlan, setClientFeePlan] = useState<ClientFeePlan | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [plansData, clientPlanData] = await Promise.all([
        FeePlansService.getFeePlans(),
        FeePlansService.getClientFeePlan(clientId)
      ]);
      
      setFeePlans(plansData);
      setClientFeePlan(clientPlanData);
      
      if (clientPlanData) {
        setSelectedPlanId(clientPlanData.fee_plan_id);
        setNotes(clientPlanData.notes || "");
      }
    } catch (error) {
      console.error('Error fetching fee plan data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos planos de taxa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const handleAssignPlan = async () => {
    if (!selectedPlanId || !user?.id) return;

    setIsAssigning(true);
    try {
      await FeePlansService.assignFeePlanToClient(
        clientId,
        selectedPlanId,
        user.id,
        notes.trim() || undefined
      );

      toast({
        title: "Plano vinculado",
        description: "Plano de taxa vinculado com sucesso"
      });

      fetchData();
    } catch (error) {
      console.error('Error assigning fee plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao vincular plano de taxa",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemovePlan = async () => {
    setIsAssigning(true);
    try {
      await FeePlansService.removeFeePlanFromClient(clientId);

      toast({
        title: "Plano removido",
        description: "Plano de taxa removido com sucesso"
      });

      setSelectedPlanId("");
      setNotes("");
      fetchData();
    } catch (error) {
      console.error('Error removing fee plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover plano de taxa",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedPlan = feePlans.find(plan => plan.id === selectedPlanId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Plano de Taxa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clientFeePlan && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-green-800">Plano Atual</h4>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
            <p className="text-green-700">{clientFeePlan.fee_plan?.name}</p>
            {clientFeePlan.fee_plan?.description && (
              <p className="text-sm text-green-600 mt-1">{clientFeePlan.fee_plan.description}</p>
            )}
            <p className="text-xs text-green-600 mt-2">
              Vinculado em {new Date(clientFeePlan.assigned_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fee-plan">Selecionar Plano</Label>
          <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um plano de taxa" />
            </SelectTrigger>
            <SelectContent>
              {feePlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    {plan.description && (
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPlan && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium mb-2 flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Taxas do Plano
            </h5>
            <div className="space-y-1 text-sm">
              {selectedPlan.rates?.map((rate) => (
                <div key={rate.id} className="flex justify-between">
                  <span>{rate.payment_method} {rate.installments > 1 ? `(${rate.installments}x)` : ''}</span>
                  <span className="font-medium">{(rate.rate_percentage * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações sobre a vinculação do plano..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleAssignPlan} 
            disabled={!selectedPlanId || isAssigning}
            className="flex-1"
          >
            {isAssigning ? "Processando..." : clientFeePlan ? "Atualizar Plano" : "Vincular Plano"}
          </Button>
          
          {clientFeePlan && (
            <Button 
              variant="outline" 
              onClick={handleRemovePlan}
              disabled={isAssigning}
            >
              {isAssigning ? "Removendo..." : "Remover"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
