import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Users, Building } from "lucide-react";

interface Partner {
  id: string;
  company_name: string;
  commission_rate: number;
  created_at: string;
  clientCount: number;
}

interface Client {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: string;
  partner_id?: string;
}

const AdminPartnersAndClients = () => {
  const { toast } = useToast();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [partnerClients, setPartnerClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mockPartners: Partner[] = [
      {
        id: '1',
        company_name: 'TechSolutions Ltda',
        commission_rate: 0.03,
        created_at: '2024-01-15',
        clientCount: 5
      },
      {
        id: '2',
        company_name: 'Vendas Pro',
        commission_rate: 0.025,
        created_at: '2024-02-10',
        clientCount: 3
      },
      {
        id: '3',
        company_name: 'Digital Partners',
        commission_rate: 0.035,
        created_at: '2024-03-05',
        clientCount: 8
      }
    ];

    const mockClients: Client[] = [
      {
        id: '1',
        business_name: 'Restaurante Sabor & Arte',
        contact_name: 'João Silva',
        email: 'joao@saborarte.com',
        phone: '(11) 99999-1111',
        status: 'ACTIVE',
        partner_id: '1'
      },
      {
        id: '2',
        business_name: 'Loja Fashion Style',
        contact_name: 'Maria Santos',
        email: 'maria@fashionstyle.com',
        phone: '(11) 99999-2222',
        status: 'ACTIVE',
        partner_id: '1'
      },
      {
        id: '3',
        business_name: 'Mercado do Bairro',
        contact_name: 'Pedro Costa',
        email: 'pedro@mercadobairro.com',
        phone: '(11) 99999-3333',
        status: 'INACTIVE'
      },
      {
        id: '4',
        business_name: 'Farmácia Saúde Total',
        contact_name: 'Ana Oliveira',
        email: 'ana@saudetotal.com',
        phone: '(11) 99999-4444',
        status: 'ACTIVE',
        partner_id: '2'
      },
      {
        id: '5',
        business_name: 'Auto Center Premium',
        contact_name: 'Carlos Mendes',
        email: 'carlos@autocenterpremium.com',
        phone: '(11) 99999-5555',
        status: 'ACTIVE'
      }
    ];

    setPartners(mockPartners);
    setClients(mockClients);
  }, []);

  useEffect(() => {
    if (selectedPartner) {
      const partnerRelatedClients = clients.filter(client => client.partner_id === selectedPartner.id);
      setPartnerClients(partnerRelatedClients);
    } else {
      setPartnerClients([]);
    }
    setSelectedClients([]);
  }, [selectedPartner, clients]);

  const handlePartnerSelect = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const handleClientSelect = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const handleSelectAllClients = (checked: boolean) => {
    if (checked) {
      setSelectedClients(partnerClients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleVinculateClients = () => {
    if (!selectedPartner) {
      toast({
        title: "Selecione um parceiro",
        description: "Por favor, selecione um parceiro antes de vincular clientes",
        variant: "destructive"
      });
      return;
    }

    if (selectedClients.length === 0) {
      toast({
        title: "Selecione clientes",
        description: "Por favor, selecione pelo menos um cliente para vincular",
        variant: "destructive"
      });
      return;
    }

    setClients(prev => prev.map(client => 
      selectedClients.includes(client.id) 
        ? { ...client, partner_id: selectedPartner.id }
        : client
    ));

    setSelectedClients([]);

    toast({
      title: "Clientes vinculados",
      description: `${selectedClients.length} cliente(s) vinculado(s) ao parceiro ${selectedPartner.company_name}`,
    });
  };

  const handleDesvinculateClients = () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Selecione clientes",
        description: "Por favor, selecione pelo menos um cliente para desvincular",
        variant: "destructive"
      });
      return;
    }

    setClients(prev => prev.map(client => 
      selectedClients.includes(client.id) 
        ? { ...client, partner_id: undefined }
        : client
    ));

    setSelectedClients([]);

    toast({
      title: "Clientes desvinculados",
      description: `${selectedClients.length} cliente(s) desvinculado(s) do parceiro`,
    });
  };

  const unlinkedClients = clients.filter(client => !client.partner_id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parceiros e Clientes"
        description="Gerencie a relação entre parceiros e clientes"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partners List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Parceiros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {partners.map(partner => (
              <div
                key={partner.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPartner?.id === partner.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handlePartnerSelect(partner)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{partner.company_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Comissão: {(partner.commission_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Badge variant="secondary">{partner.clientCount} clientes</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Partner Clients */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedPartner 
                  ? `Clientes de ${selectedPartner.company_name}`
                  : 'Selecione um parceiro'
                }
              </div>
              {selectedPartner && selectedClients.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDesvinculateClients}
                  >
                    Desvincular ({selectedClients.length})
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPartner ? (
              <div className="space-y-4">
                {partnerClients.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedClients.length === partnerClients.length && partnerClients.length > 0}
                      onCheckedChange={handleSelectAllClients}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      Selecionar todos
                    </label>
                  </div>
                )}
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partnerClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Nenhum cliente vinculado a este parceiro
                        </TableCell>
                      </TableRow>
                    ) : (
                      partnerClients.map(client => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedClients.includes(client.id)}
                              onCheckedChange={(checked) => handleClientSelect(client.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{client.business_name}</TableCell>
                          <TableCell>{client.contact_name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>
                            <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>
                              {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Selecione um parceiro na lista ao lado para visualizar seus clientes
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Unlinked Clients */}
      {unlinkedClients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Clientes Não Vinculados ({unlinkedClients.length})
              </div>
              {selectedPartner && selectedClients.length > 0 && (
                <Button onClick={handleVinculateClients}>
                  Vincular ao {selectedPartner.company_name} ({selectedClients.length})
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unlinkedClients.map(client => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => handleClientSelect(client.id, !!checked)}
                        disabled={!selectedPartner}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{client.business_name}</TableCell>
                    <TableCell>{client.contact_name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPartnersAndClients;
