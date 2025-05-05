
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, DownloadIcon, ExternalLink } from "lucide-react";
import { PATHS } from "@/routes/paths";
import { PaymentStatus, PaymentType } from "@/types";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // For demo, we'll use mock data
        // In a real app, fetch from Supabase
        const mockPayment = {
          id: id,
          amount: 1250.00,
          status: PaymentStatus.PENDING,
          created_at: "2023-06-15T14:30:00Z",
          updated_at: "2023-06-15T14:30:00Z",
          description: "Pagamento para liberação de máquina",
          client_id: "123",
          approved_at: null,
          receipt_url: "https://example.com/receipt.pdf",
          payment_type: PaymentType.PIX,
          rejection_reason: "",
          client: {
            id: "123",
            business_name: "Padaria Central",
            email: "contato@padariacentral.com",
            document: "12.345.678/0001-90",
            phone: "(11) 98765-4321"
          },
          pix_key: {
            key: "12345678900",
            type: "CPF",
            name: "João da Silva",
            bank_name: "Banco XYZ"
          }
        };
        
        setTimeout(() => {
          setPayment(mockPayment);
          setClientData(mockPayment.client);
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error("Error fetching payment details:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os detalhes do pagamento.",
        });
        setLoading(false);
      }
    };
    
    fetchPaymentDetails();
  }, [id, toast]);
  
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // In a real app, this would call Supabase
      // await supabase.from('payment_requests').update({
      //   status: 'APPROVED',
      //   approved_at: new Date().toISOString(),
      // }).eq('id', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPayment({ ...payment, status: PaymentStatus.APPROVED });
      
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso."
      });
      
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar o pagamento."
      });
    } finally {
      setIsApproving(false);
    }
  };
  
  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa fornecer um motivo para a rejeição."
      });
      return;
    }
    
    setIsRejecting(true);
    try {
      // In a real app, this would call Supabase
      // await supabase.from('payment_requests').update({
      //   status: 'REJECTED',
      //   rejection_reason: rejectionReason
      // }).eq('id', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPayment({ 
        ...payment, 
        status: PaymentStatus.REJECTED,
        rejection_reason: rejectionReason 
      });
      
      setRejectDialogOpen(false);
      
      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso."
      });
      
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível rejeitar o pagamento."
      });
    } finally {
      setIsRejecting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case PaymentStatus.APPROVED:
        return <Badge className="bg-emerald-500">Aprovado</Badge>;
      case PaymentStatus.REJECTED:
        return <Badge variant="destructive">Rejeitado</Badge>;
      case PaymentStatus.PAID:
        return <Badge className="bg-blue-500">Pago</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'às' p", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  if (loading) {
    return (
      <>
        <PageHeader 
          title="Detalhes do Pagamento"
          description="Carregando informações..."
        >
          <Button variant="outline" onClick={() => navigate(PATHS.ADMIN.PAYMENTS)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </PageHeader>
        
        <PageWrapper>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </PageWrapper>
      </>
    );
  }
  
  if (!payment) {
    return (
      <>
        <PageHeader 
          title="Detalhes do Pagamento"
          description="Pagamento não encontrado"
        >
          <Button variant="outline" onClick={() => navigate(PATHS.ADMIN.PAYMENTS)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </PageHeader>
        
        <PageWrapper>
          <Card>
            <CardHeader>
              <CardTitle>Pagamento não encontrado</CardTitle>
              <CardDescription>
                O pagamento solicitado não foi encontrado ou não existe.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate(PATHS.ADMIN.PAYMENTS)}>
                Voltar para Pagamentos
              </Button>
            </CardFooter>
          </Card>
        </PageWrapper>
      </>
    );
  }
  
  return (
    <>
      <PageHeader 
        title="Detalhes do Pagamento"
        description={`Solicitação #${payment.id.substring(0, 8)}`}
      >
        <Button variant="outline" onClick={() => navigate(PATHS.ADMIN.PAYMENTS)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </PageHeader>
      
      <PageWrapper>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Pagamento {formatCurrency(payment.amount)}</CardTitle>
                  <CardDescription>
                    Criado em {formatDate(payment.created_at)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(payment.status)}
                  
                  {payment.status === PaymentStatus.PENDING && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive border-destructive"
                        onClick={() => setRejectDialogOpen(true)}
                      >
                        <X className="mr-2 h-4 w-4" /> Rejeitar
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={handleApprove}
                        disabled={isApproving}
                      >
                        <Check className="mr-2 h-4 w-4" /> Aprovar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="client">Cliente</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Valor</h3>
                      <p className="text-lg font-medium">{formatCurrency(payment.amount)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                      <p className="text-lg font-medium">{getStatusBadge(payment.status)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Criação</h3>
                      <p>{formatDate(payment.created_at)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Tipo de Pagamento</h3>
                      <p>{payment.payment_type}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h3>
                      <p>{payment.description || "Nenhuma descrição fornecida."}</p>
                    </div>
                    
                    {payment.receipt_url && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Comprovante</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> Ver Comprovante
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={payment.receipt_url} download>
                              <DownloadIcon className="mr-2 h-4 w-4" /> Baixar
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {payment.status === PaymentStatus.REJECTED && payment.rejection_reason && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-destructive mb-1">Motivo da Rejeição</h3>
                        <p className="text-destructive">{payment.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Dados PIX</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Chave</h4>
                        <p>{payment.pix_key.key}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo</h4>
                        <p>{payment.pix_key.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Titular</h4>
                        <p>{payment.pix_key.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Banco</h4>
                        <p>{payment.pix_key.bank_name || "Não informado"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="client">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Nome da Empresa</h3>
                      <p className="text-lg font-medium">{clientData.business_name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">CNPJ</h3>
                      <p>{clientData.document || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                      <p>{clientData.email || "Não informado"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Telefone</h3>
                      <p>{clientData.phone || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button onClick={() => navigate(PATHS.ADMIN.CLIENT_DETAILS(clientData.id))}>
                      Ver Detalhes do Cliente
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Pagamento</DialogTitle>
            <DialogDescription>
              Forneça um motivo para a rejeição deste pagamento. Isso será exibido para o cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Motivo da rejeição..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRejectDialogOpen(false)}
              disabled={isRejecting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectSubmit}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? "Rejeitando..." : "Rejeitar Pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentDetails;
