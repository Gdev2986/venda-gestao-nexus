
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PATHS } from "@/routes/paths";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { fetchClientById } from "@/api/clientsEnhancedApi";
import { formatCurrency } from "@/lib/utils";
import { Client, ClientStatus } from "@/types";
import { Edit, Building, CreditCard, Key, UserCog, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadClient = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const clientData = await fetchClientById(id);
        setClient(clientData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do cliente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadClient();
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detalhes do Cliente" description="Carregando..." />
        <PageWrapper>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Carregando...</p>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cliente não encontrado" description="O cliente solicitado não existe." />
        <PageWrapper>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="mb-4">O cliente com o ID {id} não foi encontrado.</p>
                <Button onClick={() => navigate(PATHS.ADMIN.CLIENTS)}>
                  Voltar para a lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </PageWrapper>
      </div>
    );
  }
  
  const getStatusBadge = (status?: string) => {
    if (status === ClientStatus.ACTIVE) {
      return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
    } else if (status === ClientStatus.BLOCKED) {
      return <Badge variant="destructive">Bloqueado</Badge>;
    } else {
      return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.business_name}
        description="Detalhes e gerenciamento do cliente"
        backLink={PATHS.ADMIN.CLIENTS}
        backLinkLabel="Voltar para lista"
      />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Informações Gerais</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate(`${PATHS.ADMIN.CLIENTS}/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
            </div>
            <CardDescription>
              Dados cadastrais e informações básicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(client.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Saldo Atual</Label>
                  <div className="text-xl font-semibold mt-1">
                    {formatCurrency(client.balance || 0)}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome da Empresa</Label>
                  <div className="mt-1">{client.business_name}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Documento</Label>
                  <div className="mt-1">{client.document || "Não informado"}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome de Contato</Label>
                  <div className="mt-1">{client.contact_name || "Não informado"}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="mt-1">{client.email || "Não informado"}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <div className="mt-1">{client.phone || "Não informado"}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Endereço</Label>
                  <div className="mt-1">
                    {client.address ? 
                      `${client.address}, ${client.city} - ${client.state}, ${client.zip}` : 
                      "Não informado"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="w-full md:w-80 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Parceiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-8 w-8 mr-2 text-muted-foreground" />
                <div>
                  <p>{client.partner_name || "Sem parceiro vinculado"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" size="sm">
                Alterar Parceiro
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Bloco de Taxas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 mr-2 text-muted-foreground" />
                <div>
                  <p>{client.fee_plan_name || "Sem bloco de taxas"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" size="sm">
                Alterar Bloco de Taxas
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar Dados
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                {client.status === ClientStatus.ACTIVE ? "Bloquear Cliente" : "Desbloquear Cliente"}
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Key className="h-4 w-4 mr-2" />
                Resetar Senha
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <UserCog className="h-4 w-4 mr-2" />
                Gerenciar Acesso
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="machines" className="w-full">
        <TabsList>
          <TabsTrigger value="machines">Máquinas ({client.machines?.length || 0})</TabsTrigger>
          <TabsTrigger value="pix">Chaves Pix</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="machines">
          <PageWrapper>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Máquinas Vinculadas</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {client.machines && client.machines.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.machines.map((machine: any) => (
                        <TableRow key={machine.id}>
                          <TableCell>{machine.serial_number}</TableCell>
                          <TableCell>{machine.model}</TableCell>
                          <TableCell>
                            <Badge>{machine.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4">
                    Este cliente não possui máquinas vinculadas.
                  </p>
                )}
              </CardContent>
            </Card>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="pix">
          <PageWrapper>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Chaves Pix</CardTitle>
                  <Button size="sm">
                    Adicionar Chave
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4">
                  Este cliente não possui chaves Pix cadastradas.
                </p>
              </CardContent>
            </Card>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="history">
          <PageWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Alterações</CardTitle>
                <CardDescription>
                  Registro de alterações sensíveis no cadastro do cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4">
                  Não há registros de alterações para este cliente.
                </p>
              </CardContent>
            </Card>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetails;
