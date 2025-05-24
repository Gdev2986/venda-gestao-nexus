import { useState, useEffect } from 'react';
import { useRequireAdmin } from '@/hooks/useAuthGuard';
import { PaymentsService } from '@/services/payments.service';
import { Payment, PaymentStatus, PaymentType, PaymentFilters } from '@/types/payment.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { 
  Eye, 
  Download, 
  Upload, 
  MessageSquare, 
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const AdminPayments = () => {
  const { isValidating } = useRequireAdmin();
  const { toast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newStatus, setNewStatus] = useState<PaymentStatus | ''>('');
  const [newNote, setNewNote] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Não renderizar se ainda estiver validando
  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
        <p className="ml-2">Verificando permissões...</p>
      </div>
    );
  }

  const loadPayments = async () => {
    try {
      setLoading(true);
      const result = await PaymentsService.getPayments(filters, page, 25);
      setPayments(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pagamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [filters, page]);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.AWAITING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.PROCESSED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const handleStatusChange = async () => {
    if (!selectedPayment || !newStatus) return;

    try {
      await PaymentsService.updatePaymentStatus(
        selectedPayment.id, 
        newStatus as PaymentStatus, 
        newNote || undefined
      );
      
      toast({
        title: "Status atualizado",
        description: "O status do pagamento foi atualizado com sucesso.",
      });
      
      setShowStatusModal(false);
      setNewStatus('');
      setNewNote('');
      loadPayments();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const handleProofUpload = async () => {
    if (!selectedPayment || !proofFile) return;

    try {
      setUploading(true);
      await PaymentsService.uploadProof(selectedPayment.id, proofFile);
      
      toast({
        title: "Comprovante enviado",
        description: "O comprovante foi enviado com sucesso.",
      });
      
      setShowProofModal(false);
      setProofFile(null);
      loadPayments();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o comprovante.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedPayment || !newNote.trim()) return;

    try {
      await PaymentsService.updatePaymentStatus(
        selectedPayment.id, 
        selectedPayment.status, 
        newNote
      );
      
      toast({
        title: "Nota adicionada",
        description: "A nota foi adicionada com sucesso.",
      });
      
      setShowNoteModal(false);
      setNewNote('');
      loadPayments();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a nota.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Pagamentos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as solicitações de pagamento
          </p>
        </div>
        <Button onClick={loadPayments} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Status</Label>
              <Select 
                value={filters.status || ''} 
                onValueChange={(value) => 
                  setFilters({...filters, status: value as PaymentStatus || undefined})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value={PaymentStatus.AWAITING}>Aguardando</SelectItem>
                  <SelectItem value={PaymentStatus.APPROVED}>Aprovado</SelectItem>
                  <SelectItem value={PaymentStatus.REJECTED}>Rejeitado</SelectItem>
                  <SelectItem value={PaymentStatus.PROCESSED}>Processado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo</Label>
              <Select 
                value={filters.type || ''} 
                onValueChange={(value) => 
                  setFilters({...filters, type: value as PaymentType || undefined})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value={PaymentType.PIX}>Pix</SelectItem>
                  <SelectItem value={PaymentType.TED}>TED</SelectItem>
                  <SelectItem value={PaymentType.BOLETO}>Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Data início</Label>
              <Input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => setFilters({...filters, date_from: e.target.value || undefined})}
              />
            </div>

            <div>
              <Label>Data fim</Label>
              <Input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => setFilters({...filters, date_to: e.target.value || undefined})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Pagamento</CardTitle>
          <CardDescription>
            {payments.length} registros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.client_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.client_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.value)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(payment.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {payment.boleto_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(payment.boleto_url, '_blank')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowProofModal(true);
                            }}
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowNoteModal(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setNewStatus(payment.status);
                              setShowStatusModal(true);
                            }}
                          >
                            Alterar Status
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Pagamento</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="font-medium">{selectedPayment.client_name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedPayment.client_email}</p>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <p>{selectedPayment.type}</p>
                </div>
                <div>
                  <Label>Valor</Label>
                  <p className="font-medium">{formatCurrency(selectedPayment.value)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <Label>Data</Label>
                  <p>{formatDate(selectedPayment.created_at)}</p>
                </div>
              </div>
              
              {selectedPayment.note && (
                <div>
                  <Label>Observações</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedPayment.note}</p>
                </div>
              )}
              
              {selectedPayment.proof_url && (
                <div>
                  <Label>Comprovante</Label>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(selectedPayment.proof_url, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Comprovante
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Alteração de Status */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status do Pagamento</DialogTitle>
            <DialogDescription>
              Selecione o novo status e adicione uma observação se necessário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Novo Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentStatus.AWAITING}>Aguardando</SelectItem>
                  <SelectItem value={PaymentStatus.APPROVED}>Aprovado</SelectItem>
                  <SelectItem value={PaymentStatus.REJECTED}>Rejeitado</SelectItem>
                  <SelectItem value={PaymentStatus.PROCESSED}>Processado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Observação (opcional)</Label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Adicione uma observação sobre a alteração..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleStatusChange} disabled={!newStatus}>
              Atualizar Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Upload de Comprovante */}
      <Dialog open={showProofModal} onOpenChange={setShowProofModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Comprovante</DialogTitle>
            <DialogDescription>
              Faça upload do comprovante de pagamento para o cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Arquivo do Comprovante</Label>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProofModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleProofUpload} 
              disabled={!proofFile || uploading}
            >
              {uploading && <Spinner className="w-4 h-4 mr-2" />}
              Enviar Comprovante
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Nota */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Observação</DialogTitle>
            <DialogDescription>
              Adicione uma observação sobre este pagamento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Observação</Label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Digite sua observação..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddNote} disabled={!newNote.trim()}>
              Adicionar Observação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments; 