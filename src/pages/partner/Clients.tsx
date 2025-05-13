
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const PartnerClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch partner's profile to get partner ID
        const { data: partnerData, error: partnerError } = await supabase
          .from('partner_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (partnerError) {
          throw new Error("Não foi possível recuperar suas informações de parceiro");
        }
        
        const partnerId = partnerData?.id;
        
        if (!partnerId) {
          throw new Error("ID de parceiro não encontrado");
        }
        
        // Fetch clients for this partner
        const { data: clientData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .eq('partner_id', partnerId);
          
        if (clientsError) {
          throw new Error("Erro ao buscar clientes");
        }
        
        setClients(clientData || []);
      } catch (err: any) {
        console.error('Error fetching clients:', err);
        setError(err.message || "Ocorreu um erro ao carregar os clientes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [user]);

  const filteredClients = clients.filter(client => 
    client.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (clientId: string) => {
    navigate(PATHS.PARTNER.CLIENT_DETAILS(clientId));
  };

  return (
    <div>
      <PageHeader 
        title="Meus Clientes" 
        description="Gerencie os clientes associados à sua conta de parceiro"
      >
        <Button onClick={() => navigate("/partner/clients/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </PageHeader>
      
      <PageWrapper>
        <div className="space-y-6">
          {/* Search and filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {/* Clients list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lista de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-medium text-destructive">{error}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tente novamente mais tarde ou contate o suporte
                  </p>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "Nenhum cliente encontrado para esta busca" : "Nenhum cliente registrado ainda"}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredClients.map((client) => (
                    <Card 
                      key={client.id} 
                      className="cursor-pointer hover:bg-accent/5 transition-colors"
                      onClick={() => handleViewClient(client.id)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{client.business_name}</h3>
                        {client.contact_name && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Contato: {client.contact_name}
                          </p>
                        )}
                        {client.email && (
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {client.email}
                          </p>
                        )}
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {client.status === 'active' ? 'Ativo' : 
                             client.status === 'pending' ? 'Pendente' : 'Inativo'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
};

export default PartnerClients;
