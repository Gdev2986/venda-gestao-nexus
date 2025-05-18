import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePayments } from "@/hooks/payments/use-payments";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { PaymentRequest, Payment } from "@/types/payment.types";
import { PaymentStatus } from "@/types/enums";
import { PaymentDialogs } from "@/components/payments/PaymentDialogs";
import { AdminPaymentsList } from "@/components/payments/AdminPaymentsList";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<PaymentStatus>("PENDING");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { payments, isLoading, error, mutate } = usePayments();
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterStatusChange = (status: PaymentStatus) => {
    setFilterStatus(status);
  };

  const filteredPayments = payments.filter((payment) => {
    const searchTermLower = searchTerm.toLowerCase();
    const descriptionMatch =
      payment.description?.toLowerCase().includes(searchTermLower) ||
      payment.id?.toLowerCase().includes(searchTermLower);
    const statusMatch = filterStatus === "ALL" || payment.status === filterStatus;

    return statusMatch && descriptionMatch;
  });

  const handleApprovePayment = async (paymentId: string, receiptFile: File | null, notes: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      setApproveDialogOpen(false);
      mutate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar o pagamento.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (paymentId: string, rejectionReason: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso.",
      });
      setRejectDialogOpen(false);
      mutate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível rejeitar o pagamento.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Pagamento excluído",
        description: "O pagamento foi excluído com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      mutate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o pagamento.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewPayment = (payment: PaymentRequest) => {
    setSelectedPayment(payment as unknown as Payment);
    setDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagamentos"
        description="Gerencie as solicitações de pagamento"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pagamentos..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="PENDING">Pendentes</SelectItem>
            <SelectItem value="APPROVED">Aprovados</SelectItem>
            <SelectItem value="REJECTED">Rejeitados</SelectItem>
            <SelectItem value="PAID">Pagos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PageWrapper>
        <AdminPaymentsList
          payments={filteredPayments}
          isLoading={isLoading}
          onView={handleViewPayment}
          onApprove={(payment) => {
            setSelectedPayment(payment as unknown as Payment);
            setApproveDialogOpen(true);
          }}
          onReject={(payment) => {
            setSelectedPayment(payment as unknown as Payment);
            setRejectDialogOpen(true);
          }}
          onDelete={(payment) => {
            setSelectedPayment(payment as unknown as Payment);
            setIsDeleteDialogOpen(true);
          }}
          onRefresh={mutate}
        />
      </PageWrapper>

      <PaymentDialogs
        selectedPayment={selectedPayment as unknown as Payment}
        approveDialogOpen={approveDialogOpen}
        setApproveDialogOpen={setApproveDialogOpen}
        handleApprovePayment={handleApprovePayment}
        rejectDialogOpen={rejectDialogOpen}
        setRejectDialogOpen={setRejectDialogOpen}
        handleRejectPayment={handleRejectPayment}
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
        isProcessing={isProcessing}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pagamento? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedPayment) {
                  handleDeletePayment(selectedPayment.id);
                }
              }}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPayments;
