
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Client, Sale } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard, DollarSign } from "lucide-react";
import SalesTable from "@/components/sales/SalesTable";
import { format } from "date-fns";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [salesLoading, setSalesLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch client details
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();
          
        if (clientError) throw clientError;
        
        setClient(clientData);
        
        // Fetch sales for this client
        setSalesLoading(true);
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .eq('client_id', id)
          .order('created_at', { ascending: false });
          
        if (salesError) throw salesError;
        
        const formattedSales: Sale[] = salesData.map(sale => ({
          id: sale.id,
          code: sale.code,
          terminal: sale.terminal,
          client_name: sale.client_name,
          gross_amount: sale.gross_amount,
          net_amount: sale.net_amount,
          amount: sale.amount || sale.gross_amount, // Fallback to gross_amount if amount is missing
          date: sale.date,
          payment_method: sale.payment_method,
          client_id: sale.client_id,
          created_at: sale.created_at,
          updated_at: sale.updated_at,
          status: sale.status || "completed" // Default status if missing
        }));
        
        setSales(formattedSales);
        setSalesLoading(false);
      } catch (error: any) {
        console.error('Error fetching client details:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar as informações do cliente"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Cliente não encontrado</h2>
        <p className="text-muted-foreground mt-2">
          O cliente que você está procurando não existe ou foi removido.
        </p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={client.business_name}
        description={`Detalhes do cliente e suas atividades`}
        backButton
      >
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>
      
      <PageWrapper>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Client Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {client.contact_name && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Nome do Contato</h4>
                        <p>{client.contact_name}</p>
                      </div>
                    )}
                    
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${client.email}`} className="hover:underline">
                          {client.email}
                        </a>
                      </div>
                    )}
                    
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    
                    {(client.address || client.city || client.state) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>
                          {client.address && <>{client.address}<br /></>}
                          {client.city && client.state && `${client.city}, ${client.state}`}
                          {client.zip && ` - ${client.zip}`}
                        </span>
                      </div>
                    )}
                    
                    {client.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Cliente desde {format(new Date(client.created_at), 'dd/MM/yyyy')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Financeiras</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Saldo Atual</p>
                          <p className="text-2xl font-semibold">
                            {typeof client.balance === 'number' 
                              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.balance)
                              : 'R$ 0,00'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">Totais de Vendas</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total de Vendas</p>
                          <p className="text-lg font-medium">{sales.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Volume Total</p>
                          <p className="text-lg font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                              .format(sales.reduce((acc, sale) => acc + sale.gross_amount, 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Sales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {salesLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner />
                  </div>
                ) : sales.length > 0 ? (
                  <SalesTable sales={sales.slice(0, 5)} isLoading={false} />
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Este cliente ainda não possui vendas registradas
                  </div>
                )}
                
                {sales.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("sales")}
                    >
                      Ver todas as vendas
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                {salesLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner />
                  </div>
                ) : sales.length > 0 ? (
                  <SalesTable sales={sales} isLoading={false} />
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Este cliente ainda não possui vendas registradas
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </div>
  );
};

export default ClientDetails;
