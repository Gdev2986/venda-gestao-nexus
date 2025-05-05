
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MoreHorizontal, Edit, Eye, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientStatus, Client } from "@/types";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PATHS } from "@/routes/paths";

interface ClientsListProps {
  clients: Client[];
  isLoading: boolean;
  onSearch: (term: string) => void;
  onFilter: (filters: ClientFilters) => void;
  onCreateClient: () => void;
  onViewClient: (clientId: string) => void;
  onLinkPartner: (clientId: string, partnerId: string) => void;
  onEditBalance: (clientId: string, newBalance: number) => void;
  partners?: { id: string; company_name: string }[];
  feePlans?: { id: string; name: string }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ClientFilters {
  searchTerm?: string;
  partnerId?: string;
  feePlanId?: string;
  balanceRange?: [number, number];
}

export const ClientsList = ({
  clients,
  isLoading,
  onSearch,
  onFilter,
  onCreateClient,
  onViewClient,
  onLinkPartner,
  onEditBalance,
  partners = [],
  feePlans = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: ClientsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ClientFilters>({});
  const [editBalanceClient, setEditBalanceClient] = useState<Client | null>(null);
  const [newBalance, setNewBalance] = useState<number>(0);
  const [linkPartnerClient, setLinkPartnerClient] = useState<Client | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Add debounce to search
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (newFilters: Partial<ClientFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handleEditBalance = () => {
    if (editBalanceClient) {
      onEditBalance(editBalanceClient.id, newBalance);
      toast({
        title: "Saldo atualizado",
        description: `O saldo de ${editBalanceClient.business_name} foi atualizado com sucesso.`,
      });
      setEditBalanceClient(null);
    }
  };

  const handleLinkPartner = () => {
    if (linkPartnerClient && selectedPartnerId) {
      onLinkPartner(linkPartnerClient.id, selectedPartnerId);
      toast({
        title: "Parceiro vinculado",
        description: `O parceiro foi vinculado ao cliente ${linkPartnerClient.business_name} com sucesso.`,
      });
      setLinkPartnerClient(null);
      setSelectedPartnerId("");
    }
  };

  const renderStatusBadge = (status?: string) => {
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

  const statusFormatted = {
    [ClientStatus.ACTIVE]: "Ativo",
    [ClientStatus.BLOCKED]: "Bloqueado",
    [ClientStatus.PENDING]: "Pendente",
    [ClientStatus.INACTIVE]: "Inativo",
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>Gerencie todos os clientes cadastrados no sistema</CardDescription>
            </div>
            <Button onClick={onCreateClient}>Criar Novo Cliente</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes por nome, e-mail, telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-background"
              />
            </div>
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtros</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filtros avançados</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Parceiro vinculado</label>
                    <Select
                      value={filters.partnerId || ""}
                      onValueChange={(value) => handleFilterChange({ partnerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um parceiro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os parceiros</SelectItem>
                        {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bloco de taxas</label>
                    <Select
                      value={filters.feePlanId || ""}
                      onValueChange={(value) => handleFilterChange({ feePlanId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano de taxas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os planos</SelectItem>
                        {feePlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Saldo</label>
                      <span className="text-xs text-muted-foreground">
                        {filters.balanceRange ? `R$${filters.balanceRange[0]} - R$${filters.balanceRange[1]}` : "Qualquer valor"}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 10000]}
                      min={0}
                      max={10000}
                      step={100}
                      value={filters.balanceRange || [0, 10000]}
                      onValueChange={(value) => handleFilterChange({ balanceRange: value as [number, number] })}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Máquinas</TableHead>
                  <TableHead>Plano de Taxas</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Carregando clientes...
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.business_name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.partner_name || "Sem parceiro"}</TableCell>
                      <TableCell>{client.machines_count || 0}</TableCell>
                      <TableCell>{client.fee_plan_name || "Plano padrão"}</TableCell>
                      <TableCell>R$ {client.balance?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>{renderStatusBadge(client.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewClient(client.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver detalhes</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setLinkPartnerClient(client);
                              setSelectedPartnerId(client.partner_id || "");
                            }}>
                              <Link className="mr-2 h-4 w-4" />
                              <span>Vincular parceiro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditBalanceClient(client);
                              setNewBalance(client.balance || 0);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar saldo</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center mx-2">
                  Página {currentPage} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog to edit balance */}
      <Dialog open={!!editBalanceClient} onOpenChange={() => setEditBalanceClient(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar saldo do cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cliente: {editBalanceClient?.business_name}
              </label>
              <div className="flex items-center gap-2">
                <span>R$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={newBalance}
                  onChange={(e) => setNewBalance(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBalanceClient(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditBalance}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog to link partner */}
      <Dialog open={!!linkPartnerClient} onOpenChange={() => setLinkPartnerClient(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vincular parceiro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Cliente: {linkPartnerClient?.business_name}
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
            <Button variant="outline" onClick={() => setLinkPartnerClient(null)}>
              Cancelar
            </Button>
            <Button onClick={handleLinkPartner}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
