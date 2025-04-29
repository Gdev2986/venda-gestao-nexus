
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Filter, Upload, Check, X } from "lucide-react";

// Define payment data structure
interface Payment {
  id: string;
  client_id: string;
  client_name: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at?: string;
  pix_key_id: string;
  pix_key: string;
  pix_key_type: string;
  is_boleto: boolean;
  receipt_url?: string;
}

// Define mock payment data
const mockPayments: Payment[] = [
  {
    id: "1",
    client_id: "1",
    client_name: "Empresa ABC",
    amount: 1500,
    status: "pending",
    created_at: "2023-05-15",
    pix_key_id: "123",
    pix_key: "email@empresa.com",
    pix_key_type: "email",
    is_boleto: false
  },
  {
    id: "2",
    client_id: "2",
    client_name: "Empresa XYZ",
    amount: 3200,
    status: "approved",
    created_at: "2023-05-10",
    approved_at: "2023-05-11",
    pix_key_id: "456",
    pix_key: "11999999999",
    pix_key_type: "phone",
    is_boleto: false
  },
  {
    id: "3",
    client_id: "1",
    client_name: "Empresa ABC",
    amount: 2000,
    status: "pending",
    created_at: "2023-05-18",
    pix_key_id: "123",
    pix_key: "email@empresa.com",
    pix_key_type: "email",
    is_boleto: true
  }
];

const statusColors = {
  pending: "bg-amber-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
};

const statusLabels = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

interface PaymentDetailsProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (paymentId: string, newStatus: "pending" | "approved" | "rejected") => void;
  onReceiptUpload: (paymentId: string, file: File) => Promise<void>;
}

const PaymentDetails = ({ payment, isOpen, onClose, onStatusChange, onReceiptUpload }: PaymentDetailsProps) => {
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved" | "rejected">(payment?.status || "pending");
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    if (payment) {
      setSelectedStatus(payment.status);
    }
  }, [payment]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!payment || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      await onReceiptUpload(payment.id, file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatusSave = () => {
    if (!payment) return;
    onStatusChange(payment.id, selectedStatus);
    onClose();
  };

  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
          <DialogDescription>
            Visualizar e gerenciar detalhes do pagamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cliente</p>
              <p>{payment.client_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor</p>
              <p className="font-semibold">R$ {payment.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data</p>
              <p>{payment.created_at}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Método</p>
              <p>{payment.is_boleto ? "Boleto" : "PIX"}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select value={selectedStatus} onValueChange={(value: "pending" | "approved" | "rejected") => setSelectedStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{statusLabels.pending}</SelectItem>
                <SelectItem value="approved">{statusLabels.approved}</SelectItem>
                <SelectItem value="rejected">{statusLabels.rejected}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Comprovante</label>
            {payment.receipt_url ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open(payment.receipt_url, "_blank")}>
                  Visualizar comprovante
                </Button>
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-4 text-center">
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Clique para fazer upload do comprovante</p>
                  <input
                    id="receipt-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
                {isUploading && <p className="mt-2 text-sm">Enviando...</p>}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleStatusSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || 
      (typeFilter === "pix" && !payment.is_boleto) || 
      (typeFilter === "boleto" && payment.is_boleto);
    return matchesStatus && matchesType;
  });

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };
  
  const handleStatusChange = (paymentId: string, newStatus: "pending" | "approved" | "rejected") => {
    // In a real application, this would make an API call to update the status
    const updatedPayments = payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: newStatus, approved_at: newStatus === "approved" ? new Date().toISOString() : payment.approved_at }
        : payment
    );
    
    setPayments(updatedPayments);
    
    toast({
      title: "Status alterado",
      description: `O status do pagamento foi alterado para ${statusLabels[newStatus]}.`,
    });
  };
  
  const handleReceiptUpload = async (paymentId: string, file: File) => {
    // In a real application, this would upload the file to storage
    try {
      // Simulate a successful upload by updating the payment
      const updatedPayments = payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, receipt_url: URL.createObjectURL(file) }
          : payment
      );
      
      setPayments(updatedPayments);
      
      toast({
        title: "Comprovante enviado",
        description: "O comprovante foi enviado com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar comprovante",
        description: "Não foi possível enviar o comprovante. Tente novamente.",
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Pagamentos</h2>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtre os pagamentos por status e tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pagamentos</CardTitle>
            <CardDescription>
              Todos os pagamentos realizados no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Comprovante</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="cursor-pointer" onClick={() => handlePaymentClick(payment)}>
                      <TableCell className="font-medium">{payment.client_name}</TableCell>
                      <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.created_at}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.status]}>
                          {statusLabels[payment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.is_boleto ? "Boleto" : "PIX"}</TableCell>
                      <TableCell>
                        {payment.receipt_url ? (
                          <Badge variant="outline" className="bg-green-100">
                            <Check size={14} className="mr-1" /> Enviado
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <X size={14} className="mr-1" /> Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handlePaymentClick(payment);
                        }}>
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      Nenhum pagamento encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <PaymentDetails 
          payment={selectedPayment}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onStatusChange={handleStatusChange}
          onReceiptUpload={handleReceiptUpload}
        />
      </div>
    </MainLayout>
  );
};

export default Payments;
