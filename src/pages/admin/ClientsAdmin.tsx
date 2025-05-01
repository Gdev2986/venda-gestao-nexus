
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  User,
  Wallet,
  Edit,
  Eye,
  Users,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ClientsAdmin = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          partners:partner_id (company_name),
          machines:machines (id)
        `);
      
      if (error) throw error;
      
      // Count machines per client
      const clientsWithMachineCount = data.map(client => ({
        ...client,
        machine_count: client.machines ? client.machines.length : 0
      }));
      
      setClients(clientsWithMachineCount || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar os dados dos clientes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      id: "business_name",
      header: "Nome da Empresa",
      accessorKey: "business_name",
    },
    {
      id: "document",
      header: "Documento",
      accessorKey: "document",
      cell: (info) => info.getValue() || "Não informado",
    },
    {
      id: "partner",
      header: "Parceiro",
      accessorKey: "partners.company_name",
      cell: (info) => info.getValue() || "Sem parceiro",
    },
    {
      id: "machine_count",
      header: "Máquinas",
      accessorKey: "machine_count",
      cell: (info) => (
        <Badge variant="outline" className="bg-blue-50">
          {info.getValue()}
        </Badge>
      ),
    },
    {
      id: "created_at",
      header: "Data Criação",
      accessorKey: "created_at",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: "balance",
      header: "Saldo",
      cell: () => (
        <div className="text-right font-medium">R$ 0,00</div>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm">
            <Wallet className="h-4 w-4 mr-1" /> Saldo
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Detalhes
          </Button>
        </div>
      ),
    },
  ];

  const filteredClients = clients.filter(client =>
    client.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.document && client.document.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.partners?.company_name && client.partners.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
          <p className="text-muted-foreground">
            Visualize, gerencie e edite todos os clientes cadastrados.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Cliente
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total de Clientes</p>
            <p className="text-2xl font-bold">{clients.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Saldo Total</p>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Com Parceiros</p>
            <p className="text-2xl font-bold">{clients.filter(c => c.partner_id).length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Novos (30d)</p>
            <p className="text-2xl font-bold">
              {clients.filter(c => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return new Date(c.created_at) >= thirtyDaysAgo;
              }).length}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, documento ou parceiro..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredClients}
          currentPage={1}
          totalPages={1}
        />
      </Card>
    </div>
  );
};

export default ClientsAdmin;
