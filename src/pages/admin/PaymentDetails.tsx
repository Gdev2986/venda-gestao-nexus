import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PATHS } from "@/routes/paths";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminPaymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [payment, setPayment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          throw new Error("ID do pagamento não fornecido.");
        }

        const { data, error } = await supabase
          .from('payment_requests')
          .select(`
            *,
            pix_key (
              id,
              key,
              type,
              name as owner_name
            ),
            client (
              business_name
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setPayment(data);
        } else {
          toast({
            title: "Pagamento não encontrado",
            description: "Não foi possível encontrar os detalhes deste pagamento.",
            variant: "destructive",
          });
          navigate(PATHS.ADMIN.PAYMENTS);
        }
      } catch (error: any) {
        console.error("Erro ao carregar detalhes do pagamento:", error);
        toast({
          title: "Erro ao carregar pagamento",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id, navigate, toast]);

  if (isLoading) {
    return <div className="text-center">Carregando detalhes do pagamento...</div>;
  }

  if (!payment) {
    return <div className="text-center">Pagamento não encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Detalhes do Pagamento #{payment.id}</CardTitle>
          <Button variant="ghost" onClick={() => navigate(PATHS.ADMIN.PAYMENTS)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Informações Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Cliente:</strong> {payment.client?.business_name}
              </div>
              <div>
                <strong>Valor:</strong> {formatCurrency(payment.amount)}
              </div>
              <div>
                <strong>Data de Criação:</strong> {new Date(payment.created_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Status:</strong>
                <Badge
                  className={
                    payment.status === PaymentStatus.PENDING
                      ? "bg-yellow-100 text-yellow-800"
                      : payment.status === PaymentStatus.APPROVED
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {payment.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {payment.pix_key && (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Detalhes da Chave PIX</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Tipo de Chave:</strong> {payment.pix_key.type}
                  </div>
                  <div>
                    <strong>Chave:</strong> {payment.pix_key.key}
                  </div>
                  <div>
                    <strong>Nome do Proprietário:</strong> {payment.pix_key.owner_name}
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {payment.receipt_url && (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Comprovante</h3>
                <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Visualizar Comprovante
                </a>
              </div>

              <Separator />
            </>
          )}

          {payment && payment.rejection_reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Motivo da Rejeição</h3>
              <p className="text-gray-700">{payment.rejection_reason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentDetails;
