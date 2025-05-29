
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSupportTickets } from "@/hooks/use-support-tickets";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NewRequestDialog from "@/components/support/NewRequestDialog";
import RequestDetailsDialog from "@/components/support/RequestDetailsDialog";

interface SupportRequest {
  id: string;
  subject: string;
  message: string;
  type: string;
  status: string;
  created_at: string;
}

const UserSupport = () => {
  const { user } = useAuth();
  const { tickets, isLoading, error } = useSupportTickets();
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleSelectTicket = (ticket: any) => {
    const supportRequest: SupportRequest = {
      id: ticket.id,
      subject: ticket.title,
      message: ticket.description,
      type: 'SUPPORT',
      status: ticket.status,
      created_at: ticket.created_at
    };
    setSelectedRequest(supportRequest);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Suporte"
          description="Gerencie suas solicitações de suporte"
        />
        <Button onClick={() => setIsNewRequestOpen(true)}>
          Nova Solicitação
        </Button>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleSelectTicket(ticket)}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{ticket.title}</CardTitle>
                <Badge variant="outline">{ticket.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{ticket.description}</p>
              <p className="text-sm text-muted-foreground">
                Criado em: {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewRequestDialog
        open={isNewRequestOpen}
        onOpenChange={setIsNewRequestOpen}
      />

      <RequestDetailsDialog
        request={selectedRequest}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default UserSupport;
