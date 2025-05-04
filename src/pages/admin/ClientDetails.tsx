
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client, ClientStatus, PixKey } from "@/types";
import { useClients } from "@/hooks/use-clients";
import { useToast } from "@/hooks/use-toast";

import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PATHS } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  FileText, 
  Wallet, 
  Users, 
  ReceiptIcon, 
  Key,
  Ban,
  Pencil,
  Lock,
  LinkIcon,
  Calendar,
  CircleCheckIcon
} from "lucide-react";
import { usePartners } from "@/hooks/use-partners";
import { cn } from "@/lib/utils";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [machines, setMachines] = useState<any[]>([]);

  const { getClientById, updateClient } = useClients();
  const { partners, getPartners } = usePartners();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchClientData(id);
      fetchPartners();
    }
  }, [id]);

  const fetchClientData = async (clientId: string) => {
    setLoading(true);
    try {
      const clientData = await getClientById(clientId);
      
      if (!clientData) {
        toast({
          variant: "destructive",
          title: "Cliente não encontrado",
          description: "O cliente solicitado não foi encontrado."
        });
        navigate(PATHS.ADMIN.CLIENTS);
        return;
      }
      
      setClient(clientData);
      
      // Set the initial partner ID
      if (clientData.partner_id) {
        setSelectedPartnerId(clientData.partner_id);
      }
      
      // In a real app, also fetch:
      // 1. Pix keys
      // 2. Machines
      // 3. Fee groups
      // For now using mock data
      setPixKeys([
        {
          id: "1",
          user_id: clientId,
          key_type: "CPF",
          type: "CPF",
          key: "123.456.789-00",
          owner_name: clientData.business_name || "",
          name: clientData.business_name || "",
          isDefault: true,
          is_default: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bank_name: "Banco XYZ"
        }
      ]);
      
      setMachines([
        {
          id: "1",
          serial_number: "MCH12345",
          model: "Terminal 3000",
          status: "ACTIVE"
        },
        {
          id: "2",
          serial_number: "MCH67890",
          model: "Terminal 3000",
          status: "MAINTENANCE"
        }
      ]);
      
    } catch (error) {
      console.error("Error fetching client:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar cliente",
        description: "Não foi possível carregar os dados do cliente."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      await getPartners();
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const handleGoBack = () => {
    navigate(PATHS.ADMIN.CLIENTS);
  };

  const handleUpdatePartner = async () => {
    if (!client) return;
    
    try {
      await updateClient(client.id, { partner_id: selectedPartnerId || null });
      
      // Refresh client data
      await fetchClientData(client.id);
      
      toast({
        title: "Parceiro atualizado",
        description: "O parceiro do cliente foi atualizado com sucesso."
      });
      
      setPartnerDialogOpen(false);
    } catch (error) {
      console.error("Error updating partner:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar parceiro",
        description: "Não foi possível atualizar o parceiro do cliente."
      });
    }
  };

  const handleToggleBlockStatus = async () => {
    if (!client) return;
    
    const newStatus = client.status === ClientStatus.BLOCKED ? 
      ClientStatus.ACTIVE : ClientStatus.BLOCKED;
    
    try {
      await updateClient(client.id, { status: newStatus });
      
      // Refresh client data
      await fetchClientData(client.id);
      
      toast({
        title: newStatus === ClientStatus.BLOCKED ? "Cliente bloqueado" : "Cliente desbloqueado",
        description: newStatus === ClientStatus.BLOCKED ? 
          "O cliente foi bloqueado com sucesso." : 
          "O cliente foi desbloqueado com sucesso."
      });
      
      setBlockDialogOpen(false);
    } catch (error) {
      console.error("Error updating client status:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do cliente."
      });
    }
  };

  const handleResetPassword = () => {
    toast({
      title: "Solicitação enviada",
      description: "Um e-mail para redefinição de senha foi enviado ao cliente."
    });
  };

  const handleEditClient = () => {
    if (client) {
      navigate(`${PATHS.ADMIN.CLIENTS}/edit/${client.id}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-10 w-48" />
        </div>
        
        <div className="grid gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Cliente não encontrado</h2>
        <Button onClick={handleGoBack}>Voltar para lista de clientes</Button>
      </div>
    );
  }

  const getStatusBadge = (status?: ClientStatus) => {
    switch (status) {
      case ClientStatus.ACTIVE:
        return <Badge className="bg-green-500">Ativo</Badge>;
      case ClientStatus.BLOCKED:
        return <Badge variant="destructive">Bloqueado</Badge>;
      case ClientStatus.PENDING:
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendente</Badge>;
      default:
        return <Badge variant="outline">Não definido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader 
          title={client.business_name}
          description="Detalhes do cliente"
        />
        <div className="ml-auto flex gap-2">
          {getStatusBadge(client.status as ClientStatus)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Client info */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Gerais</CardTitle>
            <Button variant="outline" size="sm" onClick={handleEditClient}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Nome</h3>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{client.business_name}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Contato</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{client.contact_name || "Não informado"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">E-mail</h3>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email || "Não informado"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Telefone</h3>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone || "Não informado"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Documento</h3>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{client.document || "Não informado"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Saldo Atual</h3>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(
                      "font-medium",
                      (client.balance ?? 0) > 0 ? "text-green-600" : 
                      (client.balance ?? 0) < 0 ? "text-red-600" : ""
                    )}>
                      R$ {((client.balance ?? 0) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Cadastrado em</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(client.created_at)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Última atualização</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(client.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Parceiro Vinculado</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{client.partner_name || "Nenhum parceiro vinculado"}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPartnerDialogOpen(true)}
                  >
                    Alterar
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bloco de Taxas</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{client.fee_group_name || "Bloco padrão"}</span>
                  </div>
                  <Button variant="outline" size="sm">Alterar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column - Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" onClick={handleEditClient}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar Dados Pessoais
            </Button>
            
            <Button
              className={cn(
                "w-full justify-start",
                client.status === ClientStatus.BLOCKED ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              )}
              onClick={() => setBlockDialogOpen(true)}
            >
              <Ban className="mr-2 h-4 w-4" />
              {client.status === ClientStatus.BLOCKED ? "Desbloquear Cliente" : "Bloquear Cliente"}
            </Button>
            
            <Button variant="outline" className="w-full justify-start" onClick={handleResetPassword}>
              <Lock className="mr-2 h-4 w-4" />
              Resetar Senha
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="machines">
        <TabsList>
          <TabsTrigger value="machines">Máquinas</TabsTrigger>
          <TabsTrigger value="pixkeys">Chaves Pix</TabsTrigger>
          <TabsTrigger value="transactions">Histórico de Transações</TabsTrigger>
        </TabsList>
        <TabsContent value="machines" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Máquinas Vinculadas</CardTitle>
              <Badge variant="outline" className="bg-slate-100">{machines.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Serial</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Modelo</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machines.map((machine) => (
                      <tr key={machine.id} className="border-b">
                        <td className="p-4">{machine.serial_number}</td>
                        <td className="p-4">{machine.model}</td>
                        <td className="p-4">
                          <Badge 
                            className={
                              machine.status === "ACTIVE" ? "bg-green-500" : 
                              machine.status === "MAINTENANCE" ? "bg-yellow-500" : "bg-red-500"
                            }
                          >
                            {machine.status === "ACTIVE" ? "Ativo" : 
                             machine.status === "MAINTENANCE" ? "Manutenção" : "Inativo"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pixkeys" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Chaves Pix</CardTitle>
              <Button size="sm">
                <Key className="mr-2 h-4 w-4" />
                Adicionar Chave
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipo</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Chave</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Padrão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pixKeys.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted-foreground">
                          Nenhuma chave Pix cadastrada.
                        </td>
                      </tr>
                    ) : (
                      pixKeys.map((key) => (
                        <tr key={key.id} className="border-b">
                          <td className="p-4">{key.type}</td>
                          <td className="p-4">{key.key}</td>
                          <td className="p-4">{key.name}</td>
                          <td className="p-4">
                            {key.isDefault && (
                              <CircleCheckIcon className="h-4 w-4 text-green-500" />
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground">
                  Histórico de transações em desenvolvimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Partner Dialog */}
      <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Parceiro</DialogTitle>
            <DialogDescription>
              Escolha um novo parceiro para vincular a este cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um parceiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem parceiro</SelectItem>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.company_name || partner.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPartnerDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdatePartner}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {client.status === ClientStatus.BLOCKED ? "Desbloquear Cliente" : "Bloquear Cliente"}
            </DialogTitle>
            <DialogDescription>
              {client.status === ClientStatus.BLOCKED 
                ? "Esta ação irá permitir que o cliente realize operações normalmente."
                : "Esta ação irá impedir que o cliente realize operações."
              }
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleToggleBlockStatus}
              className={client.status === ClientStatus.BLOCKED ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {client.status === ClientStatus.BLOCKED ? "Desbloquear" : "Bloquear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetails;
