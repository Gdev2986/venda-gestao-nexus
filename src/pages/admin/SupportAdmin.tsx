
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, ClipboardList, Loader2, Printer, Send } from "lucide-react";

// Define types
interface SupportRequest {
  id: string;
  subject: string;
  message: string;
  type: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  created_at: string;
  response?: string;
  user_name?: string;
  user_email?: string;
}

const SupportAdmin = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([
    {
      id: "1",
      subject: "Máquina com erro na impressão",
      message: "Minha máquina está imprimindo com falhas nas bordas dos recibos.",
      type: "MACHINE",
      status: "IN_PROGRESS",
      created_at: "2023-06-15T10:30:00Z",
      response: "Estamos enviando um técnico para verificar o problema. Previsão de atendimento: 16/06/2023.",
      user_name: "João Silva",
      user_email: "joao.silva@exemplo.com"
    },
    {
      id: "2",
      subject: "Solicitação de bobinas",
      message: "Preciso de 10 bobinas para a máquina modelo TX-500.",
      type: "SUPPLIES",
      status: "OPEN",
      created_at: "2023-06-18T14:20:00Z",
      user_name: "Maria Souza",
      user_email: "maria.souza@exemplo.com"
    },
    {
      id: "3",
      subject: "Problema com pagamento",
      message: "Não recebi o comprovante do pagamento realizado no dia 15/06.",
      type: "PAYMENT",
      status: "RESOLVED",
      created_at: "2023-06-16T09:15:00Z",
      response: "Comprovante enviado por e-mail. Favor verificar sua caixa de entrada.",
      user_name: "Carlos Oliveira",
      user_email: "carlos.oliveira@exemplo.com"
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { toast } = useToast();
  
  const handleViewDetails = (request: SupportRequest) => {
    setSelectedRequest(request);
    setReplyText(request.response || "");
    setShowDetailsDialog(true);
  };

  const handleStatusChange = (status: "OPEN" | "IN_PROGRESS" | "RESOLVED") => {
    if (!selectedRequest) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status } 
            : req
        )
      );
      
      setSelectedRequest(prev => prev ? { ...prev, status } : null);
      setIsLoading(false);
      
      toast({
        title: "Status atualizado",
        description: `Status da solicitação alterado para ${getStatusLabel(status)}.`,
      });
    }, 500);
  };
  
  const handleSendReply = () => {
    if (!selectedRequest || !replyText.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, response: replyText, status: "IN_PROGRESS" } 
            : req
        )
      );
      
      setSelectedRequest(prev => prev ? { ...prev, response: replyText, status: "IN_PROGRESS" } : null);
      setIsLoading(false);
      setShowDetailsDialog(false);
      
      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi enviada ao cliente com sucesso.",
      });
    }, 800);
  };
  
  const getRequestTypeLabel = (type: string) => {
    switch(type) {
      case "MACHINE": return "Máquina";
      case "SUPPLIES": return "Suprimentos";
      case "PAYMENT": return "Pagamento";
      case "OTHER": return "Outros";
      default: return type;
    }
  };
  
  const getRequestTypeIcon = (type: string) => {
    switch(type) {
      case "MACHINE": return <Printer className="h-4 w-4" />;
      case "SUPPLIES": return <ClipboardList className="h-4 w-4" />;
      case "PAYMENT": return <CheckCircle2 className="h-4 w-4" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "OPEN":
        return <Badge className="bg-green-500">Aberto</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-amber-500">Em Andamento</Badge>;
      case "RESOLVED":
        return <Badge className="bg-gray-500">Resolvido</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case "OPEN": return "Aberto";
      case "IN_PROGRESS": return "Em Andamento";
      case "RESOLVED": return "Resolvido";
      default: return status;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = activeTab === "all" 
    ? requests 
    : requests.filter(req => req.status === activeTab.toUpperCase());
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Central de Suporte</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Suporte</CardTitle>
          <CardDescription>
            Gerencie todas as solicitações de suporte em um só lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="open">Abertos</TabsTrigger>
              <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
              <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="space-y-4">
              {filteredRequests.length > 0 ? (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getRequestTypeIcon(request.type)}
                              <h3 className="font-medium">{request.subject}</h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>De: {request.user_name}</span>
                              <span>•</span>
                              <span>Tipo: {getRequestTypeLabel(request.type)}</span>
                              <span>•</span>
                              <span>Criado em: {formatDate(request.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(request.status)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                            >
                              Detalhes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma solicitação {activeTab === "all" ? "encontrada" : `no status "${getStatusLabel(activeTab.toUpperCase())}"`}.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Request Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getRequestTypeIcon(selectedRequest.type)}
                  {selectedRequest.subject}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium">
                    Status: {getStatusBadge(selectedRequest.status)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Criado em: {formatDate(selectedRequest.created_at)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>De: {selectedRequest.user_name} ({selectedRequest.user_email})</span>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Detalhes da Solicitação</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="whitespace-pre-wrap text-sm">{selectedRequest.message}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Responder ao Cliente</h4>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    rows={4}
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Atualizar Status</h4>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={selectedRequest.status === "OPEN" ? "default" : "outline"}
                      onClick={() => handleStatusChange("OPEN")}
                    >
                      Aberto
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedRequest.status === "IN_PROGRESS" ? "default" : "outline"}
                      onClick={() => handleStatusChange("IN_PROGRESS")}
                    >
                      Em Andamento
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedRequest.status === "RESOLVED" ? "default" : "outline"}
                      onClick={() => handleStatusChange("RESOLVED")}
                    >
                      Resolvido
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailsDialog(false)}
                >
                  Fechar
                </Button>
                <Button 
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Resposta
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportAdmin;
