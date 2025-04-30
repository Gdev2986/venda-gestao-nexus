import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PaymentStatus } from "@/types";

// Define the schema for the payment form
const paymentFormSchema = z.object({
  receiptUrl: z.string().url("URL inválida").optional(),
});

// Define the type for the payment form values
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Define the type for a payment - making rejection_reason optional
type Payment = {
  id: string;
  created_at: string;
  updated_at?: string;
  amount: number;
  status: PaymentStatus;
  client_id: string;
  approved_at: string | null;
  receipt_url: string | null;
  rejection_reason?: string | null; // Make this optional to match the existing data
  client_name: string | null;
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentFormOpen, setPaymentFormOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const { user } = useAuth();
  const { toast: showToast } = useToast();

  // Initialize the form using useForm hook
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      receiptUrl: "",
    },
  });

  // Filter payments based on status
  const fetchPayments = async () => {
    try {
      let query = supabase
        .from("payment_requests")
        .select(`
          id, created_at, amount, status, client_id, approved_at, receipt_url, 
          clients (name)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== "ALL") {
        query = query.eq('status', filterStatus as PaymentStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Map the data to the Payment type
      const mappedPayments: Payment[] = data.map((payment: any) => ({
        id: payment.id,
        created_at: payment.created_at,
        updated_at: payment.created_at,
        amount: payment.amount,
        status: payment.status as PaymentStatus,
        client_id: payment.client_id,
        approved_at: payment.approved_at,
        receipt_url: payment.receipt_url,
        // Don't include rejection_reason if it's not in the data
        client_name: payment.clients?.name || null,
      }));

      setPayments(mappedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      showToast({
        title: "Erro",
        description: "Não foi possível carregar os pagamentos.",
        variant: "destructive",
      });
    }
  };

  // Handle opening the payment form
  const handleOpenPaymentForm = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentFormOpen(true);
  };

  // Handle closing the payment form
  const handleClosePaymentForm = () => {
    setSelectedPayment(null);
    setPaymentFormOpen(false);
    paymentForm.reset();
  };

  // Handle form submission
  const onSubmit = async (data: PaymentFormValues) => {
    if (!selectedPayment) return;
    await handleRespond(selectedPayment.id, true, data.receiptUrl);
  };

  // Fix the type error in handleRespond function
  const handleRespond = async (paymentId: string, approved: boolean, receiptUrl?: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Previous implementation logic - ensure it matches the expected signature
      const status = approved ? PaymentStatus.APPROVED : PaymentStatus.REJECTED;
      const update: Record<string, any> = { status };
      
      if (approved && receiptUrl) {
        update.receipt_url = receiptUrl;
        update.approved_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from("payment_requests")
        .update(update)
        .eq("id", paymentId);
      
      if (error) throw new Error(error.message);
      
      setPaymentFormOpen(false);
      await fetchPayments();
      
      showToast({
        title: approved ? "Pagamento aprovado!" : "Pagamento rejeitado",
        description: `O pagamento foi ${approved ? "aprovado" : "rejeitado"} com sucesso.`,
        variant: approved ? "default" : "destructive",
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao responder pagamento:", error);
      showToast({
        title: "Erro",
        description: `Não foi possível ${approved ? "aprovar" : "rejeitar"} o pagamento.`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter((payment) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      payment.id.toLowerCase().includes(searchTermLower) ||
      (payment.client_name?.toLowerCase().includes(searchTermLower) || false) ||
      payment.amount.toString().includes(searchTermLower) ||
      payment.status.toLowerCase().includes(searchTermLower)
    );
  });

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      title: "Copiado!",
      description: message,
    });
  };

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const handleFilterStatusChange = (value: string) => {
    setFilterStatus(value);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Pagamentos</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <Input
            type="text"
            placeholder="Buscar pagamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value={PaymentStatus.PENDING}>Pendente</SelectItem>
              <SelectItem value={PaymentStatus.APPROVED}>Aprovado</SelectItem>
              <SelectItem value={PaymentStatus.REJECTED}>Rejeitado</SelectItem>
              <SelectItem value={PaymentStatus.PAID}>Pago</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payments Table */}
        <Table>
          <TableCaption>Lista de todos os pagamentos.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {payment.id}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(payment.id, "ID do pagamento copiado!")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{formatDate(payment.created_at)}</TableCell>
                <TableCell>{payment.client_name}</TableCell>
                <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === PaymentStatus.PENDING
                        ? "secondary"
                        : payment.status === PaymentStatus.APPROVED
                          ? "default"
                          : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenPaymentForm(payment)} disabled={payment.status !== PaymentStatus.PENDING}>
                    Responder
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Payment Form Dialog */}
        <Dialog open={isPaymentFormOpen} onOpenChange={handleClosePaymentForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Responder Pagamento</DialogTitle>
              <DialogDescription>
                Detalhes do pagamento e ações para aprovar ou rejeitar.
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id" className="text-right">
                    ID
                  </Label>
                  <Input type="text" id="id" value={selectedPayment.id} readOnly className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Valor
                  </Label>
                  <Input type="text" id="amount" value={selectedPayment.amount.toFixed(2)} readOnly className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="created_at" className="text-right">
                    Data de Criação
                  </Label>
                  <Input type="text" id="created_at" value={formatDate(selectedPayment.created_at)} readOnly className="col-span-3" />
                </div>

                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={paymentForm.control}
                      name="receiptUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Comprovante (Opcional)</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="Insira a URL do comprovante" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="secondary" onClick={handleClosePaymentForm}>
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Aprovar Pagamento
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRespond(selectedPayment.id, false)}
                        disabled={isSubmitting}
                      >
                        Rejeitar Pagamento
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Payments;
