import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleCheck
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SupportAdmin = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSupportConversations();
  }, []);

  const fetchSupportConversations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_conversations')
        .select(`
          *,
          clients:client_id (business_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error fetching support conversations:", error);
      toast({
        title: "Erro ao carregar solicitações",
        description: "Não foi possível carregar as solicitações de suporte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim() || !selectedConversation) return;
    
    try {
      // First, update the conversation status
      const { error: updateError } = await supabase
        .from('support_conversations')
        .update({ status: 'RESPONDED' })
        .eq('id', selectedConversation.id);
      
      if (updateError) throw updateError;
      
      // Then add the response message
      const { error: messageError } = await supabase
        .from('support_messages')
        .insert({
          conversation_id: selectedConversation.id,
          message: responseText,
          user_id: (await supabase.auth.getUser()).data.user.id,
        });
      
      if (messageError) throw messageError;
      
      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi enviada com sucesso.",
      });
      
      setIsResponseDialogOpen(false);
      setResponseText("");
      await fetchSupportConversations();
    } catch (error) {
      console.error("Error sending response:", error);
      toast({
        title: "Erro ao enviar resposta",
        description: "Não foi possível enviar a resposta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      id: "client",
      header: "Cliente",
      accessorKey: "clients.business_name",
      cell: (info) => info.getValue() || "Cliente não especificado",
    },
    {
      id: "subject",
      header: "Assunto",
      accessorKey: "subject",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge
            variant={
              status === "OPEN" ? "default" : 
              status === "RESPONDED" ? "secondary" : 
              status === "RESOLVED" ? "outline" : 
              "outline"
            }
          >
            {status === "OPEN" ? "Aberto" : 
             status === "RESPONDED" ? "Respondido" : 
             status === "RESOLVED" ? "Resolvido" : 
             status}
          </Badge>
        );
      },
    },
    {
      id: "created_at",
      header: "Data Criação",
      accessorKey: "created_at",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedConversation(info.row.original);
              setIsResponseDialogOpen(true);
            }}
          >
            Responder
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-green-500 text-green-500 hover:bg-green-50"
            onClick={async () => {
              try {
                await supabase
                  .from('support_conversations')
                  .update({ status: 'RESOLVED' })
                  .eq('id', info.row.original.id);
                
                toast({
                  title: "Solicitação resolvida",
                  description: "A solicitação foi marcada como resolvida com sucesso.",
                });
                
                await fetchSupportConversations();
              } catch (error) {
                console.error("Error resolving conversation:", error);
                toast({
                  title: "Erro",
                  description: "Não foi possível marcar como resolvida.",
                  variant: "destructive",
                });
              }
            }}
          >
            <CircleCheck className="h-4 w-4 mr-1" /> Resolver
          </Button>
        </div>
      ),
    },
  ];

  const filteredConversations = conversations.filter(conv => {
    if (activeTab === "pending") return conv.status === "OPEN";
    if (activeTab === "responded") return conv.status === "RESPONDED";
    if (activeTab === "resolved") return conv.status === "RESOLVED";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Central de Suporte</h1>
          <p className="text-muted-foreground">
            Gerencie todas as solicitações de suporte dos clientes.
          </p>
        </div>
        <Button>
          Nova Solicitação
        </Button>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="responded">Respondidas</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <Card className="p-0">
            <DataTable
              columns={columns}
              data={filteredConversations}
              currentPage={1}
              totalPages={1}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Responder Solicitação</DialogTitle>
            <DialogDescription>
              Respondendo à solicitação de {selectedConversation?.clients?.business_name || 'Cliente'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedConversation && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="font-semibold">Assunto: {selectedConversation.subject}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(selectedConversation.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Textarea
                placeholder="Digite sua resposta aqui..."
                className="min-h-[150px]"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendResponse}>
              Enviar Resposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportAdmin;
