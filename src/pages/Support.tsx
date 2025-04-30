
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
}

const Support = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([
    {
      id: "1",
      subject: "Máquina com erro na impressão",
      message: "Minha máquina está imprimindo com falhas nas bordas dos recibos.",
      type: "MACHINE",
      status: "IN_PROGRESS",
      created_at: "2023-06-15T10:30:00Z",
      response: "Estamos enviando um técnico para verificar o problema. Previsão de atendimento: 16/06/2023."
    },
    {
      id: "2",
      subject: "Solicitação de bobinas",
      message: "Preciso de 10 bobinas para a máquina modelo TX-500.",
      type: "SUPPLIES",
      status: "OPEN",
      created_at: "2023-06-18T14:20:00Z"
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  
  // Form states
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [requestType, setRequestType] = useState<"MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER">("MACHINE");
  
  const { toast } = useToast();
  
  const handleCreateRequest = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRequest: SupportRequest = {
        id: `req-${Date.now()}`,
        subject,
        message,
        type: requestType,
        status: "OPEN",
        created_at: new Date().toISOString()
      };
      
      setRequests([newRequest, ...requests]);
      setShowNewRequestDialog(false);
      setSubject("");
      setMessage("");
      setRequestType("MACHINE");
      setIsLoading(false);
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de suporte foi enviada com sucesso.",
      });
    }, 1000);
  };
  
  const handleViewDetails = (request: SupportRequest) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Suporte</h1>
        <Button onClick={() => setShowNewRequestDialog(true)}>
          Nova Solicitação
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações</CardTitle>
          <CardDescription>
            Verifique o status de suas solicitações de suporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getRequestTypeIcon(request.type)}
                          <h3 className="font-medium">{request.subject}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
              <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* New Request Dialog */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Solicitação de Suporte</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar uma nova solicitação de suporte
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Label htmlFor="request-type">Tipo de Solicitação</Label>
                <Select 
                  value={requestType} 
                  onValueChange={(value: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER") => setRequestType(value)}
                >
                  <SelectTrigger id="request-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MACHINE">Máquina</SelectItem>
                    <SelectItem value="SUPPLIES">Suprimentos</SelectItem>
                    <SelectItem value="PAYMENT">Pagamento</SelectItem>
                    <SelectItem value="OTHER">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  placeholder="Descreva brevemente o problema"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div className="col-span-4">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Detalhe sua solicitação"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewRequestDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateRequest} 
              disabled={!subject || !message || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Detalhes da Solicitação</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="whitespace-pre-wrap text-sm">{selectedRequest.message}</p>
                  </div>
                </div>
                
                {selectedRequest.response && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Resposta da Equipe</h4>
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="whitespace-pre-wrap text-sm">{selectedRequest.response}</p>
                    </div>
                  </div>
                )}
                
                {selectedRequest.status === "OPEN" && (
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Sua solicitação será analisada em breve por nossa equipe de suporte.
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailsDialog(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;
