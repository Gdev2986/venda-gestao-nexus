
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { usePartners } from "@/hooks/use-partners";
import { Client, ClientStatus } from "@/types";
import { ArrowLeft, Edit, Lock, Unlock, KeyRound, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock fee plans until we have a real API
const mockFeePlans = [
  { id: "1", name: "Básico" },
  { id: "2", name: "Intermediário" },
  { id: "3", name: "Premium" },
];

// Mock machines until we have a real API
const mockMachines = [
  { id: "1", serial_number: "MAC001", status: "ACTIVE", model: "PAX S920" },
  { id: "2", serial_number: "MAC002", status: "ACTIVE", model: "Gertec MP35" },
  { id: "3", serial_number: "MAC003", status: "INACTIVE", model: "PAX D210" },
];

// Mock Pix keys until we have a real API
const mockPixKeys = [
  { id: "1", type: "CPF", key: "123.456.789-01", name: "Chave Principal" },
  { id: "2", type: "EMAIL", key: "financeiro@empresa.com.br", name: "Email Financeiro" },
];

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getClientById, updateClient, loading, error } = useClients();
  const { partners, loading: partnersLoading, refreshPartners } = usePartners();
  
  const [client, setClient] = useState<Client | null>(null);
  const [isPartnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [isFeePlanDialogOpen, setFeePlanDialogOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [selectedFeePlanId, setSelectedFeePlanId] = useState<string>("");
  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [isEditDataDialogOpen, setEditDataDialogOpen] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});

  useEffect(() => {
    if (id) {
      fetchClientDetails(id);
    }
    refreshPartners();
  }, [id]);

  const fetchClientDetails = async (clientId: string) => {
    try {
      const client = await getClientById(clientId);
      if (client) {
        // Add mock data
        setClient({
          ...client,
          partner_name: partners.find(p => p.id === client.partner_id)?.company_name,
          machines_count: 3, // Mock data
          fee_plan_name: "Plano Básico", // Mock data
          fee_plan_id: "1", // Mock data
          balance: 2500.75, // Mock data
          status: ClientStatus.ACTIVE,
          machines: mockMachines,
        });
        setSelectedPartnerId(client.partner_id || "");
        setSelectedFeePlanId("1"); // Mock data
        setEditedClient({
          business_name: client.business_name,
          email: client.email,
          phone: client.phone,
          document: client.document,
          address: client.address,
          city: client.city,
          state: client.state,
          zip: client.zip,
        });
      }
    } catch (err) {
      console.error("Error fetching client details:", err);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os detalhes do cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleLinkPartner = async () => {
    if (!client) return;
    
    try {
      await updateClient(client.id, { partner_id: selectedPartnerId || null });
      
      toast({
        title: "Parceiro atualizado",
        description: "O parceiro foi atualizado com sucesso.",
      });
      
      setClient({
        ...client,
        partner_id: selectedPartnerId,
        partner_name: partners.find(p => p.id === selectedPartnerId)?.company_name || "",
      });
      
      setPartnerDialogOpen(false);
    } catch (err) {
      console.error("Error linking partner:", err);
      toast({
        title: "Erro ao vincular parceiro",
        description: "Não foi possível vincular o parceiro ao cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFeePlan = async () => {
    if (!client) return;
    
    try {
      await updateClient(client.id, { fee_plan_id: selectedFeePlanId });
      
      toast({
        title: "Plano de taxas atualizado",
        description: "O plano de taxas foi atualizado com sucesso.",
      });
      
      setClient({
        ...client,
        fee_plan_id: selectedFeePlanId,
        fee_plan_name: mockFeePlans.find(p => p.id === selectedFeePlanId)?.name || "",
      });
      
      setFeePlanDialogOpen(false);
    } catch (err) {
      console.error("Error updating fee plan:", err);
      toast({
        title: "Erro ao atualizar plano",
        description: "Não foi possível atualizar o plano de taxas. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async () => {
    if (!client) return;
    
    const newStatus = client.status === ClientStatus.ACTIVE 
      ? ClientStatus.BLOCKED 
      : ClientStatus.ACTIVE;
    
    try {
      await updateClient(client.id, { status: newStatus });
      
      toast({
        title: newStatus === ClientStatus.ACTIVE ? "Cliente ativado" : "Cliente bloqueado",
        description: newStatus === ClientStatus.ACTIVE 
          ? "O cliente foi ativado com sucesso." 
          : "O cliente foi bloqueado com sucesso.",
      });
      
      setClient({
        ...client,
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating client status:", err);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    // In a real app, this would call an API to reset the password
    toast({
      title: "Senha redefinida",
      description: "Um email de redefinição de senha foi enviado para o cliente.",
    });
    setResetPasswordDialogOpen(false);
  };

  const handleUpdateClientData = async () => {
    if (!client) return;
    
    try {
      await updateClient(client.id, editedClient);
      
      toast({
        title: "Dados atualizados",
        description: "Os dados do cliente foram atualizados com sucesso.",
      });
      
      setClient({
        ...client,
        ...editedClient,
      });
      
      setEditDataDialogOpen(false);
    } catch (err) {
      console.error("Error updating client data:", err);
      toast({
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar os dados do cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedClient({
      ...editedClient,
      [name]: value,
    });
  };

  if (!client) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Detalhes do Cliente" 
          description="Carregando informações..."
        />
        <PageWrapper>
          <div className="flex justify-center items-center h-64">
            <p>Carregando dados do cliente...</p>
          </div>
        </PageWrapper>
      </div>
    );
  }

  // Helper function to format status
  const formatStatus = (status?: string) => {
    switch (status) {
      case ClientStatus.ACTIVE:
        return <Badge variant="outline" className="bg-green-50 text-green-700">Ativo</Badge>;
      case ClientStatus.BLOCKED:
        return <Badge variant="outline" className="bg-red-50 text-red-700">Bloqueado</Badge>;
      case ClientStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pendente</Badge>;
      case ClientStatus.INACTIVE:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Inativo</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-50 text-green-700">Ativo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.business_name}</h1>
          <p className="text-muted-foreground">
            Cliente desde {new Date(client.created_at || "").toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(PATHS.ADMIN.CLIENTS)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
          </Button>
          <Button
            variant={client.status === ClientStatus.ACTIVE ? "destructive" : "default"}
            onClick={handleToggleStatus}
          >
            {client.status === ClientStatus.ACTIVE ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Bloquear Cliente
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" /> Ativar Cliente
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main information */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>Dados cadastrais e informações de contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Nome/Razão Social</h3>
                <p className="font-medium">{client.business_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">E-mail</h3>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Telefone</h3>
                <p className="font-medium">{client.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Documento (CPF/CNPJ)</h3>
                <p className="font-medium">{client.document || "Não informado"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Endereço</h3>
                <p className="font-medium">{client.address || "Não informado"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Cidade/Estado</h3>
                <p className="font-medium">
                  {client.city || "Não informado"}{client.city && client.state ? ", " : ""}{client.state || ""}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">CEP</h3>
                <p className="font-medium">{client.zip || "Não informado"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <div className="font-medium">{formatStatus(client.status)}</div>
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setEditDataDialogOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" /> Editar Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Financial information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Financeiras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Saldo Atual</h3>
              <p className="text-2xl font-bold">R$ {client.balance?.toFixed(2) || "0.00"}</p>
            </div>
            <Separator />
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Parceiro Vinculado</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPartnerDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-medium">{client.partner_name || "Sem parceiro"}</p>
            </div>
            <Separator />
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Bloco de Taxas</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFeePlanDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-medium">{client.fee_plan_name || "Plano padrão"}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setResetPasswordDialogOpen(true)}
            >
              <KeyRound className="mr-2 h-4 w-4" /> Resetar Senha
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs for additional information */}
      <Tabs defaultValue="machines">
        <TabsList>
          <TabsTrigger value="machines">Máquinas Vinculadas</TabsTrigger>
          <TabsTrigger value="pixkeys">Chaves Pix</TabsTrigger>
        </TabsList>
        <TabsContent value="machines" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Máquinas Vinculadas</CardTitle>
              <CardDescription>Lista de máquinas associadas a este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.machines && client.machines.length > 0 ? (
                    client.machines.map((machine) => (
                      <TableRow key={machine.id}>
                        <TableCell>{machine.serial_number}</TableCell>
                        <TableCell>{machine.model}</TableCell>
                        <TableCell>
                          {machine.status === "ACTIVE" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">Ativa</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700">Inativa</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6">
                        Nenhuma máquina vinculada a este cliente.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pixkeys" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Chaves Pix</CardTitle>
                <CardDescription>Chaves Pix cadastradas para recebimentos</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Chave
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Chave</TableHead>
                    <TableHead>Nome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPixKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>{key.type}</TableCell>
                      <TableCell>{key.key}</TableCell>
                      <TableCell>{key.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog to change partner */}
      <Dialog open={isPartnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Parceiro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cliente: {client.business_name}
              </label>
              <Select
                value={selectedPartnerId}
                onValueChange={setSelectedPartnerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um parceiro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum parceiro</SelectItem>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPartnerDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleLinkPartner}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog to change fee plan */}
      <Dialog open={isFeePlanDialogOpen} onOpenChange={setFeePlanDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Plano de Taxas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cliente: {client.business_name}
              </label>
              <Select
                value={selectedFeePlanId}
                onValueChange={setSelectedFeePlanId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano de taxas" />
                </SelectTrigger>
                <SelectContent>
                  {mockFeePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeePlanDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateFeePlan}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog to reset password */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resetar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>
              Você está prestes a enviar um e-mail para <strong>{client.email}</strong> com instruções para redefinição de senha.
            </p>
            <p>Deseja prosseguir?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleResetPassword}>Enviar E-mail</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog to edit client data */}
      <Dialog open={isEditDataDialogOpen} onOpenChange={setEditDataDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Dados do Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome/Razão Social</label>
              <Input
                name="business_name"
                value={editedClient.business_name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <Input
                name="email"
                type="email"
                value={editedClient.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input
                name="phone"
                value={editedClient.phone || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Documento (CPF/CNPJ)</label>
              <Input
                name="document"
                value={editedClient.document || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Endereço</label>
              <Input
                name="address"
                value={editedClient.address || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cidade</label>
                <Input
                  name="city"
                  value={editedClient.city || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Input
                  name="state"
                  value={editedClient.state || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CEP</label>
              <Input
                name="zip"
                value={editedClient.zip || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDataDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateClientData}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetails;
