
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { FeePlansService, FeePlan } from "@/services/fee-plans.service";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Percent, Users, Link } from "lucide-react";

export const FeePlanManager: React.FC = () => {
  const [feePlans, setFeePlans] = useState<FeePlan[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<FeePlan | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [isClientLinkDialogOpen, setIsClientLinkDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [newRatePaymentMethod, setNewRatePaymentMethod] = useState("");
  const [newRateInstallments, setNewRateInstallments] = useState(1);
  const [newRatePercentage, setNewRatePercentage] = useState(0);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [linkNotes, setLinkNotes] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFeePlans = async () => {
    try {
      const plans = await FeePlansService.getFeePlans();
      setFeePlans(plans);
    } catch (error) {
      console.error('Error fetching fee plans:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar planos de taxa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name, contact_name, status')
        .eq('status', 'ACTIVE')
        .order('business_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchFeePlans();
    fetchClients();
  }, []);

  const handleCreatePlan = async () => {
    try {
      await FeePlansService.createFeePlan(newPlanName, newPlanDescription);
      toast({
        title: "Plano criado",
        description: "Plano de taxa criado com sucesso"
      });
      setIsCreateDialogOpen(false);
      setNewPlanName("");
      setNewPlanDescription("");
      fetchFeePlans();
    } catch (error) {
      console.error('Error creating fee plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar plano de taxa",
        variant: "destructive"
      });
    }
  };

  const handleAddRate = async () => {
    if (!selectedPlan) return;
    
    try {
      await FeePlansService.addRateToFeePlan(
        selectedPlan.id,
        newRatePaymentMethod,
        newRateInstallments,
        newRatePercentage / 100
      );
      toast({
        title: "Taxa adicionada",
        description: "Taxa adicionada ao plano com sucesso"
      });
      setIsRateDialogOpen(false);
      setNewRatePaymentMethod("");
      setNewRateInstallments(1);
      setNewRatePercentage(0);
      fetchFeePlans();
    } catch (error) {
      console.error('Error adding rate:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar taxa",
        variant: "destructive"
      });
    }
  };

  const handleLinkClient = async () => {
    if (!selectedPlan || !selectedClientId || !user?.id) return;

    try {
      await FeePlansService.assignFeePlanToClient(
        selectedClientId,
        selectedPlan.id,
        user.id,
        linkNotes.trim() || undefined
      );
      toast({
        title: "Cliente vinculado",
        description: "Cliente vinculado ao plano com sucesso"
      });
      setIsClientLinkDialogOpen(false);
      setSelectedClientId("");
      setLinkNotes("");
    } catch (error) {
      console.error('Error linking client:', error);
      toast({
        title: "Erro",
        description: "Erro ao vincular cliente ao plano",
        variant: "destructive"
      });
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'PIX': return 'PIX';
      case 'CREDIT': return 'Cartão de Crédito';
      case 'DEBIT': return 'Cartão de Débito';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Planos de Taxa</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Plano de Taxa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="plan-name">Nome do Plano</Label>
                <Input
                  id="plan-name"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="Ex: Plano Básico"
                />
              </div>
              <div>
                <Label htmlFor="plan-description">Descrição</Label>
                <Textarea
                  id="plan-description"
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                  placeholder="Descrição do plano..."
                />
              </div>
              <Button onClick={handleCreatePlan} disabled={!newPlanName.trim()}>
                Criar Plano
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando planos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feePlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{plan.name}</span>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsClientLinkDialogOpen(true);
                      }}
                      title="Vincular Cliente"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsRateDialogOpen(true);
                      }}
                      title="Adicionar Taxa"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                {plan.description && (
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Taxas ({plan.rates?.length || 0})
                  </h4>
                  {plan.rates?.length ? (
                    <div className="space-y-1">
                      {plan.rates.map((rate) => (
                        <div key={rate.id} className="flex justify-between items-center text-sm">
                          <span>
                            {getPaymentMethodName(rate.payment_method)}
                            {rate.installments > 1 ? ` (${rate.installments}x)` : ''}
                          </span>
                          <Badge variant="outline">
                            {(rate.rate_percentage * 100).toFixed(2)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma taxa definida</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para adicionar taxa */}
      <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Taxa ao Plano: {selectedPlan?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-method">Modalidade de Pagamento</Label>
              <Select value={newRatePaymentMethod} onValueChange={setNewRatePaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                  <SelectItem value="DEBIT">Cartão de Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="installments">Parcelas</Label>
              <Input
                id="installments"
                type="number"
                min="1"
                max="12"
                value={newRateInstallments}
                onChange={(e) => setNewRateInstallments(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="rate-percentage">Taxa (%)</Label>
              <Input
                id="rate-percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newRatePercentage}
                onChange={(e) => setNewRatePercentage(parseFloat(e.target.value) || 0)}
              />
            </div>
            <Button 
              onClick={handleAddRate} 
              disabled={!newRatePaymentMethod || newRatePercentage <= 0}
            >
              Adicionar Taxa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para vincular cliente */}
      <Dialog open={isClientLinkDialogOpen} onOpenChange={setIsClientLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Cliente ao Plano: {selectedPlan?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="client-select">Cliente</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name || client.contact_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="link-notes">Observações</Label>
              <Textarea
                id="link-notes"
                value={linkNotes}
                onChange={(e) => setLinkNotes(e.target.value)}
                placeholder="Observações sobre a vinculação..."
              />
            </div>
            <Button 
              onClick={handleLinkClient} 
              disabled={!selectedClientId}
            >
              Vincular Cliente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
