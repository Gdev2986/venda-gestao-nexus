
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupportRequests } from "@/hooks/logistics/use-support-requests";

export const ServiceList = () => {
  const { requests, isLoading, fetchRequests } = useSupportRequests();

  if (isLoading) {
    return <div>Carregando solicitações...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Solicitações de Serviço</h2>
        <Button onClick={fetchRequests}>Atualizar</Button>
      </div>
      
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {request.title}
              <Badge variant="outline">{request.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{request.description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Criado em: {new Date(request.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
