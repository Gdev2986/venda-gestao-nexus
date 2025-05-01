
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Users,
  Percent,
  Edit,
  Eye,
  Wallet,
  BarChart2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PartnersAdmin = () => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select(`
          *,
          clients:clients (id)
        `);
      
      if (error) throw error;
      
      // Count clients per partner
      const partnersWithClientCount = data.map(partner => ({
        ...partner,
        client_count: partner.clients ? partner.clients.length : 0
      }));
      
      setPartners(partnersWithClientCount || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast({
        title: "Erro ao carregar parceiros",
        description: "Não foi possível carregar os dados dos parceiros.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      id: "company_name",
      header: "Nome da Empresa",
      accessorKey: "company_name",
    },
    {
      id: "commission_rate",
      header: "Taxa de Comissão",
      accessorKey: "commission_rate",
      cell: (info) => `${Number(info.getValue()).toFixed(2)}%`,
    },
    {
      id: "client_count",
      header: "Clientes",
      accessorKey: "client_count",
    },
    {
      id: "total_commission",
      header: "Comissão Total",
      cell: () => "R$ 0,00", // Placeholder for actual data calculation
    },
    {
      id: "created_at",
      header: "Data Criação",
      accessorKey: "created_at",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm">
            <Wallet className="h-4 w-4 mr-1" /> Comissões
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

  const filteredPartners = partners.filter(partner =>
    partner.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Parceiros</h1>
          <p className="text-muted-foreground">
            Visualize, gerencie e edite todos os parceiros cadastrados.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Parceiro
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total de Parceiros</p>
            <p className="text-2xl font-bold">{partners.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Comissões Geradas</p>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Percent className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Taxa Média</p>
            <p className="text-2xl font-bold">
              {partners.length > 0 
                ? (partners.reduce((sum, p) => sum + Number(p.commission_rate), 0) / partners.length).toFixed(2)
                : 0}%
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <BarChart2 className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Média de Clientes</p>
            <p className="text-2xl font-bold">
              {partners.length > 0
                ? Math.round(partners.reduce((sum, p) => sum + p.client_count, 0) / partners.length)
                : 0}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome da empresa..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredPartners}
          currentPage={1}
          totalPages={1}
        />
      </Card>
    </div>
  );
};

export default PartnersAdmin;
