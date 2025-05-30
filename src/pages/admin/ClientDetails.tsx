
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { ClientMachinesTab } from "@/components/clients/ClientMachinesTab";
import { ClientBalanceEditor } from "@/components/clients/ClientBalanceEditor";
import { ClientFeePlanManager } from "@/components/clients/ClientFeePlanManager";
import { User, Building, Phone, Mail, MapPin, DollarSign } from "lucide-react";

const AdminClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClient = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setClient(data as Client);
    } catch (error) {
      console.error('Error fetching client:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do cliente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleBalanceUpdated = () => {
    fetchClient();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Carregando..."
          description="Carregando informações do cliente"
        />
        <div className="animate-pulse space-y-4">
          <Card>
            <CardContent className="h-48" />
          </Card>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Cliente não encontrado"
          description="O cliente solicitado não foi encontrado"
        />
      </div>
    );
  }

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={client.business_name}
        description={`Detalhes completos do cliente ${client.business_name}`}
      />
      
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(client.status)}
              <ClientBalanceEditor
                clientId={client.id}
                currentBalance={client.balance || 0}
                onBalanceUpdated={handleBalanceUpdated}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Contato</p>
                  <p className="font-medium">{client.contact_name || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{client.phone || 'Não informado'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-medium">{client.document || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">
                    {client.address ? 
                      `${client.address}${client.city ? `, ${client.city}` : ''}${client.state ? ` - ${client.state}` : ''}` :
                      'Não informado'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(client.balance || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs com Detalhes */}
      <Tabs defaultValue="machines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="machines">Máquinas</TabsTrigger>
          <TabsTrigger value="fee-plan">Plano de Taxas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="machines">
          <ClientMachinesTab clientId={client.id} />
        </TabsContent>
        
        <TabsContent value="fee-plan">
          <ClientFeePlanManager clientId={client.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminClientDetails;
