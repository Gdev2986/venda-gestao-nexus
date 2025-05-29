
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types";
import { Partner } from "@/types/partner.types";
import { usePartnerClients } from "@/hooks/use-partner-clients";

interface PartnerClientsTableProps {
  partner: Partner | null;
}

export const PartnerClientsTable = ({ partner }: PartnerClientsTableProps) => {
  const { clients, isLoading, error } = usePartnerClients({ 
    partnerId: partner?.id || '' 
  });

  if (!partner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes do Parceiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Selecione um parceiro para ver seus clientes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes de {partner.company_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes de {partner.company_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p>Erro ao carregar clientes: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Clientes de {partner.company_name}
          <Badge variant="secondary">{clients.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Este parceiro ainda não possui clientes</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.business_name}
                    </TableCell>
                    <TableCell>{client.contact_name || '-'}</TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={client.email || ''}>
                        {client.email || '-'}
                      </div>
                    </TableCell>
                    <TableCell>{client.phone || '-'}</TableCell>
                    <TableCell>{client.city || '-'}</TableCell>
                    <TableCell>
                      {getStatusBadge(client.status || 'active')}
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {(client.balance || 0).toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2 
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
