
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RequestTypeIcon from "./RequestTypeIcon";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/utils/format";
import { SupportChat } from "./SupportChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupportSystem } from "@/hooks/use-support-system";

interface SupportRequest {
  id: string;
  subject: string;
  message: string;
  type: string;
  status: string;
  created_at: string;
  response?: string;
}

interface RequestDetailsDialogProps {
  request: SupportRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDetailsDialog = ({ request, open, onOpenChange }: RequestDetailsDialogProps) => {
  const { messages, sendMessage } = useSupportSystem();

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RequestTypeIcon type={request.type} />
            {request.subject}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium">
              Status: <StatusBadge status={request.status} />
            </span>
            <span className="text-sm text-muted-foreground">
              Criado em: {formatDate(request.created_at)}
            </span>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="chat">Chat de Suporte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Detalhes da Solicitação</h4>
              <div className="bg-muted p-3 rounded-md">
                <p className="whitespace-pre-wrap text-sm">{request.message}</p>
              </div>
            </div>
            
            {request.response && (
              <div>
                <h4 className="text-sm font-medium mb-2">Resposta da Equipe</h4>
                <div className="bg-primary/10 p-3 rounded-md">
                  <p className="whitespace-pre-wrap text-sm">{request.response}</p>
                </div>
              </div>
            )}
            
            {request.status === "OPEN" && (
              <div className="bg-yellow-50 p-3 rounded-md">
                <p className="text-sm text-yellow-800">
                  Sua solicitação será analisada em breve por nossa equipe de suporte.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chat" className="py-4">
            <SupportChat 
              ticketId={request.id} 
              messages={messages}
              onSendMessage={(message) => sendMessage(request.id, message)}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
