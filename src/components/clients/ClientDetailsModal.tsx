
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Client, ClientStatus } from "@/types";
import { useClients } from "@/hooks/use-clients";
import { usePartners } from "@/hooks/use-partners";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, KeyRound, Lock, Unlock, Plus, Link2, DollarSign } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ClientDetailsModalProps {
  clientId?: string;
  isOpen: boolean;
  onClose: () => void;
  onClientUpdated?: () => void;
}

const ClientDetailsModal = ({ clientId, isOpen, onClose, onClientUpdated }: ClientDetailsModalProps) => {
  const { toast } = useToast();
  const { getClientById, updateClient, loading } = useClients();
  const { partners } = usePartners();
  
  const [client, setClient] = useState<Client | null>(null);
  const [isPartnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [isFeePlanDialogOpen, setFeePlanDialogOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [selectedFeePlanId, setSelectedFeePlanId] = useState<string>("");
  const [isEditDataDialogOpen, setEditDataDialogOpen] = useState(false);
  const [isEditBalanceDialogOpen, setEditBalanceDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  const [newBalance, setNewBalance] = useState<string>("0");
  
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

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientDetails(clientId);
    }
  }, [isOpen, clientId]);

  const fetchClientDetails = async (id: string) => {
    try {
      const client = await getClientById(id);
      if (client) {
        // Add mock data
        setClient({
          ...client,
          partner_name: partners.find(p => p.id === client.partner_id)?.company_name,
          machines_count: 3, // Mock data
          fee_plan_name: "Plano Básico", // Mock data
          fee_plan_id: "1", // Mock data
          balance: client.balance || 0,
          status: client.status || ClientStatus.ACTIVE,
          machines: mockMachines,
        });
        setSelectedPartnerId(client.partner_id || "");
        setSelectedFeePlanId(client.fee_plan_id || "1"); // Mock data
        setNewBalance(client.balance?.toString() || "0");
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
      if (onClientUpdated) onClientUpdated();
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
      if (onClientUpdated) onClientUpdated();
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
      
      if (onClientUpdated) onClientUpdated();
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
      if (onClientUpdated) onClientUpdated();
    } catch (err) {
      console.error("Error updating client data:", err);
      toast({
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar os dados do cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBalance = async () => {
    if (!client) return;
    
    try {
      const numericBalance = parseFloat(newBalance);
      
      await updateClient(client.id, { balance: numericBalance });
      
      toast({
        title: "Saldo atualizado",
        description: "O saldo do cliente foi atualizado com sucesso. O cliente será notificado desta alteração.",
      });
      
      setClient({
        ...client,
        balance: numericBalance,
      });
      
      setEditBalanceDialogOpen(false);
      if (onClientUpdated) onClientUpdated();
    } catch (err) {
      console.error("Error updating balance:", err);
      toast({
        title: "Erro ao atualizar saldo",
        description: "Não foi possível atualizar o saldo do cliente. Tente novamente.",
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

  if (loading || !client) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-6">
            <Spinner />
            <span className="ml-2">Carregando detalhes do cliente...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>{client.business_name}</span>
              <div>{formatStatus(client.status)}</div>
            </DialogTitle>
            <DialogDescription>
              Cliente desde {new Date(client.created_at || "").toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main information */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Informações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Nome/Razão Social</h4>
                    <p className="font-medium">{client.business_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">E-mail</h4>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Telefone</h4>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Documento (CPF/CNPJ)</h4>
                    <p className="font-medium">{client.document || "Não informado"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Endereço</h4>
                    <p className="font-medium">{client.address || "Não informado"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Cidade/Estado</h4>
                    <p className="font-medium">
                      {client.city || "Não informado"}{client.city && client.state ? ", " : ""}{client.state || ""}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">CEP</h4>
                    <p className="font-medium">{client.zip || "Não informado"}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDataDialogOpen(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Editar Dados
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <Tabs defaultValue="machines">
                <TabsList>
                  <TabsTrigger value="machines">Máquinas Vinculadas</TabsTrigger>
                  <TabsTrigger value="pixkeys">Chaves Pix</TabsTrigger>
                </TabsList>
                <TabsContent value="machines" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Máquinas Vinculadas</h3>
                      <Button size="sm" variant="outline">
                        <Link2 className="mr-2 h-4 w-4" /> Vincular Máquina
                      </Button>
                    </div>
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
                            <TableCell colSpan={3} className="text-center py-4">
                              Nenhuma máquina vinculada a este cliente.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="pixkeys" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Chaves Pix</h3>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Chave
                      </Button>
                    </div>
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
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Financial information */}
            <div className="col-span-1 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Informações Financeiras</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Saldo Atual</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">R$ {(client.balance || 0).toFixed(2)}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditBalanceDialogOpen(true)}
                      >
                        <DollarSign className="mr-2 h-4 w-4" /> Editar Saldo
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Parceiro Vinculado</h4>
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
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Bloco de Taxas</h4>
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
                </div>
              </div>
              
              <div className="space-y-2 flex flex-col">
                <Button
                  variant="outline"
                  onClick={() => setResetPasswordDialogOpen(true)}
                  className="justify-start"
                >
                  <KeyRound className="mr-2 h-4 w-4" /> Resetar Senha
                </Button>
                
                <Button
                  variant={client.status === ClientStatus.ACTIVE ? "destructive" : "default"}
                  onClick={handleToggleStatus}
                  className="justify-start mt-2"
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
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Dialog to edit balance */}
      <AlertDialog open={isEditBalanceDialogOpen} onOpenChange={setEditBalanceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Saldo do Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              O cliente será notificado sobre esta alteração. Insira abaixo o novo valor do saldo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Novo Saldo (R$)</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Use valores negativos para indicar débitos.
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateBalance}>Atualizar Saldo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientDetailsModal;
