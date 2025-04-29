
import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Phone,
  Send,
  Paperclip,
  User,
  MoreVertical,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Suporte Técnico",
    avatar: "ST",
    lastMessage: "Gostaria de ajudar com algo mais?",
    unread: 0,
    timestamp: "10:30",
    online: true,
    messages: [
      {
        id: "m1",
        sender: "agent",
        content: "Olá! Como posso ajudar você hoje?",
        timestamp: "10:20",
      },
      {
        id: "m2",
        sender: "user",
        content: "Estou com um problema na minha máquina. Ela não está processando pagamentos.",
        timestamp: "10:22",
      },
      {
        id: "m3",
        sender: "agent",
        content: "Entendo. Você já verificou se a máquina está conectada à internet?",
        timestamp: "10:25",
      },
      {
        id: "m4",
        sender: "user",
        content: "Sim, já verifiquei e está conectada normalmente.",
        timestamp: "10:28",
      },
      {
        id: "m5",
        sender: "agent",
        content: "Gostaria de ajudar com algo mais?",
        timestamp: "10:30",
      },
    ],
  },
  {
    id: "2",
    name: "Financeiro",
    avatar: "FN",
    lastMessage: "Sua solicitação de reembolso foi aprovada.",
    unread: 2,
    timestamp: "09:45",
    online: false,
    messages: [
      {
        id: "m1",
        sender: "agent",
        content: "Bom dia! Como posso ajudar com questões financeiras?",
        timestamp: "09:30",
      },
      {
        id: "m2",
        sender: "user",
        content: "Preciso solicitar um reembolso para uma transação duplicada.",
        timestamp: "09:32",
      },
      {
        id: "m3",
        sender: "agent",
        content: "Claro, vou verificar isso para você. Pode me informar a data e o valor da transação?",
        timestamp: "09:35",
      },
      {
        id: "m4",
        sender: "user",
        content: "Foi ontem, dia 28/08, no valor de R$ 250,00.",
        timestamp: "09:38",
      },
      {
        id: "m5",
        sender: "agent",
        content: "Sua solicitação de reembolso foi aprovada.",
        timestamp: "09:45",
      },
    ],
  },
  {
    id: "3",
    name: "Vendas",
    avatar: "VD",
    lastMessage: "Vamos agendar uma demonstração então!",
    unread: 0,
    timestamp: "Ontem",
    online: true,
    messages: [
      {
        id: "m1",
        sender: "agent",
        content: "Olá! Soube que você está interessado em adquirir mais máquinas. Posso ajudar?",
        timestamp: "Ontem, 14:20",
      },
      {
        id: "m2",
        sender: "user",
        content: "Sim, estou interessado em expandir meus negócios e precisaria de mais 3 máquinas.",
        timestamp: "Ontem, 14:25",
      },
      {
        id: "m3",
        sender: "agent",
        content: "Ótimo! Temos um modelo novo que pode ser perfeito para o seu caso. Gostaria de conhecer mais?",
        timestamp: "Ontem, 14:30",
      },
      {
        id: "m4",
        sender: "user",
        content: "Sim, tenho interesse. Como podemos proceder?",
        timestamp: "Ontem, 14:35",
      },
      {
        id: "m5",
        sender: "agent",
        content: "Vamos agendar uma demonstração então!",
        timestamp: "Ontem, 14:40",
      },
    ],
  },
];

const ChatMessage = ({ message, isCurrentUser }) => {
  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg p-3",
        isCurrentUser
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted"
      )}
    >
      <p className="text-sm">{message.content}</p>
      <span className="ml-auto text-xs text-muted-foreground/50">
        {message.timestamp}
      </span>
    </div>
  );
};

const ConversationItem = ({
  conversation,
  isActive,
  onClick,
  showBadge = false,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-muted/50",
        isActive && "bg-muted"
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarFallback className={conversation.online ? "border-2 border-green-500" : ""}>
          {conversation.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium">{conversation.name}</div>
          <div className="text-xs text-muted-foreground">{conversation.timestamp}</div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage}
          </p>
          {conversation.unread > 0 && showBadge && (
            <Badge variant="default" className="h-5 w-5 rounded-full">
              {conversation.unread}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

const Support = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [showConversations, setShowConversations] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation?.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversation.id) {
        const updatedMessages = [
          ...conv.messages,
          {
            id: `m${conv.messages.length + 1}`,
            sender: "user",
            content: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];

        return {
          ...conv,
          lastMessage: newMessage.trim(),
          timestamp: "Agora",
          messages: updatedMessages,
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setActiveConversation(
      updatedConversations.find((conv) => conv.id === activeConversation.id)
    );
    setNewMessage("");

    // Simulate agent response after a delay
    setTimeout(() => {
      const botResponses = [
        "Entendido! Vou verificar isso para você.",
        "Vou encaminhar essa solicitação para o setor responsável.",
        "Claro, posso ajudar com isso. Mais alguma informação?",
        "Obrigado pelo seu contato. Precisamos de mais alguns detalhes para prosseguir.",
        "Vamos resolver isso o mais rápido possível.",
      ];
      
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const updatedConversationsWithResponse = conversations.map((conv) => {
        if (conv.id === activeConversation.id) {
          const updatedMessages = [
            ...conv.messages,
            {
              id: `m${conv.messages.length + 2}`,
              sender: "agent",
              content: newMessage.trim(),
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            {
              id: `m${conv.messages.length + 3}`,
              sender: "agent",
              content: randomResponse,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ];

          return {
            ...conv,
            lastMessage: randomResponse,
            timestamp: "Agora",
            messages: updatedMessages,
          };
        }
        return conv;
      });

      setConversations(updatedConversationsWithResponse);
      setActiveConversation(
        updatedConversationsWithResponse.find((conv) => conv.id === activeConversation.id)
      );
    }, 1000);
  };

  const handleFileUpload = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O envio de arquivos estará disponível em breve.",
    });
  };

  const handleCallSupport = () => {
    toast({
      title: "Iniciando chamada",
      description: "Um atendente entrará em contato em breve.",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleCallSupport}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowConversations(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" /> Conversas
            </Button>
          </div>
        </div>

        <div className="flex gap-4 flex-1 min-h-0">
          {/* Conversation list - hidden on mobile */}
          <div className="hidden md:block w-80 border rounded-lg overflow-hidden">
            <div className="p-3 border-b bg-muted/30">
              <div className="font-medium">Conversas</div>
            </div>
            <div className="p-2 h-[calc(100%-57px)] overflow-y-auto">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeConversation?.id === conv.id}
                  onClick={() => setActiveConversation(conv)}
                  showBadge={true}
                />
              ))}
            </div>
          </div>

          {/* Mobile conversation drawer */}
          <Sheet open={showConversations} onOpenChange={setShowConversations}>
            <SheetContent side="left" className="w-[90%] sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Conversas</SheetTitle>
              </SheetHeader>
              <div className="p-2 overflow-y-auto">
                {conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => {
                      setActiveConversation(conv);
                      setShowConversations(false);
                    }}
                    showBadge={true}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Chat area */}
          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
            {activeConversation ? (
              <>
                {/* Chat header */}
                <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={activeConversation.online ? "border-2 border-green-500" : ""}>
                        {activeConversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {activeConversation.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activeConversation.online ? "Online" : "Offline"}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeConversation.messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender === "user"}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleFileUpload}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4 mr-2" /> Enviar
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <User className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-muted-foreground">
                  Escolha uma conversa existente ou inicie uma nova para começar
                  a conversar com nossa equipe de suporte.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Support;
