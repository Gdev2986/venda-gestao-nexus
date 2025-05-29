
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Clock, User } from "lucide-react";

const ClientSupport = () => {
  // Mock support tickets
  const tickets = [
    {
      id: "1",
      title: "Problema com máquina SMP001",
      status: "OPEN",
      priority: "HIGH",
      created_at: "2024-01-20T10:30:00Z",
      updated_at: "2024-01-20T14:15:00Z",
      description: "Máquina não está processando pagamentos"
    },
    {
      id: "2",
      title: "Dúvida sobre taxas",
      status: "RESOLVED", 
      priority: "LOW",
      created_at: "2024-01-18T09:00:00Z",
      updated_at: "2024-01-19T16:30:00Z",
      description: "Gostaria de entender melhor as taxas aplicadas"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">Aberto</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">Em Andamento</Badge>;
      case "RESOLVED":
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Resolvido</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="destructive">Alta</Badge>;
      case "MEDIUM":
        return <Badge variant="secondary">Média</Badge>;
      case "LOW":
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suporte"
        description="Abra chamados e acompanhe suas solicitações de suporte"
      />
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Meus Chamados</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Chamado
        </Button>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  {ticket.title}
                </CardTitle>
                <div className="flex gap-2">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {ticket.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Atualizado em {new Date(ticket.updated_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientSupport;
