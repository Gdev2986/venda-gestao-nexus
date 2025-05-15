
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sale, Client } from "@/types";
import { FileText, ArrowLeft } from "lucide-react";
import { PATHS } from "@/routes/paths";

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchClientDetails = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock client data
          const mockClient: Client = {
            id: clientId || "1",
            business_name: "Empresa Cliente XYZ",
            email: "contato@xyz.com",
            phone: "(11) 3456-7890",
            status: "active",
            address: "Rua A, 123",
            city: "São Paulo",
            state: "SP",
            balance: 5000,
            created_at: new Date().toISOString()
          };
          
          // Mock sales data
          const mockSalesData: Sale[] = [
            {
              id: "s1",
              client_id: clientId || "1",
              client_name: "Empresa Cliente XYZ",
              code: "VDA001",
              terminal: "TERM001",
              date: new Date().toISOString(),
              payment_method: "CREDIT",
              gross_amount: 1500,
              net_amount: 1425,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: "s2",
              client_id: clientId || "1",
              client_name: "Empresa Cliente XYZ",
              code: "VDA002",
              terminal: "TERM001",
              date: new Date(Date.now() - 86400000).toISOString(),
              payment_method: "PIX",
              gross_amount: 980,
              net_amount: 980,
              created_at: new Date(Date.now() - 86400000).toISOString(),
              updated_at: new Date(Date.now() - 86400000).toISOString()
            }
          ];
          
          setClient(mockClient);
          setSales(mockSalesData);
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os detalhes do cliente."
        });
        setIsLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [clientId, toast]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  return (
    <div>
      <PageHeader 
        title={client?.business_name || "Detalhes do Cliente"}
        description="Visualize informações detalhadas e vendas do cliente"
        actionLabel="Voltar"
        actionOnClick={() => navigate(PATHS.PARTNER.CLIENTS)}
      >
        <Button variant="outline" onClick={() => navigate(PATHS.PARTNER.CLIENTS)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>
      
      <PageWrapper>
        <div className="grid gap-6">
          {/* Client Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : client ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium">Nome / Razão Social</p>
                    <p className="text-lg">{client.business_name}</p>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium">Email</p>
                      <p>{client.email || "Não informado"}</p>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium">Telefone</p>
                      <p>{client.phone || "Não informado"}</p>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium">Status</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        client.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : client.status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {client.status === "active" 
                          ? "Ativo" 
                          : client.status === "inactive" 
                            ? "Inativo" 
                            : "Pendente"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Endereço</p>
                    <p>
                      {client.address || "Não informado"}
                      {client.city && client.state && `, ${client.city}/${client.state}`}
                    </p>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium">Cliente desde</p>
                      <p>{client.created_at ? formatDate(client.created_at) : "Não informado"}</p>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium">Saldo</p>
                      <p className="text-lg font-bold">{formatCurrency(client.balance || 0)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4">Cliente não encontrado</p>
              )}
            </CardContent>
          </Card>
          
          {/* Sales Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ) : sales && sales.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2">Código</th>
                        <th className="pb-2">Data</th>
                        <th className="pb-2">Terminal</th>
                        <th className="pb-2">Pagamento</th>
                        <th className="pb-2 text-right">Valor Bruto</th>
                        <th className="pb-2 text-right">Valor Líquido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map(sale => (
                        <tr key={sale.id} className="border-b hover:bg-muted/50">
                          <td className="py-3">{sale.code}</td>
                          <td className="py-3">{formatDate(sale.date)}</td>
                          <td className="py-3">{sale.terminal}</td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                              sale.payment_method === "PIX" 
                                ? "bg-green-100 text-green-800" 
                                : sale.payment_method === "CREDIT"
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-purple-100 text-purple-800"
                            }`}>
                              {sale.payment_method === "PIX" 
                                ? "PIX" 
                                : sale.payment_method === "CREDIT" 
                                  ? "Crédito" 
                                  : "Débito"}
                            </span>
                          </td>
                          <td className="py-3 text-right">{formatCurrency(sale.gross_amount)}</td>
                          <td className="py-3 text-right">{formatCurrency(sale.net_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4">Nenhuma venda registrada</p>
              )}
              
              {sales && sales.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Exportar Relatório
                  </Button>
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
