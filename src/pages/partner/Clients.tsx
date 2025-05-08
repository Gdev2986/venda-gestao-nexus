
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BarChart2, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClientStatus } from "@/types";
import { usePartnerClients } from "@/hooks/use-partner-clients";
import { formatCurrency } from "@/lib/utils";
import { PATHS } from "@/routes/paths";

const PartnerClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, isLoading, error } = usePartnerClients();
  const navigate = useNavigate();

  // Handle client detail view
  const handleViewClient = (clientId: string) => {
    navigate(PATHS.PARTNER.CLIENT_DETAILS(clientId));
  };

  // Get status badge variant based on client status
  const getStatusBadgeVariant = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "pending":
        return "warning";
      default:
        return "outline";
    }
  };

  // Get status display text
  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "pending":
        return "Pendente";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div>
      <PageHeader 
        title="Meus Clientes" 
        description="Visualize e acompanhe seus clientes vinculados"
      />
      
      <div className="mb-6 flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8 w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(PATHS.PARTNER.REPORTS)}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Ver Relatórios
          </Button>
        </div>
      </div>

      <PageWrapper>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Clientes Vinculados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full p-8 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-destructive">
                <p>{error}</p>
              </div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium">Nenhum cliente encontrado</h3>
                <p className="text-muted-foreground mt-1">
                  Você ainda não possui clientes vinculados.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients
                      .filter(client => 
                        client.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        client.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        client.phone?.includes(searchTerm)
                      )
                      .map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.business_name}</TableCell>
                          <TableCell>
                            {client.contact_name && (
                              <div>{client.contact_name}</div>
                            )}
                            <div className="text-sm text-muted-foreground">
                              {client.email || "Sem email"} • {client.phone || "Sem telefone"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(client.status) as any}>
                              {getStatusText(client.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(client.balance || 0)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewClient(client.id)}
                            >
                              Ver detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageWrapper>
    </div>
  );
};

export default PartnerClients;
