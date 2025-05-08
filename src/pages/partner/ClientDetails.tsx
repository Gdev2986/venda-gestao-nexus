
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, MapPin, BarChart3, Building } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PATHS } from "@/routes/paths";
import { usePartnerClients } from "@/hooks/use-partner-clients";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Sale } from "@/types";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, getClientSales, isLoading } = usePartnerClients();
  const [clientSales, setClientSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);

  const client = clients.find(c => c.id === id);

  // Load client sales when client is available
  useEffect(() => {
    const loadSales = async () => {
      if (id) {
        setLoadingSales(true);
        const sales = await getClientSales(id);
        setClientSales(sales);
        setLoadingSales(false);
      }
    };
    
    if (client) {
      loadSales();
    }
  }, [client, id, getClientSales]);

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

  // Format status display text
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

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium">Cliente não encontrado</h3>
        <p className="text-muted-foreground mt-1">
          O cliente solicitado não foi encontrado ou você não tem permissão para acessá-lo.
        </p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate(PATHS.PARTNER.CLIENTS)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para lista de clientes
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title={client.business_name} 
        description="Detalhes do cliente"
        actionLabel="Voltar"
        actionIcon={<ArrowLeft className="h-4 w-4" />}
        actionOnClick={() => navigate(PATHS.PARTNER.CLIENTS)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(client.balance || 0)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientSales.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusBadgeVariant(client.status) as any} className="text-base px-3 py-1">
              {getStatusText(client.status)}
            </Badge>
          </CardContent>
        </Card>
      </div>
      
      <PageWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Nome Fantasia</h3>
                <p className="font-medium">{client.business_name}</p>
              </div>
              
              {client.company_name && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Razão Social</h3>
                  <p>{client.company_name}</p>
                </div>
              )}
              
              {client.document && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">CNPJ/CPF</h3>
                  <p>{client.document}</p>
                </div>
              )}
              
              <Separator />
              
              {client.contact_name && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Contato</h3>
                  <p>{client.contact_name}</p>
                </div>
              )}
              
              {client.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{client.email}</p>
                </div>
              )}
              
              {client.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>{client.phone}</p>
                </div>
              )}
              
              {client.address && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p>{client.address}</p>
                    {client.city && client.state && (
                      <p>{client.city}, {client.state}</p>
                    )}
                    {client.zip && (
                      <p>{client.zip}</p>
                    )}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Cliente desde</h3>
                <p>{client.created_at ? formatDate(new Date(client.created_at)) : "Data não disponível"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Histórico de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSales ? (
                <div className="w-full p-8 flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : clientSales.length === 0 ? (
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium">Nenhuma venda encontrada</h3>
                  <p className="text-muted-foreground mt-1">
                    Este cliente ainda não possui vendas registradas.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Terminal</TableHead>
                        <TableHead>Forma de Pagamento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.code || sale.id.substring(0, 8)}</TableCell>
                          <TableCell>{formatDate(new Date(sale.date))}</TableCell>
                          <TableCell>{sale.terminal}</TableCell>
                          <TableCell>
                            {sale.payment_method === 'credit' && 'Crédito'}
                            {sale.payment_method === 'debit' && 'Débito'}
                            {sale.payment_method === 'pix' && 'PIX'}
                            {sale.payment_method !== 'credit' && 
                             sale.payment_method !== 'debit' && 
                             sale.payment_method !== 'pix' && 
                             sale.payment_method}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(sale.gross_amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
};

export default ClientDetails;
