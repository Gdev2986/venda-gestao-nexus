
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash, Building, Phone, Mail, MapPin, Calendar, CreditCard, DollarSign } from "lucide-react";
import { formatDate, formatCNPJ, formatPhone, formatCEP } from "@/utils/client-utils";
import { useClients } from "@/hooks/use-clients";
import { Client } from "@/types";
import { ClientForm } from "@/components/clients/ClientForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, deleteClient, updateClient, loading } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [machines, setMachines] = useState<any[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(false);
  const [clientBalance, setClientBalance] = useState<{ balance: number; total_sales: number } | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loadingRecentSales, setLoadingRecentSales] = useState(false);

  useEffect(() => {
    if (id) {
      const loadClient = async () => {
        try {
          const foundClient = await getClientById(id);
          setClient(foundClient);
          
          // After loading client, fetch additional data
          fetchClientMachines(id);
          fetchClientBalance(id);
          fetchRecentSales(id);
        } catch (error) {
          console.error("Error loading client:", error);
        }
      };
      
      loadClient();
    }
  }, [id, getClientById]);

  const fetchClientMachines = async (clientId: string) => {
    try {
      setLoadingMachines(true);
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) {
        console.error("Error fetching machines:", error);
        return;
      }
      
      setMachines(data || []);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoadingMachines(false);
    }
  };

  const fetchClientBalance = async (clientId: string) => {
    try {
      setLoadingBalance(true);
      const { data, error } = await supabase
        .from('vw_client_balance')
        .select('balance, total_sales')
        .eq('client_id', clientId)
        .single();
      
      if (error) {
        console.error("Error fetching client balance:", error);
        return;
      }
      
      setClientBalance(data);
    } catch (error) {
      console.error("Error fetching client balance:", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchRecentSales = async (clientId: string) => {
    try {
      setLoadingRecentSales(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching recent sales:", error);
        return;
      }
      
      setRecentSales(data || []);
    } catch (error) {
      console.error("Error fetching recent sales:", error);
    } finally {
      setLoadingRecentSales(false);
    }
  };

  const handleBack = () => {
    navigate("/clients");
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteClient(id);
        navigate("/clients");
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (id && client) {
      try {
        // Preserve optional fields that aren't required by the form
        const updatedData = {
          ...client,
          ...data
        };
        
        const updatedClient = await updateClient(id, updatedData);
        if (updatedClient) {
          setClient(updatedClient);
        }
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating client:", error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!client) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-2">Cliente não encontrado</h1>
          <p className="text-muted-foreground mb-4">
            O cliente que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={handleBack}>Voltar para a lista</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button onClick={handleBack} size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">{client.business_name}</h1>
          </div>

          <div className="flex gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="w-4 h-4 mr-1" />
              Excluir
            </Button>
          </div>
        </div>

        {/* Client Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBalance ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">
                    {clientBalance ? formatCurrency(clientBalance.balance || 0) : 'R$ 0,00'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBalance ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">
                    {clientBalance ? formatCurrency(clientBalance.total_sales || 0) : 'R$ 0,00'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Equipamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMachines ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{machines.length}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Editar cliente</CardTitle>
              <CardDescription>
                Atualize as informações do cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientForm
                id="edit-client-form"
                initialData={client}
                onSubmit={handleUpdate}
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                submitButtonText="Salvar alterações"
              />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="machines">Equipamentos</TabsTrigger>
              <TabsTrigger value="sales">Vendas</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do cliente</CardTitle>
                  <CardDescription>
                    Dados cadastrais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Dados da empresa</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Building className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-medium">{client.business_name}</p>
                            {client.document && <p className="text-sm text-muted-foreground">
                              CNPJ: {formatCNPJ(client.document)}
                            </p>}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Cliente desde: {client.created_at ? formatDate(client.created_at) : "Data não disponível"}
                            </p>
                            {client.updated_at && (
                              <p className="text-sm text-muted-foreground">
                                Última atualização: {formatDate(client.updated_at)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Contato</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-medium">{client.contact_name || "Nome não informado"}</p>
                            <p className="text-sm text-muted-foreground">
                              {client.phone ? formatPhone(client.phone) : "Telefone não informado"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm">{client.email || "Email não informado"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-3">Endereço</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p>{client.address || "Endereço não informado"}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.city || "Cidade não informada"}, {client.state || "UF"} 
                          {client.zip ? ` - CEP: ${formatCEP(client.zip)}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="machines">
              <Card>
                <CardHeader>
                  <CardTitle>Equipamentos</CardTitle>
                  <CardDescription>
                    Equipamentos registrados para este cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingMachines ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : machines.length > 0 ? (
                    <div className="space-y-4 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {machines.map((machine) => (
                          <Card key={machine.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div>
                                  <h4 className="font-medium">Modelo: {machine.model}</h4>
                                  <p className="text-sm text-muted-foreground">Serial: {machine.serial_number}</p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end">
                                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                    machine.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                    machine.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                                    machine.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {machine.status === 'ACTIVE' ? 'Ativo' : 
                                     machine.status === 'INACTIVE' ? 'Inativo' : 
                                     machine.status === 'MAINTENANCE' ? 'Em Manutenção' : 'Bloqueado'}
                                  </span>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {formatDate(machine.created_at)}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Building className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Nenhum equipamento registrado</h3>
                      <p className="text-sm text-muted-foreground max-w-md mt-2">
                        Este cliente ainda não possui equipamentos registrados. Você pode adicionar um novo equipamento para este cliente.
                      </p>
                      <Button className="mt-4">
                        Adicionar equipamento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas</CardTitle>
                  <CardDescription>
                    Histórico de vendas deste cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRecentSales ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : recentSales.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentSales.map((sale) => (
                          <Card key={sale.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div>
                                  <h4 className="font-medium">Código: {sale.code}</h4>
                                  <p className="text-sm text-muted-foreground">Terminal: {sale.terminal}</p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end">
                                  <span className="font-medium">{formatCurrency(sale.gross_amount)}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(sale.date)}
                                  </span>
                                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                    sale.payment_method === 'CREDIT' ? 'bg-blue-100 text-blue-800' : 
                                    sale.payment_method === 'DEBIT' ? 'bg-green-100 text-green-800' : 
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {sale.payment_method === 'CREDIT' ? 'Crédito' : 
                                     sale.payment_method === 'DEBIT' ? 'Débito' : 'Pix'}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="flex justify-center mt-4">
                        <Button variant="outline" onClick={() => navigate('/sales')}>
                          Ver todas as vendas
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Building className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Nenhuma venda registrada</h3>
                      <p className="text-sm text-muted-foreground max-w-md mt-2">
                        Este cliente ainda não possui vendas registradas. As vendas serão exibidas aqui quando forem processadas.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Pagamentos</CardTitle>
                  <CardDescription>
                    Histórico de pagamentos deste cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Building className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Nenhum pagamento registrado</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      Este cliente ainda não possui pagamentos registrados. Os pagamentos serão exibidos aqui quando forem processados.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir o cliente {client.business_name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ClientDetailPage;
