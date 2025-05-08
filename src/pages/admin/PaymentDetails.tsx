import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PaymentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/formatters";

const PaymentDetails = () => {
  const { id: paymentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [payment, setPayment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('payment_requests')
          .select('*')
          .eq('id', paymentId)
          .single();

        if (error) {
          throw new Error(`Failed to fetch payment: ${error.message}`);
        }

        setPayment(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: `Falha ao buscar detalhes do pagamento: ${error.message}`,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId, toast]);

  const handleApprovePayment = async () => {
    setIsApproving(true);
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({ 
          status: PaymentStatus.APPROVED.toString(),
        })
        .eq('id', paymentId);

      if (error) {
        throw new Error(`Failed to approve payment: ${error.message}`);
      }

      toast({
        title: "Sucesso",
        description: "Pagamento aprovado com sucesso.",
      });
      navigate("/admin/payments");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao aprovar pagamento: ${error.message}`,
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectPayment = async () => {
    setIsRejecting(true);
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({ 
          status: PaymentStatus.REJECTED.toString(),
          rejection_reason: rejectionReason,
        })
        .eq('id', paymentId);

      if (error) {
        throw new Error(`Failed to reject payment: ${error.message}`);
      }

      toast({
        title: "Sucesso",
        description: "Pagamento rejeitado com sucesso.",
      });
      navigate("/admin/payments");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao rejeitar pagamento: ${error.message}`,
      });
    } finally {
      setIsRejecting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando detalhes do pagamento...</div>;
  }

  if (!payment) {
    return <div className="text-center py-4">Pagamento não encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/admin/payments")} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <CardTitle>Detalhes do Pagamento</CardTitle>
          </div>
          <CardDescription>Informações detalhadas sobre o pagamento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>ID do Pagamento</Label>
              <Input value={payment.id} readOnly />
            </div>
            <div>
              <Label>Cliente ID</Label>
              <Input value={payment.client_id} readOnly />
            </div>
            <div>
              <Label>Valor</Label>
              <Input value={formatCurrency(payment.amount)} readOnly />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={payment.status} readOnly />
            </div>
            <div>
              <Label>Data de Criação</Label>
              <Input value={formatDate(new Date(payment.created_at))} readOnly />
            </div>
            {payment.rejection_reason && (
              <div>
                <Label>Motivo da Rejeição</Label>
                <Input value={payment.rejection_reason} readOnly />
              </div>
            )}
            {payment.receipt_url && (
              <div>
                <Label>URL do Recibo</Label>
                <Input value={payment.receipt_url} readOnly />
              </div>
            )}
          </div>

          {payment.status === PaymentStatus.PENDING && (
            <div className="flex justify-end space-x-2">
              <Button
                variant="destructive"
                onClick={() => document.getElementById('reject-modal')?.showModal()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar Pagamento
              </Button>
              <Button
                variant="secondary"
                onClick={handleApprovePayment}
                disabled={isApproving}
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aprovando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar Pagamento
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Payment Modal */}
      <dialog id="reject-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Rejeitar Pagamento</h3>
          <p className="py-4">Tem certeza de que deseja rejeitar este pagamento?</p>

          <div className="py-2">
            <Label htmlFor="rejectionReason">Motivo da Rejeição</Label>
            <Textarea
              id="rejectionReason"
              placeholder="Informe o motivo da rejeição..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>

          <div className="modal-action">
            <form method="dialog">
              <Button variant="ghost">Cancelar</Button>
            </form>
            <Button
              variant="primary"
              onClick={handleRejectPayment}
              disabled={isRejecting}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejeitando...
                </>
              ) : (
                "Confirmar Rejeição"
              )}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PaymentDetails;
