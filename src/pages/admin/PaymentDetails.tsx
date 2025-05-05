import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import PaymentDetailView from "@/components/payments/PaymentDetailView";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { PATHS } from "@/routes/paths";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";

const AdminPaymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  const { userRole } = useUserRole();
  
  // Check if user has appropriate role
  const hasPermission = userRole === UserRole.ADMIN || userRole === UserRole.FINANCIAL;

  // Fetch payment details
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!id || !hasPermission) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("payment_requests")
          .select(`
            *,
            pix_key: pix_key_id (key, type, name),
            client: client_id (business_name)
          `)
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Transform the data to match our Payment type
          setPayment({
            id: data.id,
            amount: data.amount,
            status: data.status as PaymentStatus,
            created_at: data.created_at,
            updated_at: data.updated_at,
            client_id: data.client_id,
            description: data.description,
            approved_at: data.approved_at,
            receipt_url: data.receipt_url,
            client_name: data.client?.business_name || "Cliente desconhecido",
            payment_type: PaymentType.PIX, // Default to PIX
            rejection_reason: data.rejection_reason || null,
            pix_key: data.pix_key ? {
              id: data.pix_key_id,
              key: data.pix_key.key,
              type: data.pix_key.type,
              owner_name: data.pix_key.name
            } : undefined
          });
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do pagamento.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentDetails();
  }, [id, hasPermission, toast]);

  // Handle payment approval
  const handleApprovePayment = async (paymentId: string, receiptFile: File | null, notes: string) => {
    setIsProcessing(true);
    try {
      let receiptUrl = null;
      
      // Upload receipt if provided
      if (receiptFile) {
        const fileName = `receipt_${paymentId}_${Date.now()}.${receiptFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_receipts')
          .upload(fileName, receiptFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL for the receipt
        const { data: urlData } = supabase.storage
          .from('payment_receipts')
          .getPublicUrl(fileName);
          
        receiptUrl = urlData.publicUrl;
      }
      
      // Update payment status in database
      const { error: updateError } = await supabase
        .from('payment_requests')
        .update({
          status: PaymentStatus.APPROVED,
          approved_at: new Date().toISOString(),
          receipt_url: receiptUrl,
          notes: notes || null
        })
        .eq('id', paymentId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      
      // Update the payment in state
      if (payment) {
        setPayment({
          ...payment,
          status: PaymentStatus.APPROVED,
          approved_at: new Date().toISOString(),
          receipt_url: receiptUrl || payment.receipt_url
        });
      }
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        title: "Erro ao aprovar pagamento",
        description: "Não foi possível aprovar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment rejection
  const handleRejectPayment = async (paymentId: string, rejectionReason: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Erro ao recusar pagamento",
        description: "É necessário informar um motivo para recusar o pagamento.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      // Update payment status in database
      const { error } = await supabase
        .from('payment_requests')
        .update({
          status: PaymentStatus.REJECTED,
          rejection_reason: rejectionReason
        })
        .eq('id', paymentId);
        
      if (error) throw error;
      
      toast({
        title: "Pagamento recusado",
        description: "O pagamento foi recusado com sucesso.",
      });
      
      // Update the payment in state
      if (payment) {
        setPayment({
          ...payment,
          status: PaymentStatus.REJECTED,
          rejection_reason: rejectionReason
        });
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Erro ao recusar pagamento",
        description: "Não foi possível recusar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Return to payments list
  const handleBackToList = () => {
    navigate(PATHS.ADMIN.PAYMENTS);
  };

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Detalhes do Pagamento" 
        description={`${payment?.client_name || 'Cliente'} - ${payment?.id ? '#' + payment.id.substring(0, 8) : ''}`}
      >
        <Button variant="outline" onClick={handleBackToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Lista
        </Button>
      </PageHeader>
      
      <PageWrapper>
        {payment && (
          <PaymentDetailView 
            payment={payment}
            isLoading={isLoading}
            onApprove={payment.status === PaymentStatus.PENDING ? handleApprovePayment : undefined}
            onReject={payment.status === PaymentStatus.PENDING ? handleRejectPayment : undefined}
            isProcessing={isProcessing}
          />
        )}
      </PageWrapper>
    </div>
  );
};

export default AdminPaymentDetails;
