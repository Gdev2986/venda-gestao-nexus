
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BarChart, Building, Calendar, DollarSign, Users } from "lucide-react";
import { PATHS } from "@/routes/paths";
import { PaymentMethod } from "@/types";

interface Client {
  id: string;
  business_name: string;
  document: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at: string;
  status: string;
}

interface Sale {
  id: string;
  code: string;
  terminal: string;
  gross_amount: number;
  net_amount: number;
  date: string;
  payment_method: PaymentMethod;
  client_id: string;
  created_at: string;
  updated_at: string;
  processing_status: string;
}

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "ID do cliente não fornecido"
          });
          navigate(PATHS.PARTNER.CLIENTS);
          return;
        }
        
        // Fetch client details
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("*")
          .eq("id", id)
          .single();
        
        if (clientError || !clientData) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Cliente não encontrado"
          });
          navigate(PATHS.PARTNER.CLIENTS);
          return;
        }
        
        setClient(clientData);
        
        // Fetch recent sales
        const { data: salesData, error: salesError } = await supabase
          .from("sales")
          .select("*")
          .eq("client_id", id)
          .order("date", { ascending: false })
          .limit(5);
        
        if (!salesError && salesData) {
          // Map and convert data to ensure it matches the Sale interface
          const formattedSales: Sale[] = salesData.map(sale => ({
            id: sale.id,
            code: sale.code,
            terminal: sale.terminal,
            gross_amount: sale.gross_amount,
            net_amount: sale.net_amount,
            date: sale.date,
            payment_method: sale.payment_method as PaymentMethod,
            client_id: sale.client_id,
            created_at: sale.created_at,
            updated_at: sale.updated_at,
            processing_status: sale.processing_status
          }));
          
          setRecentSales(formattedSales);
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast({
          variant: "destructive", 
          title: "Erro",
          description: "Erro ao carregar detalhes do cliente"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [id, navigate, toast]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!client) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(PATHS.PARTNER.CLIENTS)} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">{client.business_name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-2 text-primary" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">CNPJ:</span>
                <p>{client.document || "Não informado"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Contato:</span>
                <p>{client.contact_name || "Não informado"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status:</span>
                <p className="capitalize">{client.status || "Ativo"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Cliente desde:</span>
                <p>{formatDate(client.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p>{client.email || "Não informado"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Telefone:</span>
                <p>{client.phone || "Não informado"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Endereço:</span>
                <p>{client.address || "Não informado"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Cidade/Estado:</span>
                <p>
                  {client.city || "Não informado"}
                  {client.state ? `, ${client.state}` : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-primary" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Total de Vendas:</span>
                <p>{recentSales.length} recentes</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Última Venda:</span>
                <p>
                  {recentSales.length > 0 
                    ? formatDate(recentSales[0].date) 
                    : "Nenhuma venda recente"}
                </p>
              </div>
              {/* Add more stats here */}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            Vendas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSales.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              Nenhuma venda recente encontrada para este cliente.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left font-medium">Data</th>
                    <th className="py-2 px-4 text-left font-medium">Código</th>
                    <th className="py-2 px-4 text-left font-medium">Terminal</th>
                    <th className="py-2 px-4 text-left font-medium">Método</th>
                    <th className="py-2 px-4 text-right font-medium">Valor Bruto</th>
                    <th className="py-2 px-4 text-right font-medium">Valor Líquido</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{formatDate(sale.date)}</td>
                      <td className="py-2 px-4">{sale.code}</td>
                      <td className="py-2 px-4">{sale.terminal}</td>
                      <td className="py-2 px-4">{sale.payment_method}</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(sale.gross_amount)}</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(sale.net_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => navigate(`/partner/sales?client=${client.id}`)}>
              <DollarSign className="h-4 w-4 mr-2" />
              Ver Todas as Vendas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetails;
